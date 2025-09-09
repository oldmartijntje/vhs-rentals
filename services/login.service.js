import { checkCustomer, createSessionAndOverwrite } from "../dao/login.dao.js";
import { logger } from "../middleware/logger.js";
import { settings } from "../server.js"

export async function loginViaCredentials(email, password, role) {
    logger.debug(`loginViaCredentials(${email}, ${password}, ${role})`)
    if (role == "customer") {
        logger.debug(`role == "customer"`)
        try {
            let customer_id = await checkCustomer(email, password);
            logger.debug("checkCustomer")
            if (customer_id != null) {
                logger.debug("customer_id != null")
                return await generateSessionToken(customer_id);
            }
            else {
                logger.warn('Invalid credentials.');
                return null;
            }

        } catch (e) {
            logger.error('Error checking user:', e)
            return null;
        }
    }
}

async function generateSessionToken(customer_id) {
    const { sessionToken, refreshToken } = await createSessionAndOverwrite(customer_id, settings.maxRefreshTokenTime);
    if (sessionToken == null || refreshToken == null) {
        return null;
    }
    return {
        sessionToken,
        refreshToken,
        message: "success",
        expiration: settings.maxTokenTime
    }
}

export async function refreshSessionToken() {

}

