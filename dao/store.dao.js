import pool from '../database/pool.js';
import { invalidNumber } from '../helper/validation.helper.js';
import { logger } from '../middleware/logger.js';

/**
 * Get the adress of a store
 * @param {*} store_id SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getStoreAddressesFromDatabase(store_ids, callback) {
    // store_ids must be an array of numbers, already sanitized
    if (!Array.isArray(store_ids) || store_ids.length === 0) {
        throw new Error("store_ids must be a non-empty array of numbers");
    }
    store_ids.forEach(id => {
        if (invalidNumber(id, 0, Infinity)) {
            throw new Error(`Number: "${id}"\nDid you not sanitize your inputs??`);
        }
    });

    const sql = `
        SELECT 
            a.address,
            a.address2,
            a.district,
            a.city_id,
            a.postal_code,
            s.manager_staff_id,
            a.phone,
            c.city AS city_name,
            c.country_id,
            co.country AS country_name
        FROM store s
        JOIN address a ON s.address_id = a.address_id
        JOIN city c ON a.city_id = c.city_id
        JOIN country co ON c.country_id = co.country_id
        WHERE s.store_id IN (?);
    `;

    pool.query(sql, [store_ids], (err, results) => {
        if (err) {
            logger.error(`error at 'getStoreAddressesFromDatabase' method: ${err}`);
            return callback(null);
        }
        if (!results || results.length === 0) {
            return callback(404);
        }
        return callback(results);
    });
}
