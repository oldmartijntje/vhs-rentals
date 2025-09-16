import { logger } from "../middleware/logger.js"
import { getRecentFilmsFromDatabase, getFullFilmInfoById, addNewFilmToDatabase } from "../dao/film.dao.js"
import { addCategoryToDatabase, linkFilmCategory } from "../dao/category.dao.js"
import { getInventoryStatusFromDatabase } from "../dao/inventory.dao.js";
import { getStoreAddressesFromDatabase } from "../dao/store.dao.js";
import { addActors, linkFilmActors } from "../dao/actor.dao.js";

/**
 * The code that gets X recent films. 
 * @param {*} amount 
 * @param {function} callback (result|null) => void
 */
export function getRecentFilms(amount, callback) {
    getRecentFilmsFromDatabase(amount, callback)
}

function countCopies(result) {
    return result.reduce(
        (acc, item) => {
            if (item.currently_rented_out === 1) {
                acc.rented++;
            } else {
                acc.available++;
            }
            return acc;
        },
        { rented: 0, available: 0 }
    );
}

/**
 * The code that gets the data of a film
 * @param {*} id 
 * @param {*} isAuthenticated 
 * @param {function} callback (result|null) => void
 */
export function getFilmData(id, isAuthenticated, callback) {
    getFullFilmInfoById(id, (result) => {
        if (result == null) {
            callback(null);
            return;
        } else if (result == 404) {
            callback(404);
            return;
        }
        getInventoryStatusFromDatabase(id, (result2) => {
            if (result2 == null) {
                result[0].inventory = null;
                result[0].informationId = 0;
                callback(result);
                return;
            } else if (result2 == 404) {
                result[0].inventory = 404;
                result[0].informationId = 0;
                callback(result);
                return;
            } else if (!isAuthenticated) {
                const counts = countCopies(result2);
                result[0].inventory = (counts.available > 0 ? true : false)
                result[0].informationId = 1;
                callback(result);
                return;
            }
            const uniqueStoreIds = [...new Set(result2.map(item => item.store_id))];
            result[0].inventory = result2;
            //  getStoreAddressFromDatabase
            getStoreAddressesFromDatabase(uniqueStoreIds, (result3) => {
                if (result2 == null) {
                    const counts = countCopies(result2);
                    result[0].inventory = counts;
                    result[0].informationId = 2;
                    callback(result);
                    return;
                } else if (result2 == 404) {
                    const counts = countCopies(result2);
                    result[0].inventory = counts;
                    result[0].informationId = 2;
                    callback(result);
                    return;
                }
                result[0].addresses = result3;
                result[0].informationId = 3;
                callback(result);
                return;
            });
        })
    })
}

/**
 * Add a film to database (and actors / category if they are new)
 * @param {*} title 
 * @param {*} description 
 * @param {*} category 
 * @param {*} price 
 * @param {*} length 
 * @param {*} rating 
 * @param {*} release_year 
 * @param {*} actors 
 * @param {*} callback 
 */
export function addNewFilm(title, description, category, price, length, rating, release_year, actors, callback) {
    addNewFilmToDatabase(title.toUpperCase(), description, price, length, rating, release_year, (filmId) => {
        if (!filmId) return callback(null);

        addCategoryToDatabase(category.toUpperCase(), (categoryId) => {
            if (!categoryId) return callback(null);

            linkFilmCategory(filmId, categoryId, () => {
                addActors(actors.toUpperCase(), (actorIds) => {
                    if (!actorIds) return callback(null);

                    linkFilmActors(filmId, actorIds, () => {
                        logger.debug(`Film ${filmId} successfully added with category + actors`);
                        callback(filmId);
                    });
                });
            });
        });
    });
}

/**
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} category 
 * @param {*} price 
 * @param {*} length 
 * @param {*} rating 
 * @param {*} release_year 
 * @param {*} actors 
 * @param {*} callback 
 */
export function updateFilm(title, description, category, price, length, rating, release_year, actors, callback) {

}

/**
 * 
 * @param {*} id 
 * @param {function} callback (result|null) => void
 */
export function removeFilm(id, callback) {

}