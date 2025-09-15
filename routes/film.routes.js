import express from 'express';
import { newestFilmsRequest, filmInfoRequest } from '../controllers/film.controller.js';

const filmRouter = express.Router();


filmRouter.get("/newest", newestFilmsRequest);
filmRouter.get("", filmInfoRequest);



export default filmRouter;