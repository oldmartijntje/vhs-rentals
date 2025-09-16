import pool from '../database/pool.js';
import { logger } from '../middleware/logger.js';

export function addCategoryToDatabase(name, callback) {
    pool.query(
        `SELECT category_id FROM sakila.category WHERE name = ?`,
        [name],
        (err, results) => {
            if (err) {
                console.error(`Error at 'addCategory (SELECT)':`, err);
                return callback(null);
            }
            if (results.length > 0) {
                return callback(results[0].category_id);
            }

            pool.query(
                `INSERT INTO sakila.category (name) VALUES (?)`,
                [name],
                (err, results) => {
                    if (err) {
                        console.error(`Error at 'addCategory (INSERT)':`, err);
                        return callback(null);
                    }
                    return callback(results.insertId);
                }
            );
        }
    );
}

export function linkFilmCategory(filmId, categoryId, callback) {
    pool.query(
        `INSERT INTO sakila.film_category (film_id, category_id) VALUES (?, ?)`,
        [filmId, categoryId],
        (err) => {
            if (err) {
                console.error(`Error at 'linkFilmCategory':`, err);
            }
            callback();
        }
    );
}