import { UserType } from '../customTypes/user.enum.js';
import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { getRecentFilms, getFilmData, addNewFilm, updateFilm, removeFilm } from '../services/film.service.js';
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
        if (invalidNumberResponse(res, userId, "userId", 0, Infinity)) return;
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

/**
 * add film
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function postFilm(req, res) {
    try {
        const { title, description, category, price, length, rating, release_year, actors, userId, sessionToken } = req.body;
        if (!title) return queryParamMissingResponse(res, "title");
        if (!description) return queryParamMissingResponse(res, "description");
        if (!category) return queryParamMissingResponse(res, "category");
        if (!price) return queryParamMissingResponse(res, "price");
        if (!length) return queryParamMissingResponse(res, "length");
        if (!rating) return queryParamMissingResponse(res, "rating");
        if (rating.length > 5) return quickResponse(res, 400, "rating value is too many characters")
        if (!release_year) return queryParamMissingResponse(res, "release_year");
        if (!actors) return queryParamMissingResponse(res, "actors");
        if (!userId) return queryParamMissingResponse(res, "userId");
        if (!sessionToken) return queryParamMissingResponse(res, "sessionToken");
        if (invalidNumberResponse(res, price, "price", 0, Infinity)) return;
        if (invalidNumberResponse(res, length, "length", 0, Infinity)) return;
        if (invalidNumberResponse(res, userId, "userId", 0, Infinity)) return;
        if (invalidNumberResponse(res, release_year, "release_year", 1800, Infinity)) return; // i am not going to limit people making movies in the year 1.797693134862315E+308

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
            addNewFilm(title, description, category, price, length, rating, release_year, actors, (result) => {
                if (result != null) {
                    okResponse(res, { id: result });
                    return
                }
                tryCatchResponse(res, "something went wrong");
                return
            })
        });

    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * edit an film where id = ?
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function putFilm(req, res) {
    try {
        const { title, description, category, price, length, rating, release_year, actors, film_id, userId, sessionToken } = req.body;
        if (!title) return queryParamMissingResponse(res, "id");
        if (!description) return queryParamMissingResponse(res, "description");
        if (!category) return queryParamMissingResponse(res, "category");
        if (!price) return queryParamMissingResponse(res, "price");
        if (!length) return queryParamMissingResponse(res, "length");
        if (!rating) return queryParamMissingResponse(res, "rating");
        if (rating.length > 5) return quickResponse(res, 400, "rating value is too many characters")
        if (!release_year) return queryParamMissingResponse(res, "release_year");
        if (!actors) return queryParamMissingResponse(res, "actors");
        if (!film_id) return queryParamMissingResponse(res, "film_id");
        if (!userId) return queryParamMissingResponse(res, "userId");
        if (!sessionToken) return queryParamMissingResponse(res, "sessionToken");
        if (invalidNumberResponse(res, film_id, "film_id", 0, Infinity)) return;
        if (invalidNumberResponse(res, price, "price", 0, Infinity)) return;
        if (invalidNumberResponse(res, length, "length", 0, Infinity)) return;
        if (invalidNumberResponse(res, userId, "userId", 0, Infinity)) return;
        if (invalidNumberResponse(res, release_year, "release_year", 1800, Infinity)) return; // i am not going to limit people making movies in the year 1.797693134862315E+308

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
            updateFilm(film_id, title, description, category, price, length, rating, release_year, actors, (result) => {
                if (result != null) {
                    okResponse(res, { id: result });
                    return
                }
                tryCatchResponse(res, "something went wrong");
                return
            })
        });

    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * delete 1 film where Id = ?
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function deleteFilm(req, res) {
    try {
        const { id, userId, sessionToken } = req.query;
        if (!id) return queryParamMissingResponse(res, "id");
        if (!userId) return queryParamMissingResponse(res, "userId");
        if (!sessionToken) return queryParamMissingResponse(res, "sessionToken");
        if (invalidNumberResponse(res, id, "id", 0, Infinity)) return;
        if (invalidNumberResponse(res, userId, "userId", 0, Infinity)) return;

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
            removeFilm(id, (result) => {
                if (result != null) {
                    okResponse(res, { id: result });
                    return
                }
                tryCatchResponse(res, "something went wrong");
                return
            })
        });

    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}