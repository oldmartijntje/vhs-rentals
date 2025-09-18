import { getTemplateById } from './template.dao.js';

/**
 * Get all data from the template, by its template_id
 * @param {*} template_id 
 * @param {*} callback 
 */
export function getTemplateData(template_id, callback) {
    getTemplateById(template_id, (result) => {
        if (result == null || result[0] == undefined) {
            callback(null);
        } else {
            callback(result[0]);
        }
    });
}
