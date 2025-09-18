import express from 'express';
import { getTemplateInfoRequest } from '../templating/template.controller.js';

const templateRouter = express.Router();

templateRouter.get('', getTemplateInfoRequest);

export default templateRouter;
