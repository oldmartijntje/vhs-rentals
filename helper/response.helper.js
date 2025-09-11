import { logger } from "../middleware/logger.js";

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
 * A method to easily send an 400 invalid number response
 * @param {*} res 
 * @param {*} amount 
 * @param {*} bodyItem 
 * @param {*} min 
 * @param {*} max 
 * @returns `boolean` if it is outside of the scope or an invalid number
 */
export function invalidNumberResponse(res, amount, bodyItem, min, max) {
    if (!(!isNaN(amount) && !isNaN(parseFloat(amount)))) {
        quickResponse(res, 400, `Invalid Number given to '${bodyItem}'`);
        return true
    }
    if (amount > max) {
        quickResponse(res, 400, `'${bodyItem}' exceeds the maximum, ${amount} is more than ${max}`);
        return true
    }
    if (amount < min) {
        quickResponse(res, 400, `'${bodyItem}' is below the minimum, ${amount} is less than ${min}`);
        return true;
    }
    return false;
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