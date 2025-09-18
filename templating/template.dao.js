import pool from '../database/pool.js';
import { logger } from '../middleware/logger.js';
import { invalidNumber } from '../helper/validation.helper.js';

/**
 * DB query for getting template data
 * @param {*} templateId ALREADY SANITIZED BEFOREHAND
 * @param {function} callback (template_id|null) => void
 */
export function getTemplateById(templateId, callback) {
    if (invalidNumber(templateId, 0, 0, true)) throw new Error(`Number: "${templateId}"\nDid you not sanitize your inputs??`);
    pool.query(`SELECT * FROM template WHERE template_id = ?;`, [templateId], (err, results) => {
        if (err) {
            logger.error(`error at 'getTemplateById' method: ${err}`);
            return callback(null);
        }
        if (!results[0]) {
            return callback(null);
        }
        return callback(results);
    });
}
