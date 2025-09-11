import { queryParamMissingResponse, quickResponse, okResponse, tryCatchResponse, invalidNumberResponse } from '../helper/response.helper.js';
import { getRecentFilms } from '../services/film.service.js';
import { loginViaCredentials, refreshSessionToken } from '../services/login.service.js';

/**
 * The code that happens when you request /api/film
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