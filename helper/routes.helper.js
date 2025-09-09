exports.quickExit = (res, code, message) => {
    res.status(code).send(message);
}

exports.bodyItemMissing = (res, bodyItem) => {
    exports.quickExit(res, 400, `Missing required field on body: "${bodyItem}"`)
}