import { logger } from "../middleware/logger.js"
import { getRecentFilmsFromDatabase, getFullFilmInfoById } from "../dao/film.dao.js"
import { getInventoryStatusFromDatabase } from "../dao/inventory.dao.js";
import { getStoreAddressesFromDatabase } from "../dao/store.dao.js";

/**
 * The code that gets X recent films. 
 * @param {*} amount 
 * @param {function} callback (result|null) => void
 */
export function getRecentFilms(amount, callback) {
    getRecentFilmsFromDatabase(amount, callback)
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
                const counts = result2.reduce(
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
                    result[0].inventory = null;
                    result[0].informationId = 2;
                    callback(result);
                    return;
                } else if (result2 == 404) {
                    result[0].inventory = 404;
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