import crypto from 'crypto';
import pool from '../database/pool.js';
import bcrypt from 'bcrypt';
import { logger } from '../middleware/logger.js';

export async function checkCustomer(email, password) {
    return checkUser(email, password, 'SELECT user_id, password FROM customer WHERE email = ?');
};

export async function checkStaff(email, password) {
    return checkUser(email, password, 'SELECT user_id, password FROM staff WHERE email = ?');
};

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


export async function createSessionAndOverwrite(userId, expirationMinutes) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(64).toString('hex');
    logger.debug(`createSessionAndOverwrite(${userId})`);
    try {
        // Delete only expired sessions
        await pool.query(
            'DELETE FROM sakila.session_verification WHERE user_id = ? AND timestamp < (NOW() - INTERVAL ? MINUTE)',
            [userId, expirationMinutes]
        );

        // Insert the new session
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

