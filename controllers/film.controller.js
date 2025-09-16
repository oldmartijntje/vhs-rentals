import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { getRecentFilms, getFilmData } from '../services/film.service.js';
import { loginViaCredentials, refreshSessionToken } from '../services/login.service.js';

/**
 * The code that happens when you request /api/film/newest
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function newestFilmsRequest(req, res) {
    try {
        const { amount } = req.query;

        if (!amount) return queryParamMissingResponse(res, "amount");
        if (invalidNumberResponse(res, amount, "amount", 1, 50)) return;

        getRecentFilms(amount, (result) => {
            if (result == null) {
                quickResponse(res, 500, "unknown error")
                return
            }
            okResponse(res, result);
            return;
        })
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * The code that happens when you request /api/film
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function filmInfoRequest(req, res) {
    try {
        const { id, userId, sessionToken } = req.query;

        if (!id) return queryParamMissingResponse(res, "id");
        if (invalidNumberResponse(res, id, "id", 0, Infinity)) return;
        if (userId != undefined && sessionToken != undefined) {
            const auth = new Auth(userId, sessionToken);
            auth.validate((isValidated) => {
                if (isValidated) {
                    getFilmData(id, true, (result) => {
                        if (result == null) {
                            quickResponse(res, 500, "unknown error")
                            return;
                        } else if (result == 404) {
                            notFoundResponse(res, "film");
                            return;
                        }
                        okResponse(res, result[0]);
                        return;
                        // will give info on how many copies there are in each store
                        // and it has the store information
                        // unless that request fails.
                    })
                } else {
                    invalidAuthenticationAttemptResponse(res);
                }
            })
        } else {
            getFilmData(id, false, (result) => {
                if (result == null) {
                    quickResponse(res, 500, "unknown error")
                    return;
                } else if (result == 404) {
                    notFoundResponse(res, "film");
                    return;
                }
                okResponse(res, result[0]);
                return;
                // will say, currently available or currently unavailable for rent.
            })
        }

    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}