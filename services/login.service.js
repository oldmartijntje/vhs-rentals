import { checkUser } from "../dao/login.dao.js";
import { logger } from "../middleware/logger.js";

export async function loginViaCredentials(email, password, role) {
    if (role == "customer") {
        try {
            let isValid = await checkUser(email, password);
            if (isValid) logger.debug('Login successful!');
            else logger.debug('Invalid credentials.');
        } catch (e) {
            logger.error('Error checking user:', e)
        }
    }
}

export async function refreshSessionToken() {

}

