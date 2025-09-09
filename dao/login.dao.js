import crypto from 'crypto';
import pool from '../database/pool.js';
import bcrypt from 'bcrypt';
import { logger } from '../middleware/logger.js';

/**
 * DB query for checking the email + password login of a customer
 * @param {*} email 
 * @param {*} password 
 * @returns `null | user_id`
 */
export async function checkCustomer(email, password) {
    return checkUser(email, password, 'SELECT user_id, password FROM customer WHERE email = ?');
};

/**
 * DB query for checking the email + password login of a staff member
 * @param {*} email 
 * @param {*} password 
 * @returns `null | user_id`
 */
export async function checkStaff(email, password) {
    return checkUser(email, password, 'SELECT user_id, password FROM staff WHERE email = ?');
};

/**
 * DB query for checking the email + password login of an user
 * @param {*} email 
 * @param {*} password 
 * @returns `null | user_id`
 */
async function checkUser(email, password, query) {
    try {
        const [results] = await pool.query(query, [email]);
        if (!results[0]) {
            return null;
        }
        const { user_id, password: hash } = results[0];
        const isValid = await bcrypt.compare(password, hash);
        return isValid ? user_id : null;
    } catch (err) {
        logger.error(`error at 'checkUser' method: ${err}`)
        return null;
    }
}

/**
 * A DB method to create an session token, and to delete ALL expired refresh tokens
 * @param {*} userId 
 * @param {*} expirationMinutes 
 * @returns `{ sessionToken: null, refreshToken: null }`
 */
export async function createSession(userId, expirationMinutes) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(64).toString('hex');
    logger.debug(`createSessionAndOverwrite(${userId})`);
    try {
        await pool.query(
            'DELETE FROM sakila.session_verification WHERE timestamp < (NOW() - INTERVAL ? MINUTE)',
            [expirationMinutes]
        );

        await pool.query(
            `INSERT INTO sakila.session_verification (session_token, refresh_token, user_id, timestamp)
             VALUES (?, ?, ?, NOW())`,
            [sessionToken, refreshToken, userId]
        );

        return { sessionToken, refreshToken };
    } catch (err) {
        console.error('Error creating session:', err);
        return { sessionToken: null, refreshToken: null };
    }
}

/**
 * DB query method to Delete an refresh token
 * @param {*} refreshToken 
 * @returns 
 */
export async function deleteRefreshToken(refreshToken) {
    await pool.query(
        'DELETE FROM sakila.session_verification WHERE refresh_token = ?',
        [refreshToken]
    );
    return;
}

/**
 * DB query method to vrify a refresh token
 * @param {*} userId 
 * @param {*} refreshToken 
 * @param {*} expirationMinutes 
 * @returns `boolean`
 */
export async function verifyRefreshToken(userId, refreshToken, expirationMinutes) {
    const [rows] = await pool.query(
        `SELECT timestamp FROM sakila.session_verification WHERE refresh_token = ? AND user_id = ?`,
        [refreshToken, userId]
    );
    if (rows.length === 0) {
        return false;
    }
    const { timestamp } = rows[0];
    const now = new Date();
    const tokenTime = new Date(timestamp);

    const diffMinutes = (now - tokenTime) / (1000 * 60);

    // Return true if token is still valid
    return diffMinutes <= expirationMinutes;
}

