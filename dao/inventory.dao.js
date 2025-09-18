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
 * Get the status of all items in inventory
 * @param {*} film_id SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getDetailedInventoryStatusFromDatabase(film_id, callback) {
    // film_id must be already sanitized at this point
    if (invalidNumber(film_id, 0, Infinity)) throw new Error(`Number: "${film_id}"\nDid you not sanitize your inputs??`);
    pool.query(`SELECT 
    i.inventory_id,
    i.store_id,
    CONCAT(a.address, ', ', ci.city, ', ', co.country) AS store_address,
    -- rented boolean: true if rented and not yet returned
    CASE 
        WHEN r.rental_date IS NOT NULL 
             AND r.rental_date <= NOW()
             AND r.return_date IS NULL 
        THEN TRUE
        ELSE FALSE
    END AS rented,
    r.customer_id AS last_customer_id,
    r.rental_id   AS last_rental_id
FROM inventory i
JOIN store s ON i.store_id = s.store_id
JOIN address a ON s.address_id = a.address_id
JOIN city ci ON a.city_id = ci.city_id
JOIN country co ON ci.country_id = co.country_id
LEFT JOIN (
    -- Get the latest rental for each inventory_id
    SELECT r1.*
    FROM rental r1
    JOIN (
        SELECT inventory_id, MAX(rental_date) AS max_rental_date
        FROM rental
        GROUP BY inventory_id
    ) r2 ON r1.inventory_id = r2.inventory_id 
         AND r1.rental_date = r2.max_rental_date
) r ON i.inventory_id = r.inventory_id
WHERE i.film_id = ?;

`, [film_id], (err, results) => {
        if (err) {
            logger.error(`error at 'getDetailedInventoryStatusFromDatabase' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(404);
        }
        return callback(results);
    });
}