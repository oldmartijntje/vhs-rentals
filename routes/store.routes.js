import express from 'express';
import { getStoresRequest } from '../controllers/store.controller.js';

const storeRouter = express.Router();


storeRouter.get("", getStoresRequest);

export default storeRouter;