import { UserType } from '../customTypes/user.enum.js';
import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { getAccountData } from '../services/user.service.js';

/**
 * Get account info
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function getAccountInfoRequest(req, res) {
    try {
        const { userId, sessionToken } = req.query;
        if (!userId) return queryParamMissingResponse(res, "userId");
        if (!sessionToken) return queryParamMissingResponse(res, "sessionToken");
        if (invalidNumberResponse(res, userId, "userId", 0, Infinity)) return;

        const auth = new Auth(userId, sessionToken);
        auth.validate((isValidated) => {
            if (isValidated) {
                getAccountData(userId, (result) => {
                    if (result == null) {
                        quickResponse(res, 500, "unknown error")
                    } else {
                        okResponse(res, result);
                    }
                })
            } else {
                invalidAuthenticationAttemptResponse(res);
            }
        });


    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}
