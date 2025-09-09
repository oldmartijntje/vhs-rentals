export function quickExit(res, code, message) {
    res.status(code).send(message);
}

export function bodyItemMissing(res, bodyItem) {
    quickExit(res, 400, `Missing required field on body: "${bodyItem}"`);
}