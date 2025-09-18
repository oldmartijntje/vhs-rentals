import express from 'express';
import { getInventoryData, addInventoryItemController, returnRentalController, editInventoryStoreIdController, rentInventoryController } from '../controllers/inventory.controller.js';

const inventoryRouter = express.Router();

inventoryRouter.get('', getInventoryData);
inventoryRouter.post('', addInventoryItemController);
inventoryRouter.put('/return', returnRentalController);
inventoryRouter.put('', editInventoryStoreIdController);

// Customer rents a copy of a film
inventoryRouter.post('/rent', rentInventoryController);

export default inventoryRouter;
