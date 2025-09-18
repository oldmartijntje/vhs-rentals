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
/**
 * Add a new item to inventory
 * @param {number} film_id - The film ID
 * @param {number} store_id - The store ID
 * @param {function} callback - Callback (err, result)
 */
export function addInventoryItemToDatabase(film_id, store_id, callback) {
    if (invalidNumber(film_id, 0, Infinity)) throw new Error(`Number: "${film_id}"\nDid you not sanitize your inputs??`);
    if (invalidNumber(store_id, 0, Infinity)) throw new Error(`Number: "${store_id}"\nDid you not sanitize your inputs??`);
    pool.query(
        `INSERT INTO inventory (film_id, store_id) VALUES (?, ?)`,
        [film_id, store_id],
        (err, result) => {
            if (err) {
                logger.error(`error at 'addInventoryItemToDatabase' method: ${err}`);
                return callback(null);
            }
            return callback(result.insertId);
        }
    );
}

/**
 * Set return_date of the latest open rental for an inventory item to NOW()
 * @param {number} inventory_id
 * @param {function} callback
 */
export function setRentalReturnedNow(inventory_id, callback) {
    if (invalidNumber(inventory_id, 0, Infinity)) throw new Error(`Number: "${inventory_id}"\nDid you not sanitize your inputs??`);
    // Find the latest rental for this inventory_id where return_date IS NULL
    pool.query(
        `UPDATE rental SET return_date = NOW()
         WHERE inventory_id = ?
           AND rental_date < NOW()
           AND return_date > NOW()`,
        [inventory_id],
        (err, result) => {
            if (err) {
                logger.error(`error at 'setRentalReturnedNow' method: ${err}`);
                return callback(null);
            }
            return callback(result.affectedRows > 0);
        }
    );
}

/**
 * Update store_id of an inventory item
 * @param {number} inventory_id
 * @param {number} store_id
 * @param {function} callback
 */
export function updateInventoryStoreId(inventory_id, store_id, callback) {
    if (invalidNumber(inventory_id, 0, Infinity)) throw new Error(`Number: "${inventory_id}"\nDid you not sanitize your inputs??`);
    if (invalidNumber(store_id, 0, Infinity)) throw new Error(`Number: "${store_id}"\nDid you not sanitize your inputs??`);
    pool.query(
        `UPDATE inventory SET store_id = ? WHERE inventory_id = ?`,
        [store_id, inventory_id],
        (err, result) => {
            if (err) {
                logger.error(`error at 'updateInventoryStoreId' method: ${err}`);
                return callback(null);
            }
            return callback(result.affectedRows > 0);
        }
    );
}

/**
 * Rent a copy of a film (create rental)
 * @param {number} inventory_id
 * @param {number} customer_id
 * @param {number} rental_period_days
 * @param {function} callback
 */
export function createRentalForCustomer(inventory_id, customer_id, rental_period_days, callback) {
    if (invalidNumber(inventory_id, 0, Infinity)) throw new Error(`Number: "${inventory_id}"\nDid you not sanitize your inputs??`);
    if (invalidNumber(customer_id, 0, Infinity)) throw new Error(`Number: "${customer_id}"\nDid you not sanitize your inputs??`);
    if (invalidNumber(rental_period_days, 1, 365)) throw new Error(`Number: "${rental_period_days}"\nDid you not sanitize your inputs??`);
    const dueDate = new Date(Date.now() + rental_period_days * 24 * 60 * 60 * 1000);
    // Format dueDate as MySQL DATETIME string
    const dueDateStr = dueDate.toISOString().slice(0, 19).replace('T', ' ');
    pool.query(
        `INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id)
         VALUES (NOW(), ?, ?, ?, 1)`,
        [inventory_id, customer_id, dueDateStr],
        (err, result) => {
            if (err) {
                logger.error(`error at 'createRentalForCustomer' method: ${err}`);
                return callback(null);
            }
            return callback({ success: true, rental_id: result.insertId, due_date: dueDate });
        }
    );
}

/**
 * Customer returns an inventory item if currently renting it
 * @param {number} inventory_id
 * @param {number} customer_id
 * @param {function} callback
 */
export function customerReturnInventoryItem(inventory_id, customer_id, callback) {
    if (invalidNumber(inventory_id, 0, Infinity)) throw new Error(`Number: "${inventory_id}"\nDid you not sanitize your inputs??`);
    if (invalidNumber(customer_id, 0, Infinity)) throw new Error(`Number: "${customer_id}"\nDid you not sanitize your inputs??`);
    // Find active rental for this customer and inventory item
    pool.query(
        `UPDATE rental SET return_date = NOW()
         WHERE inventory_id = ?
           AND customer_id = ?
           AND rental_date < NOW()
           AND return_date > NOW()`,
        [inventory_id, customer_id],
        (err, result) => {
            if (err) {
                logger.error(`error at 'customerReturnInventoryItem' method: ${err}`);
                return callback(null);
            }
            return callback(result.affectedRows > 0);
        }
    );
}