import express from 'express';
import * as aController from '../controllers/a.controller.js';
const router = express.Router();

router.get('/a', aController.getA);
router.get('/b', aController.getB);

export default router;
