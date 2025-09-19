import { UserType } from '../customTypes/user.enum.js';
import {
    queryParamMissingResponse, quickResponse, notFoundResponse,
    okResponse, tryCatchResponse, invalidNumberResponse,
    invalidAuthenticationAttemptResponse,
    forbiddenResponse
} from '../helper/response.helper.js';
import { Auth } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import { getAllStores } from '../services/store.service.js';

export function getStoresRequest(req, res) {
    try {
        getAllStores((result) => {
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

