var winston = require('winston');

const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: "YYYY-MM-DD hh:mm:ss A"
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
});

function expressLogger(req, res, next) {
    logger.debug(`${req.method} ${req.url}`);
    next();
}


module.exports = {
    logger: logger,
    expressLogger: expressLogger
};