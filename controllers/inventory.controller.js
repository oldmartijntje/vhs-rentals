import { UserType } from '../customTypes/user.enum.js';
import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { getInventoryDataByFilm } from '../services/inventory.service.js';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function getInventoryData(req, res) {
    try {
        const { film_id, userId, sessionToken } = req.query;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!film_id) return queryParamMissingResponse(res, 'film_id');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (invalidNumberResponse(res, film_id, 'film_id', 0, Infinity)) return;

        const auth = new Auth(userId, sessionToken);
        auth.validate((isValidated) => {
            if (!isValidated) {
                invalidAuthenticationAttemptResponse(res);
                return;
            }
            if (!auth.authorizationCheck([UserType.STAFF, UserType.STORE_OWNER])) {
                forbiddenResponse(res);
                return;
            }
            getInventoryDataByFilm(film_id, (result) => {
                if (result == null) return tryCatchResponse(res, "something went wrong");
                okResponse(res, result);
                return;
            })

        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}
