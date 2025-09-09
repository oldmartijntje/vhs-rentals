import crypto from 'crypto';
import pool from '../database/pool.js';
import bcrypt from 'bcrypt';
import { logger } from '../middleware/logger.js';

export const checkCustomer = async (email, password) => {
    try {
        const [results] = await pool.query('SELECT user_id, password FROM customer WHERE email = ?', [email]);
        if (!results[0]) {
            return null;
        }
        const { user_id, password: hash } = results[0];
        const isValid = await bcrypt.compare(password, hash);
        return isValid ? user_id : null;
    } catch (err) {
        throw err;
    }
};


export async function createSessionAndOverwrite(userId) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(64).toString('hex');
    logger.debug(`createSessionAndOverwrite(${userId})`)
    try {
        // Delete old sessions
        await pool.query(
            'DELETE FROM sakila.session_verification WHERE user_id = ?',
            [userId]
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
