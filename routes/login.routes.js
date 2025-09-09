import express from 'express';
import { loginRequest, tokenRefreshRequest } from '../controllers/login.controller.js';
const loginRouter = express.Router();


loginRouter.post("/", loginRequest);
loginRouter.post("/tokenRefresh", tokenRefreshRequest);


export default loginRouter;