import { UserType } from '../customTypes/user.enum.js';
import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { getInventoryDataByFilm, rentInventoryToCustomer } from '../services/inventory.service.js';
import { addInventoryItem } from '../services/inventory.service.js';
import { returnRentalNow, editInventoryStoreId } from '../services/inventory.service.js';

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

/**
 * Set return_date of a rental to NOW()
 */
export function returnRentalController(req, res) {
    try {
        const { inventory_id, userId, sessionToken } = req.body;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!inventory_id) return queryParamMissingResponse(res, 'inventory_id');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (invalidNumberResponse(res, inventory_id, 'inventory_id', 0, Infinity)) return;

        const auth = new Auth(userId, sessionToken);
        auth.validate((isValidated) => {
            if (!isValidated) {
                invalidAuthenticationAttemptResponse(res);
                return;
            }
            // Anyone who rented can return, or staff/store owner
            if (!auth.authorizationCheck([UserType.STAFF, UserType.STORE_OWNER])) {
                forbiddenResponse(res);
                return;
            }
            returnRentalNow(inventory_id, (success) => {
                if (!success) return tryCatchResponse(res, "something went wrong or rental not found");
                okResponse(res, { success: true });
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * Edit store_id of inventory item
 */
export function editInventoryStoreIdController(req, res) {
    try {
        const { inventory_id, store_id, userId, sessionToken } = req.body;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!inventory_id) return queryParamMissingResponse(res, 'inventory_id');
        if (!store_id) return queryParamMissingResponse(res, 'store_id');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (invalidNumberResponse(res, inventory_id, 'inventory_id', 0, Infinity)) return;
        if (invalidNumberResponse(res, store_id, 'store_id', 0, Infinity)) return;

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
            editInventoryStoreId(inventory_id, store_id, (success) => {
                if (!success) return tryCatchResponse(res, "something went wrong or inventory not found");
                okResponse(res, { success: true });
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * Customer rents a copy of a film
 */
export function rentInventoryController(req, res) {
    try {
        const { inventory_id, userId, sessionToken, rental_period_days } = req.body;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!inventory_id) return queryParamMissingResponse(res, 'inventory_id');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (invalidNumberResponse(res, inventory_id, 'inventory_id', 0, Infinity)) return;
        const period = rental_period_days && !isNaN(rental_period_days) ? parseInt(rental_period_days) : 7;
        if (invalidNumberResponse(res, period, 'rental_period_days', 1, 365)) return;

        const auth = new Auth(userId, sessionToken);
        auth.validate((isValidated) => {
            if (!isValidated) {
                invalidAuthenticationAttemptResponse(res);
                return;
            }
            if (!auth.authorizationCheck([UserType.CUSTOMER])) {
                forbiddenResponse(res);
                return;
            }
            logger.debug(JSON.stringify(auth.getUser()))
            rentInventoryToCustomer(inventory_id, auth.getStaffOrCustomerId(), period, (result) => {
                if (!result) return tryCatchResponse(res, "something went wrong");
                okResponse(res, result);
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * Add an item to inventory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function addInventoryItemController(req, res) {
    try {
        const { film_id, store_id, userId, sessionToken } = req.body;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!film_id) return queryParamMissingResponse(res, 'film_id');
        if (!store_id) return queryParamMissingResponse(res, 'store_id');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (invalidNumberResponse(res, film_id, 'film_id', 0, Infinity)) return;
        if (invalidNumberResponse(res, store_id, 'store_id', 0, Infinity)) return;

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
            addInventoryItem(film_id, store_id, (result) => {
                if (result == null) return tryCatchResponse(res, "something went wrong");
                okResponse(res, { success: true, id: result });
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}
