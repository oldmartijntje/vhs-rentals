import express from 'express';
import { getAccountInfoRequest } from '../controllers/user.controller.js';

const accountRouter = express.Router();


accountRouter.get("", getAccountInfoRequest);

export default accountRouter;