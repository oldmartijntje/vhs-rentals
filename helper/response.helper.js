import { logger } from "../middleware/logger.js";
import { invalidNumber } from "./validation.helper.js";

/**
 * Send a response to a client, and also log that response with the logger.
 * @param {*} res 
 * @param {*} code 
 * @param {*} message 
 */
export function quickResponse(res, code, message) {
    logger.debug(`Responding ${code} to client with message: "${message}"`)
    res.status(code).send(message);
}

/**
 * A method to easily send an 400 response
 * @param {*} res 
 * @param {*} bodyItem 
 */
export function bodyItemMissingResponse(res, bodyItem) {
    quickResponse(res, 400, `Missing required field on body: '${bodyItem}'`);
}

/**
 * A method to easily send an 400 response
 * @param {*} res 
 * @param {*} bodyItem 
 */
export function queryParamMissingResponse(res, bodyItem) {
    quickResponse(res, 400, `Missing required queryparam: '${bodyItem}'`);
}

/**
 * A method to easily send an 400 Invalid Authentication response
 * @param {*} res 
 */
export function invalidAuthenticationAttemptResponse(res) {
    quickResponse(res, 400, `Invalid Authentication Attempt`);
}

/**
 * A method to easily send an 404 response
 * @param {*} bodyItem 
 * @param {*} res 
 */
export function notFoundResponse(res, bodyItem) {
    quickResponse(res, 404, `The ${bodyItem} that you are looking for does not exits (in this context)`);
}

/**
 * A method to easily send an 400 invalid number response
 * @param {*} res 
 * @param {*} amount 
 * @param {*} bodyItem 
 * @param {*} min 
 * @param {*} max 
 * @returns `boolean` if it is outside of the scope or an invalid number
 */
export function invalidNumberResponse(res, amount, bodyItem, min, max) {
    if (!invalidNumber(amount, min, max)) {
        return false;
    }
    quickResponse(res, 400, `the value of '${bodyItem}' is not a valid number between ${min} and ${max}, provided was: '${amount}'`);
    return true
}

/**
 * A method to easily send an 200 response
 * @param {*} res 
 * @param {*} bodyItem 
 */
export function okResponse(res, bodyItem) {
    quickResponse(res, 200, bodyItem);
}

/**
 * A method to easily send an 500 response in case of a top level try-catch escape.
 * 
 * It will not send the actual error message to the client, that will be silently logged.
 * @param {*} res 
 * @param {*} error 
 */
export function tryCatchResponse(res, error) {
    logger.error(`Uncaught Excepion: "${error}"`)
    quickResponse(res, 500, "._.");
}