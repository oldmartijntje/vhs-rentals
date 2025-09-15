import pool from '../database/pool.js';
import { invalidNumber } from '../helper/validation.helper.js';
import { logger } from '../middleware/logger.js';

/**
 * Get the most recent films from the library
 * @param {*} amount SANITIZED
 * @param {function} callback (user_id|null) => void
 */
export function getRecentFilmsFromDatabase(amount, callback) {
    // amount must be already sanitized at this point
    if (invalidNumber(amount, 1, 100)) throw new Error(`Number: "${amount}"\nDid you not sanitize your inputs??`);
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

/**
 * Gets all info from the film
 * @param {*} id SANITIZED
 * @param {function} callback (user_id|null|404) => void
 */
export function getFullFilmInfoById(id, callback) {
    // id must be already sanitized at this point
    if (invalidNumber(id, 0, Infinity)) throw new Error(`Number: "${id}"\nDid you not sanitize your inputs??`);
    pool.query(`select
    film.film_id AS FID,
    film.title AS title,
    film.description AS description,
    category.name AS category,
    film.rental_rate AS price,
    film.length AS length,
    film.rating AS rating,
    group_concat(concat(actor.first_name, _utf8mb4' ', actor.last_name) separator ', ') AS actors
from
    ((((film
left join film_category on
    (film_category.film_id = film.film_id))
left join category on
    (category.category_id = film_category.category_id))
left join film_actor on
    (film.film_id = film_actor.film_id))
left join actor on
    (film_actor.actor_id = actor.actor_id))
where
    film.film_id = ?
group by
    film.film_id,
    category.name;
`, [id], (err, results) => {
        if (err) {
            logger.error(`error at 'getFullFilmInfoById' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(404);
        }
        return callback(results);
    });
}
