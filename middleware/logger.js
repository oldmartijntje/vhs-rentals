import winston from 'winston';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, printf, colorize, align } = winston.format;

const LOG_ROOT = path.join(process.cwd(), 'logging');


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

function pad(n) {
    return n < 10 ? '0' + n : n;
}

function getLogFilePath() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = pad(now.getMonth() + 1).toString();
    const day = pad(now.getDate()).toString();
    const dir = path.join(LOG_ROOT, year, month);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, `${day}-${month}-${year}.log`);
}

function logRequest(req) {
    const now = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cookies = req.headers.cookie || '';
    const headers = JSON.stringify(req.headers);
    return `${now} | ${req.method} ${req.originalUrl} | IP: ${ip} | Cookies: ${cookies} | Headers: ${headers}\n`;
}


// Async function to get settings from server.js
async function getSettings() {
    try {
        const { settings } = await import('../server.js');
        if (settings) {
            return settings;
        }
    } catch (e) { }
    return { logToFile: false };
}


async function requestLogger(req, res, next) {
    const settings = await getSettings();
    if (settings.logToFile) {
        const logLine = logRequest(req);
        const logFile = getLogFilePath();
        fs.appendFile(logFile, logLine, err => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    }
    logger.debug(`${req.method} ${req.url}`);
    next();
}


export { logger, requestLogger };