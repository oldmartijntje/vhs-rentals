import { logger } from "../middleware/logger.js";

export function quickResponse(res, code, message) {
    logger.debug(`Responding ${code} to client with message: "${message}"`)
    res.status(code).send(message);
}

export function bodyItemMissingResponse(res, bodyItem) {
    quickResponse(res, 400, `Missing required field on body: '${bodyItem}'`);
}

export function okResponse(res, bodyItem) {
    quickResponse(res, 200, bodyItem);
}

export function tryCatchResponse(res, error) {
    logger.error(`Uncaught Excepion: "${error}"`)
    quickResponse(res, 500, "._.");
}