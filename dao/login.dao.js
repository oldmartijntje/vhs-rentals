import crypto from 'crypto';
import pool from '../database/pool.js';
import bcrypt from 'bcrypt';
import { logger } from '../middleware/logger.js';

/**
 * DB query for checking the email + password login of a customer
 * @param {*} email 
 * @param {*} password 
 * @param {function} callback (user_id|null) => void
 */
export function checkCustomer(email, password, callback) {
    checkUser(email, password, 'SELECT user_id, password FROM customer WHERE email = ?', callback);
}

/**
 * DB query for checking the email + password login of a staff member
 * @param {*} email 
 * @param {*} password 
 * @param {function} callback (user_id|null) => void
 */
export function checkStaff(email, password, callback) {
    checkUser(email, password, 'SELECT user_id, password FROM staff WHERE email = ?', callback);
}

/**
 * DB query for checking the email + password login of a user
 * @param {*} email 
 * @param {*} password 
 * @param {*} query 
 * @param {function} callback (user_id|null) => void
 */
function checkUser(email, password, query, callback) {
    pool.query(query, [email], (err, results) => {
        if (err) {
            logger.error(`error at 'checkUser' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(null);
        }
        const { user_id, password: hash } = results[0];
        bcrypt.compare(password, hash, (err, isValid) => {
            if (err) {
                logger.error(`bcrypt error: ${err}`);
                return callback(null);
            }
            return callback(isValid ? user_id : null);
        });
    });
}

/**
 * A DB method to create a session token, and to delete ALL expired refresh tokens
 * @param {*} userId 
 * @param {*} expirationMinutes 
 * @param {function} callback ({sessionToken, refreshToken}) => void
 */
export function createSession(userId, expirationMinutes, callback) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(64).toString('hex');
    logger.debug(`createSessionAndOverwrite(${userId})`);
    pool.query(
        'DELETE FROM sakila.session_verification WHERE timestamp < (NOW() - INTERVAL ? MINUTE)',
        [expirationMinutes],
        (err) => {
            if (err) {
                console.error('Error deleting expired sessions:', err);
                return callback({ sessionToken: null, refreshToken: null });
            }
            pool.query(
                `INSERT INTO sakila.session_verification (session_token, refresh_token, user_id, timestamp)
                 VALUES (?, ?, ?, NOW())`,
                [sessionToken, refreshToken, userId],
                (err) => {
                    if (err) {
                        console.error('Error creating session:', err);
                        return callback({ sessionToken: null, refreshToken: null });
                    }
                    return callback({ sessionToken, refreshToken });
                }
            );
        }
    );
}

/**
 * DB query method to Delete a refresh token
 * @param {*} refreshToken 
 * @param {function} callback () => void
 */
export function deleteRefreshToken(refreshToken, callback) {
    pool.query(
        'DELETE FROM sakila.session_verification WHERE refresh_token = ?',
        [refreshToken],
        (err) => {
            if (callback) callback();
        }
    );
}

/**
 * DB query method to verify a refresh token
 * @param {*} userId 
 * @param {*} refreshToken 
 * @param {*} expirationMinutes 
 * @param {function} callback (boolean) => void
 */
export function verifyRefreshToken(userId, refreshToken, expirationMinutes, callback) {
    pool.query(
        `SELECT timestamp FROM sakila.session_verification WHERE refresh_token = ? AND user_id = ?`,
        [refreshToken, userId],
        (err, rows) => {
            if (err || !rows || rows.length === 0) {
                return callback(false);
            }
            const { timestamp } = rows[0];
            const now = new Date();
            const tokenTime = new Date(timestamp);
            const diffMinutes = (now - tokenTime) / (1000 * 60);
            return callback(diffMinutes <= expirationMinutes);
        }
    );
}

