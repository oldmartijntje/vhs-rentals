import pool from '../database/pool.js';
import { invalidNumber } from '../helper/validation.helper.js';
import { logger } from '../middleware/logger.js';

/**
 * 
 * @param {*} amount SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getRecentFilmsFromDatabase(amount, callback) {
    // amount must be already sanitized at this point
    if (invalidNumber(amount, 1, 100)) throw new Error("Did you not sanitize your inputs??");
    pool.query(`SELECT * FROM film ORDER BY film.film_id DESC LIMIT ${amount}`, (err, results) => {
        if (err) {
            logger.error(`error at 'getRecentFilms' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(null);
        }
        return callback(results);
    });
}

