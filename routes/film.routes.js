import express from 'express';
import { newestFilmsRequest, filmInfoRequest, postFilm, putFilm, deleteFilm, getAllFilms } from '../controllers/film.controller.js';

const filmRouter = express.Router();


filmRouter.get("/newest", newestFilmsRequest);
filmRouter.get("", filmInfoRequest);
filmRouter.post("", postFilm);
filmRouter.delete("", deleteFilm);
filmRouter.put("", putFilm);
filmRouter.get("/all", getAllFilms);



export default filmRouter;