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
    film.release_year AS release_year,
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

/**
 * adds a new film to the database
 * @param {*} title 
 * @param {*} description 
 * @param {*} price 
 * @param {*} length 
 * @param {*} rating 
 * @param {*} release_year 
 * @param {*} callback 
 */
export function addNewFilmToDatabase(title, description, price, length, rating, release_year, callback) {
    pool.query(
        `INSERT INTO sakila.film (title, description, rental_rate, length, rating, release_year, language_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, price, length, rating, release_year, 1],
        (err, results) => {
            if (err) {
                console.error(`Error at 'addNewFilmToDatabase' method:`, err);
                return callback(null);
            }
            return callback(results.insertId);
        }
    );
}

/**
 * Updates a film in the database
 * @param {*} filmId 
 * @param {*} title 
 * @param {*} description 
 * @param {*} price 
 * @param {*} length 
 * @param {*} rating 
 * @param {*} release_year 
 * @param {*} callback 
 */
export function updateFilmInDatabase(filmId, title, description, price, length, rating, release_year, callback) {
    pool.query(
        `UPDATE sakila.film 
     SET title = ?, description = ?, rental_rate = ?, length = ?, rating = ?, release_year = ?
     WHERE film_id = ?`,
        [title, description, price, length, rating, release_year, filmId],
        (err, results) => {
            if (err) {
                console.error(`Error at 'updateFilmInDatabase':`, err);
                return callback(false);
            }
            return callback(results.affectedRows > 0);
        }
    );
}

/**
 * remove a film from the database
 * @param {*} filmId 
 * @param {*} callback 
 */
export function removeFilmFromDatabase(filmId, callback) {
    pool.query(`DELETE FROM sakila.film WHERE film_id = ?`, [filmId], (err, results) => {
        if (err) {
            console.error(`Error at 'removeFilmFromDatabase':`, err);
            return callback(false);
        }
        callback(results.affectedRows > 0);
    });
}

/**
 * Get all films from page, this means you can set page size and which page you are on.
 * @param {*} itemsPerPage 
 * @param {*} offset 
 * @param {*} callback 
 */
export function getAllFilmsFromPage(itemsPerPage, offset, callback) {
    const limit = Number(itemsPerPage);
    const off = Number(offset);

    pool.query(
        `SELECT * FROM sakila.film LIMIT ${limit} OFFSET ${off}`,
        (err, results) => {
            if (err) {
                console.error(`Error at 'getAllFilmsFromPage':`, err);
                return callback(false);
            }
            callback(results);
        }
    );
}

/**
 * Get the amount of films
 * @param {*} callback 
 */
export function getFilmsCount(callback) {
    pool.query(
        `SELECT COUNT(*) AS total_films FROM sakila.film`,
        (err, results) => {
            if (err) {
                console.error(`Error at 'getFilmsCount':`, err);
                return callback(false);
            }
            // results[0].total_films will hold the count
            callback(results[0].total_films);
        }
    );
}
