import { checkCustomer, checkStaff, createSessionAndOverwrite } from "../dao/login.dao.js";
import { logger } from "../middleware/logger.js";
import { settings } from "../server.js"

export async function loginViaCredentials(email, password, role) {
    logger.debug(`loginViaCredentials(${email}, ${password}, ${role})`)
    try {
        let customer_id;
        if (role == "customer") {
            customer_id = await checkCustomer(email, password);
        } else {
            customer_id = await checkStaff(email, password);
        }
        if (customer_id != null) {
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

async function generateSessionToken(customer_id) {
    const { sessionToken, refreshToken } = await createSessionAndOverwrite(customer_id, settings.maxRefreshTokenTime);
    if (sessionToken == null || refreshToken == null) {
        return null;
    }
    return {
        sessionToken,
        refreshToken,
        message: "success",
        expirationMinutes: settings.maxTokenTime,
        userId: customer_id
    }
}

export async function refreshSessionToken() {

}

