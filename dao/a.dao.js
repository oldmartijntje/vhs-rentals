import pool from '../database/pool.js';

/**
 * Fetches the title of the first film
 * @param {function} callback (err, data) => void
 */
export function fetchA(callback) {
    pool.query('SELECT title FROM film LIMIT 1', (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] ? results[0].title : 'No film data');
    });
}

/**
 * Fetches the name of the first actor
 * @param {function} callback (err, data) => void
 */
export function fetchB(callback) {
    pool.query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM actor LIMIT 1", (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] ? results[0].name : 'No actor data');
    });
}
