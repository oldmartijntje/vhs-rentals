import { loginViaSesion } from "../services/login.service.js";
import { getDataByUserId } from "../services/user.service.js";
import { logger } from "./logger.js";

export class Auth {
    userId
    sessionToken
    isValidated = false;
    userData
    constructor(userId, sessionToken) {
        this.userId = userId;
        this.sessionToken = sessionToken;
    }

    /**
     * Whether your userid and sessiontaken correlate to a correct customer / staff
     * @param {*} callback (boolean)
     */
    validate(callback) {
        logger.debug("user is trying to validate")
        const userId = this.userId;
        // we set this const to prevent accidental race conditions
        // we know for sure that userId is the user signed in, hence why we are getting our data
        // but if this.userId changes by outisde forces whilst our 1st query is busy, we get someone elses data
        loginViaSesion(this.sessionToken, userId, (isValid) => {
            if (isValid) {
                getDataByUserId(userId, (result) => {
                    if (result == null || result[0] == undefined) {
                        // user_id is found in user table but not in customer or staff
                        // ghost acc is not allowed to sign in.
                        callback(false);
                    } else {
                        this.userData = result[0];
                        this.userData.password = null
                        this.isValidated = true;
                        callback(true);
                    }

                })
            } else {
                callback(false);
            }
        });
    }

    // TODO:
    // authorisationCheck(callback) {
    //     if (!this.isValidated) throw new Error("You can't check authorisation for a user that is not validated.")
    // }

    getUser() {
        if (!this.isValidated) throw new Error("You can't get user data for a user that is not validated.")
        return this.userData;
    }
}