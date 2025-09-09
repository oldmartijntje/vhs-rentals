import pool from '../database/pool.js';
import bcrypt from 'bcrypt';

export const checkCustomer = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_id, password FROM customer WHERE email = ?', [email], async (err, results) => {
            if (err) return reject(err);

            if (!results[0]) {
                return resolve(null);
            }

            const { user_id, password: hash } = results[0];

            try {
                const isValid = await bcrypt.compare(password, hash);
                if (isValid) {
                    resolve(user_id);
                } else {
                    resolve(null);
                }
            } catch (compareErr) {
                reject(compareErr);
            }
        });
    });
};

