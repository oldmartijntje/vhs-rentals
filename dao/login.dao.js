import pool from '../database/pool.js';
import bcrypt from 'bcrypt';

export const checkUser = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT password FROM customer WHERE email = ?', [email], async (err, results) => {
            if (err) return reject(err);

            if (!results[0]) {
                return resolve(false);
            }

            const hash = results[0].password;

            try {
                const isValid = await bcrypt.compare(password, hash);
                resolve(isValid);
            } catch (compareErr) {
                reject(compareErr);
            }
        });
    });
};
