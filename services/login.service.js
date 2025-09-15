import { checkCustomer, checkStaff, createSession, verifyRefreshToken, deleteRefreshToken, verifySessionToken } from "../dao/login.dao.js";
import { logger } from "../middleware/logger.js";
import { settings } from "../server.js";

/**
 * The code that validates whether an email and password combination are correct
 * @param {*} email 
 * @param {*} password 
 * @param {*} role `customer` or `staff`
 * @param {function} callback (result|null) => void
 */
export function loginViaCredentials(email, password, role, callback) {
    let checkFn = role === "customer" ? checkCustomer : checkStaff;
    checkFn(email, password, (customer_id) => {
        if (customer_id != null) {
            _generateSessionToken(customer_id, callback);
        } else {
            logger.warn('Invalid credentials.');
            callback(null);
            return;
        }
    });
}

/**
 * The code that validates whether an session token is linked to an user
 * @param {*} sessionToken 
 * @param {*} userId 
 * @param {function} callback (result|null) => void
 */
export function loginViaSesion(sessionToken, userId, callback) {
    verifySessionToken(userId, sessionToken, settings.maxTokenTime, callback);
}

/**
 * The code for generating a new session token. This method is meant to be private.
 * @param {*} customer_id 
 * @param {function} callback (result|null) => void
 */
function _generateSessionToken(customer_id, callback) {
    createSession(customer_id, settings.maxRefreshTokenTime, ({ sessionToken, refreshToken }) => {
        if (sessionToken == null || refreshToken == null) {
            callback(null);
            return;
        }
        callback({
            sessionToken,
            refreshToken,
            message: "success",
            expirationMinutes: settings.maxTokenTime,
            refreshExpirationMinutes: settings.maxRefreshTokenTime,
            userId: customer_id
        });
        return;
    });
}

/**
 * The code that validates your refresh token, and gives you a new session + refresh token.
 * It will delete the used refresh token
 * @param {*} userId 
 * @param {*} refreshToken 
 * @param {function} callback (result|null) => void
 */
export function refreshSessionToken(userId, refreshToken, callback) {
    verifyRefreshToken(userId, refreshToken, settings.maxRefreshTokenTime, (isValid) => {
        deleteRefreshToken(refreshToken, () => {
            if (isValid) {
                _generateSessionToken(userId, callback);
            } else {
                callback(null);
                return;
            }
        });
    });
}

