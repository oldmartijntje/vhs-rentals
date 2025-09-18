import express from 'express';
import { getInventoryData, addInventoryItemController } from '../controllers/inventory.controller.js';

const inventoryRouter = express.Router();

inventoryRouter.get('', getInventoryData);

// Add inventory item
inventoryRouter.post('/add', addInventoryItemController);

export default inventoryRouter;
