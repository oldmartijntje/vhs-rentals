import pool from '../database/pool.js';
import { logger } from '../middleware/logger.js';

/**
 * add an actor
 * @param {*} actorString 
 * @param {*} callback 
 */
export function addActors(actorString, callback) {
    const actorNames = actorString.split(',').map((a) => a.trim());
    let actorIds = [];
    let i = 0;

    function next() {
        if (i >= actorNames.length) return callback(actorIds);

        const fullName = actorNames[i].split(' ');
        const first_name = fullName[0];
        const last_name = fullName.slice(1).join(' ');

        pool.query(
            `SELECT actor_id FROM sakila.actor WHERE first_name = ? AND last_name = ?`,
            [first_name, last_name],
            (err, results) => {
                if (err) {
                    console.error(`Error at 'addActors (SELECT)':`, err);
                    return callback(null);
                }
                if (results.length > 0) {
                    actorIds.push(results[0].actor_id);
                    i++;
                    return next();
                }

                pool.query(
                    `INSERT INTO sakila.actor (first_name, last_name) VALUES (?, ?)`,
                    [first_name, last_name],
                    (err, results) => {
                        if (err) {
                            console.error(`Error at 'addActors (INSERT)':`, err);
                            return callback(null);
                        }
                        actorIds.push(results.insertId);
                        i++;
                        return next();
                    }
                );
            }
        );
    }

    next();
}

/**
 * link an actor to a film in the film_actor table
 * @param {*} filmId 
 * @param {*} actorIds 
 * @param {*} callback 
 */
export function linkFilmActors(filmId, actorIds, callback) {
    let i = 0;

    function next() {
        if (i >= actorIds.length) return callback();

        pool.query(
            `INSERT INTO sakila.film_actor (film_id, actor_id) VALUES (?, ?)`,
            [filmId, actorIds[i]],
            (err) => {
                if (err) {
                    console.error(`Error at 'linkFilmActors':`, err);
                }
                i++;
                next();
            }
        );
    }

    next();
}

/**
 * remove all items from a specific film in the film_actor.
 * used for updates / deletes on the film table
 * @param {*} filmId 
 * @param {*} callback 
 */
export function clearFilmActors(filmId, callback) {
    pool.query(`DELETE FROM sakila.film_actor WHERE film_id = ?`, [filmId], (err) => {
        if (err) console.error(`Error at 'clearFilmActors':`, err);
        callback();
    });
}
