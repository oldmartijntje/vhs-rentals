import express from 'express';
import { newestFilmsRequest } from '../controllers/film.controller.js';

const filmRouter = express.Router();


filmRouter.get("/newest", newestFilmsRequest);



export default filmRouter;