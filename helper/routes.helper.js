import { logger } from "../middleware/logger.js";

export function quickExit(res, code, message) {
    logger.debug(`Responding ${code} to client with message: "${message}"`)
    res.status(code).send(message);
}

export function bodyItemMissing(res, bodyItem) {
    quickExit(res, 400, `Missing required field on body: '${bodyItem}'`);
}