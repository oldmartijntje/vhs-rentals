import { UserType } from '../customTypes/user.enum.js';
import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { customerReturnInventory, getAllRentedInventory, getArchivedRentalsService, getArchivedRentalsServiceForCustomers, getCustomerCurrentRentals, getInventoryDataByFilm, rentInventoryToCustomer } from '../services/inventory.service.js';
import { addInventoryItem } from '../services/inventory.service.js';
import { returnRentalNow, editInventoryStoreId } from '../services/inventory.service.js';
import { deleteInventoryItem } from '../services/inventory.service.js';

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

            getInventoryDataByFilm(film_id, (result) => {
                if (result == null) return tryCatchResponse(res, "something went wrong");
                if (!auth.authorizationCheck([UserType.STAFF, UserType.STORE_OWNER])) {
                    result.forEach(element => {
                        if (element.last_customer_id == auth.getStaffOrCustomerId() && element.rented == 1) {
                            element.you = true;
                        }
                        element.last_customer_id = undefined;
                        element.last_rental_id = undefined;
                    });
                }
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
                if (!success) {
                    logger.info(`Failed to return rental for inventory_id: ${inventory_id} by user ${userId}`);
                    return tryCatchResponse(res, "something went wrong or rental not found");
                }
                logger.info(`Rental returned for inventory_id: ${inventory_id} by user ${userId}`);
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
                if (!success) {
                    logger.info(`Failed to edit store_id for inventory_id: ${inventory_id} by user ${userId}`);
                    return tryCatchResponse(res, "something went wrong or inventory not found");
                }
                logger.info(`Store_id edited for inventory_id: ${inventory_id} to store_id: ${store_id} by user ${userId}`);
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
                if (!result) {
                    logger.info(`Failed to rent inventory_id: ${inventory_id} to customer ${userId}`);
                    return tryCatchResponse(res, "something went wrong");
                }
                logger.info(`Inventory_id: ${inventory_id} rented to customer ${userId} for ${period} days`);
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
                if (result == null) {
                    logger.info(`Failed to add inventory item for film_id: ${film_id}, store_id: ${store_id} by user ${userId}`);
                    return tryCatchResponse(res, "something went wrong");
                }
                logger.info(`Inventory item added for film_id: ${film_id}, store_id: ${store_id} by user ${userId}, id: ${result}`);
                okResponse(res, { success: true, id: result });
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}


/**
 * Customer returns an inventory item
 */
export function userReturnInventoryController(req, res) {
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
            if (!auth.authorizationCheck([UserType.CUSTOMER])) {
                forbiddenResponse(res);
                return;
            }
            const customer_id = auth.getStaffOrCustomerId();
            // Only return if this customer is currently renting this inventory item
            customerReturnInventory(inventory_id, customer_id, (success) => {
                if (!success) {
                    logger.info(`Failed customer return for inventory_id: ${inventory_id} by user ${userId}`);
                    okResponse(res, { success: false, message: "No active rental found for this user and inventory item." });
                    return;
                }
                logger.info(`Customer return for inventory_id: ${inventory_id} by user ${userId}`);
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
 * Get all currently rented out films (admin/staff/store owner)
 */
export function getAllRentedInventoryController(req, res) {
    try {
        const { userId, sessionToken, film_id } = req.query;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (film_id && invalidNumberResponse(res, film_id, 'film_id', 0, Infinity)) return;

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
            getAllRentedInventory(film_id, (results) => {
                if (!results) return tryCatchResponse(res, "something went wrong");
                okResponse(res, results);
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}
/**
 * Get all currently rented films for a customer
 */
export function getMyCurrentRentalsController(req, res) {
    try {
        const { userId, sessionToken } = req.query;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;

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
            const customer_id = auth.getStaffOrCustomerId();
            getCustomerCurrentRentals(customer_id, (results) => {
                if (!results) return tryCatchResponse(res, "something went wrong");
                okResponse(res, results);
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * Get all archived rentals (staff/store owner or customer)
 */
export function getArchivedRentalsController(req, res) {
    try {
        const { userId, sessionToken, film_id } = req.query;
        if (!userId) return queryParamMissingResponse(res, 'userId');
        if (!sessionToken) return queryParamMissingResponse(res, 'sessionToken');
        if (invalidNumberResponse(res, userId, 'userId', 0, Infinity)) return;
        if (film_id && invalidNumberResponse(res, film_id, 'film_id', 0, Infinity)) return;

        const auth = new Auth(userId, sessionToken);
        auth.validate((isValidated) => {
            if (!isValidated) {
                invalidAuthenticationAttemptResponse(res);
                return;
            }
            if (auth.authorizationCheck([UserType.STAFF, UserType.STORE_OWNER])) {
                // Staff or store owner: see all
                getArchivedRentalsService(film_id, (results) => {
                    if (!results) return tryCatchResponse(res, "something went wrong");
                    okResponse(res, results);
                    return;
                });
            } else if (auth.authorizationCheck([UserType.CUSTOMER])) {
                // Customer: see only their own history
                const customer_id = auth.getStaffOrCustomerId();
                getArchivedRentalsServiceForCustomers(customer_id, film_id, (results) => {
                    if (!results) return tryCatchResponse(res, "something went wrong");
                    okResponse(res, results);
                    return;
                });
            } else {
                forbiddenResponse(res);
                return;
            }
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}

/**
 * Delete an inventory item (staff/store owner only)
 */
export function deleteInventoryItemController(req, res) {
    try {
        const { inventory_id, userId, sessionToken } = req.query;
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
            if (!auth.authorizationCheck([UserType.STAFF, UserType.STORE_OWNER])) {
                forbiddenResponse(res);
                return;
            }
            deleteInventoryItem(inventory_id, (success) => {
                if (!success) {
                    logger.info(`Failed to delete inventory item: ${inventory_id} by user ${userId}`);
                    return tryCatchResponse(res, "something went wrong or inventory not found");
                }
                logger.info(`Inventory item deleted: ${inventory_id} by user ${userId}`);
                okResponse(res, { success: true });
                return;
            });
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}