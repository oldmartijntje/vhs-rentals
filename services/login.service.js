import {
    checkCustomer, checkStaff, createSession,
    verifyRefreshToken, deleteRefreshToken
} from "../dao/login.dao.js";
import { logger } from "../middleware/logger.js";
import { settings } from "../server.js"

/**
 * The code that validates whether an email and password combination are correct
 * @param {*} email 
 * @param {*} password 
 * @param {*} role `customer` or `staff`
 * @returns `customer_id | null`
 */
export async function loginViaCredentials(email, password, role) {
    logger.debug(`loginViaCredentials(${email}, ${password}, ${role})`)
    try {
        let customer_id;
        if (role == "customer") {
            customer_id = await checkCustomer(email, password);
        } else {
            customer_id = await checkStaff(email, password);
        }
        if (customer_id != null) {
            return await _generateSessionToken(customer_id);
        }
        else {
            logger.warn('Invalid credentials.');
            return null;
        }

    } catch (e) {
        logger.error('Error checking user:', e)
        return null;
    }

}

/**
 * The code for generating a new session token. This method is meant to be private.
 * @param {*} customer_id 
 * @returns `{
        sessionToken,
        refreshToken,
        message,
        expirationMinutes,
        userId
    } | null` 
 */
async function _generateSessionToken(customer_id) {
    const { sessionToken, refreshToken } = await createSession(customer_id, settings.maxRefreshTokenTime);
    if (sessionToken == null || refreshToken == null) {
        return null;
    }
    return {
        sessionToken,
        refreshToken,
        message: "success",
        expirationMinutes: settings.maxTokenTime,
        userId: customer_id
    }
}

/**
 * The code that validates your refresh token, and gives yu a new session + refresh token.
 * 
 * It will delete the used refresh token
 * @param {*} userId 
 * @param {*} refreshToken 
 * @returns `{ sessionToken, refreshToken, message, expirationMinutes, userId } | null`
 */
export async function refreshSessionToken(userId, refreshToken) {
    const isValid = await verifyRefreshToken(userId, refreshToken, settings.maxRefreshTokenTime);
    await deleteRefreshToken(refreshToken);
    if (isValid) {
        return _generateSessionToken(userId);
    }
    return null;
}

