import pool from '../database/pool.js';
import bcrypt from 'bcrypt';

export const checkUser = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT customer_id, password FROM customer WHERE email = ?', [email], async (err, results) => {
            if (err) return reject(err);

            if (!results[0]) {
                return resolve(null);
            }

            const { customer_id, password: hash } = results[0];

            try {
                const isValid = await bcrypt.compare(password, hash);
                if (isValid) {
                    resolve(customer_id);
                } else {
                    resolve(null);
                }
            } catch (compareErr) {
                reject(compareErr);
            }
        });
    });
};

