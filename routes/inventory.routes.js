import express from 'express';
import { getInventoryData } from '../controllers/inventory.controller.js';

const inventoryRouter = express.Router();

inventoryRouter.get('', getInventoryData);

export default inventoryRouter;
