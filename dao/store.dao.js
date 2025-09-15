import pool from '../database/pool.js';
import { invalidNumber } from '../helper/validation.helper.js';
import { logger } from '../middleware/logger.js';

/**
 * Get the adress of a store
 * @param {*} store_id SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getStoreAddressFromDatabase(store_id, callback) {
    // store_id must be already sanitized at this point
    if (invalidNumber(store_id, 0, Infinity)) throw new Error(`Number: "${store_id}"\nDid you not sanitize your inputs??`);
    pool.query(`SELECT 
    a.address,
    a.address2,
    a.district,
    a.city_id,
    a.postal_code,
    a.phone,
    c.city AS city_name,
    c.country_id,
    co.country AS country_name
FROM store s
JOIN address a ON s.address_id = a.address_id
JOIN city c ON a.city_id = c.city_id
JOIN country co ON c.country_id = co.country_id
WHERE s.store_id = ?;
`, [store_id], (err, results) => {
        if (err) {
            logger.error(`error at 'getStoreAddressFromDatabase' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(404);
        }
        return callback(results);
    });
}