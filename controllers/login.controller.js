import { bodyItemMissing, quickResponse } from '../helper/response.helper.js';
import { loginViaCredentials } from '../services/login.service.js';

const loginRequest = async (req, res) => {
    try {
        console.log(req.body);

        const { email, password, role } = req.body;

        if (!email) return bodyItemMissing(res, "email");
        if (!password) return bodyItemMissing(res, "password");
        if (!role) return bodyItemMissing(res, "role");
        if (role != "customer" && role != "staff") return quickResponse(res, 400, "invalid \"role\"");
        const responseObject = await loginViaCredentials(email, password, role);
        if (responseObject == null) return quickResponse(res, 400, "invalid \"email\" and \"password\" combination");


        res.status(200).send(responseObject); // Placeholder response

    } catch (e) {
        res.status(500).send("uncaught excepion: " + e);
        return;
    }
}


export { loginRequest };