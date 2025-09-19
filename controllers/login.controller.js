import { bodyItemMissingResponse, quickResponse, okResponse, tryCatchResponse } from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { loginViaCredentials, refreshSessionToken } from '../services/login.service.js';

/**
 * The code that happens when you request /login
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function loginRequest(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email) return bodyItemMissingResponse(res, "email");
        if (!password) return bodyItemMissingResponse(res, "password");
        if (!role) return bodyItemMissingResponse(res, "role");
        if (role != "customer" && role != "staff") return quickResponse(res, 400, "invalid \"role\"");

        loginViaCredentials(email, password, role, (responseObject) => {
            if (responseObject == null) {
                logger.info(`Failed login attempt for email: ${email}, role: ${role}`);
                return quickResponse(res, 400, "invalid \"email\" and \"password\" combination");
            }
            logger.info(`Successful login for email: ${email}, role: ${role}`);
            okResponse(res, responseObject);
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * The code that happens when you request /login/tokenRefresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function tokenRefreshRequest(req, res) {
    try {
        const { userId, refreshToken } = req.body;

        if (!userId) return bodyItemMissingResponse(res, "userId");
        if (!refreshToken) return bodyItemMissingResponse(res, "refreshToken");

        refreshSessionToken(userId, refreshToken, (responseObject) => {
            if (responseObject == null) {
                logger.info(`Failed token refresh for userId: ${userId}`);
                return quickResponse(res, 400, "invalid \"userId\" and \"refreshToken\" combination, has your refreshToken expired?");
            }
            logger.info(`Successful token refresh for userId: ${userId}`);
            okResponse(res, responseObject);
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * The code that happens when you request /login/validateToken
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function validateTokenRequest(req, res) {
    try {
        const { userId, sessionToken } = req.body;

        if (!userId) return bodyItemMissingResponse(res, "userId");
        if (!sessionToken) return bodyItemMissingResponse(res, "sessionToken");
        const auth = new Auth(userId, sessionToken);
        auth.validate((isValidated) => {
            if (isValidated) {
                let userData = auth.getUser()
                userData.picture = null;
                logger.info(`Token validated for userId: ${userId}`);
                logger.debug(`User validated with this data: ${JSON.stringify(userData)}`)
                okResponse(res, { "authentication": true }) // honestly doesn't matter, we don't look at this in the frontend.
            } else {
                logger.info(`Failed token validation for userId: ${userId}`);
                quickResponse(res, 400, false)
            }
        })
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}