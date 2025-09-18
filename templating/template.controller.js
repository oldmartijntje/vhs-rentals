import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { getTemplateData } from './template.service.js';

/**
 * Get template info
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function getTemplateInfoRequest(req, res) {
    try {
        const { templateId } = req.query;
        if (!templateId) return queryParamMissingResponse(res, 'templateId');
        if (invalidNumberResponse(res, templateId, 'templateId', 0, Infinity)) return;

        getTemplateData(templateId, (result) => {
            if (result == null) {
                quickResponse(res, 500, 'unknown error');
            } else {
                okResponse(res, result);
            }
        });
    } catch (e) {
        tryCatchResponse(res, e);
        return;
    }
}
