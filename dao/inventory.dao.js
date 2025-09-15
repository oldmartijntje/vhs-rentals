import pool from '../database/pool.js';
import { invalidNumber } from '../helper/validation.helper.js';
import { logger } from '../middleware/logger.js';

/**
 * Get the status of all items in inventory
 * @param {*} film_id SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getInventoryStatusFromDatabase(film_id, callback) {
    // film_id must be already sanitized at this point
    if (invalidNumber(film_id, 0, Infinity)) throw new Error(`Number: "${film_id}"\nDid you not sanitize your inputs??`);
    pool.query(`SELECT 
    i.inventory_id,
    i.store_id,
    CASE 
        WHEN r.rental_id IS NOT NULL THEN 1
        ELSE 0
    END AS currently_rented_out
FROM inventory i
LEFT JOIN rental r 
    ON i.inventory_id = r.inventory_id
   AND r.rental_date < NOW()
   AND r.return_date > NOW()
WHERE i.film_id = ?;
`, [film_id], (err, results) => {
        if (err) {
            logger.error(`error at 'getInventoryStatusFromDatabase' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(404);
        }
        return callback(results);
    });
}

/**
 * Get the status of all items in inventory, with the store adress linked
 * This is a seperate function because doing 2 querys is less fast than 1 big query.
 * @param {*} film_id SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getInventoryStatusWithAddressFromDatabase(film_id, callback) {
    // film_id must be already sanitized at this point
    if (invalidNumber(film_id, 0, Infinity)) throw new Error(`Number: "${film_id}"\nDid you not sanitize your inputs??`);
    pool.query(`SELECT 
    i.inventory_id,
    CASE 
        WHEN r.rental_id IS NOT NULL THEN 1
        ELSE 0
    END AS currently_rented_out,
    s.store_id,
    a.address,
    a.address2,
    a.district,
    a.postal_code,
    a.phone,
    c.city AS city,
    c.country_id,
    co.country AS country
FROM inventory i
LEFT JOIN rental r 
    ON i.inventory_id = r.inventory_id
   AND r.rental_date < NOW()
   AND r.return_date > NOW()
INNER JOIN store s
    ON i.store_id = s.store_id
INNER JOIN address a
    ON s.address_id = a.address_id
INNER JOIN city c
    ON a.city_id = c.city_id
INNER JOIN country co
    ON c.country_id = co.country_id
WHERE i.film_id = ?;
`, [film_id], (err, results) => {
        if (err) {
            logger.error(`error at 'getInventoryStatusFromDatabase' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(404);
        }
        return callback(results);
    });
}