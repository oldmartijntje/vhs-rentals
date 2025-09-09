import { checkCustomer } from "../dao/login.dao.js";
import { logger } from "../middleware/logger.js";

export async function loginViaCredentials(email, password, role) {
    if (role == "customer") {
        try {
            let customer_id = await checkCustomer(email, password);
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
}

async function generateSessionToken(customer_id) {

}

export async function refreshSessionToken() {

}

