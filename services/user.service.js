import { logger } from "../middleware/logger.js";
import { settings } from "../server.js";
import { checkUser } from "../dao/user.dao.js";

/**
 * Get all data from the user, by it's user_id
 * @param {*} user_id 
 * @param {*} callback 
 */
export function getDataByUserId(user_id, callback) {
    checkUser(user_id, callback);
}

