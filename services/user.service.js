import { logger } from "../middleware/logger.js";
import { settings } from "../server.js";
import { checkUser } from "../dao/user.dao.js";
import { getAddressesById } from "../dao/address.dao.js";

/**
 * Get all data from the user, by it's user_id
 * @param {*} user_id 
 * @param {*} callback 
 */
export function getDataByUserId(user_id, callback) {
    checkUser(user_id, callback);
}

/**
 * Get all data from the user, by it's user_id + address info
 * @param {*} userId 
 * @param {*} callback 
 */
export function getAccountData(userId, callback) {
    checkUser(userId, (result) => {
        if (result == null || result[0] == undefined) {
            callback(null);
        }
        if (result[0].address_id != undefined) {
            getAddressesById([result[0].address_id], (result2) => {
                if (result2 == null) {
                    callback(null);
                } else {
                    result[0].address = result2[0];
                    result[0].password = undefined;
                    result[0].store_id = undefined;
                    callback(result[0])
                }
            });
        }
    })
}