import crypto from 'crypto';
import pool from '../database/pool.js';
import bcrypt from 'bcrypt';
import { logger } from '../middleware/logger.js';
import { invalidNumber } from '../helper/validation.helper.js';

/**
 * DB query for getting user data
 * @param {*} userId ALREADY SANITIZED BEFOREHAND
 * @param {function} callback (user_id|null) => void
 */
export function checkUser(userId, callback) {
    if (invalidNumber(userId, 0, 0, true)) throw new Error(`Number: "${userId}"\nDid you not sanitize your inputs??`);
    pool.query(`SELECT 
    u.user_id,
    u.user_type,
    COALESCE(c.store_id, s.store_id) AS store_id,
    COALESCE(c.first_name, s.first_name) AS first_name,
    COALESCE(c.last_name, s.last_name) AS last_name,
    COALESCE(c.email, s.email) AS email,
    COALESCE(c.address_id, s.address_id) AS address_id,
    COALESCE(c.active, s.active) AS active,
    COALESCE(c.last_update, s.last_update) AS last_update,
    COALESCE(c.password, s.password) AS password,
    c.create_date,
    c.customer_id,
    s.staff_id,
    s.username,
    s.picture
FROM \`user\` u
LEFT JOIN customer c ON u.user_id = c.user_id AND u.user_type = 'customer'
LEFT JOIN staff s ON u.user_id = s.user_id AND u.user_type = 'staff'
WHERE u.user_id IN (${userId});`, (err, results) => {
        if (err) {
            logger.error(`error at 'checkUser' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(null);
        }
        return callback(results);
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

/**
 * DB query method to verify a session token
 * @param {*} userId 
 * @param {*} sessionToken 
 * @param {*} expirationMinutes 
 * @param {function} callback (boolean) => void
 */
export function verifySessionToken(userId, sessionToken, expirationMinutes, callback) {
    pool.query(
        `SELECT timestamp FROM sakila.session_verification WHERE session_token = ? AND user_id = ?`,
        [sessionToken, userId],
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
