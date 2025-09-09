import express from 'express';
import { loginRequest } from '../controllers/login.controller.js';
const loginRouter = express.Router();


loginRouter.post("/", loginRequest);


export default loginRouter;