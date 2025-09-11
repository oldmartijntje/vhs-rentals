import { logger } from "../middleware/logger.js"
import { getRecentFilmsFromDatabase } from "../dao/film.dao.js"

/**
 * The code that gets X recent films. 
 * @param {*} amount 
 * @param {function} callback (result|null) => void
 */
export function getRecentFilms(amount, callback) {
    getRecentFilmsFromDatabase(amount, callback)
}