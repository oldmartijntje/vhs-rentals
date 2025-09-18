import pool from '../database/pool.js';
import { invalidNumber } from '../helper/validation.helper.js';
import { logger } from '../middleware/logger.js';

/**
 * Get the address information by address_id
 * @param {*} address_ids SANITIZED array of numbers
 * @param {function} callback (results|null|404) => void
 */
export function getAddressesById(address_ids, callback) {
    // address_ids must be a non-empty array of numbers, already sanitized
    if (!Array.isArray(address_ids) || address_ids.length === 0) {
        throw new Error("address_ids must be a non-empty array of numbers");
    }
    address_ids.forEach(id => {
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
            a.phone,
            c.city AS city_name,
            c.country_id,
            co.country AS country_name
        FROM address a
        JOIN city c ON a.city_id = c.city_id
        JOIN country co ON c.country_id = co.country_id
        WHERE a.address_id IN (?);
    `;

    pool.query(sql, [address_ids], (err, results) => {
        if (err) {
            logger.error(`error at 'getAddressesById' method: ${err}`);
            return callback(null);
        }
        if (!results || results.length === 0) {
            return callback(404);
        }
        return callback(results);
    });
}