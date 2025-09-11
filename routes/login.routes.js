import express from 'express';
import { loginRequest, tokenRefreshRequest, validateTokenRequest } from '../controllers/login.controller.js';
const loginRouter = express.Router();


loginRouter.post("/", loginRequest);
loginRouter.post("/tokenRefresh", tokenRefreshRequest);
loginRouter.post("/validateToken", validateTokenRequest);


export default loginRouter;