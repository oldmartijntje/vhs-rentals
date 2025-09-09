import { bodyItemMissing } from '../helper/routes.helper.js';

const loginRequest = async (req, res) => {
    try {
        console.log(req.body);

        const { email, password, role } = req.body;

        if (!email) return bodyItemMissing(res, "email");
        if (!password) return bodyItemMissing(res, "password");
        if (!role) return bodyItemMissing(res, "role");
        // const responseObject = await loginViaCredentials()

        res.status(200).send("Login successful"); // Placeholder response

    } catch (e) {
        res.status(500).send("uncaught excepion: " + e);
        return;
    }
}


export { loginRequest };