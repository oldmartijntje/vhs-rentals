import express from 'express';
import { getInventoryData, addInventoryItemController, returnRentalController, editInventoryStoreIdController, rentInventoryController, userReturnInventoryController } from '../controllers/inventory.controller.js';

const inventoryRouter = express.Router();

inventoryRouter.get('', getInventoryData);
inventoryRouter.post('', addInventoryItemController);
inventoryRouter.put('/return', returnRentalController);
inventoryRouter.put('', editInventoryStoreIdController);
inventoryRouter.put('/return-user', userReturnInventoryController);

// Customer rents a copy of a film
inventoryRouter.post('/rent', rentInventoryController);

export default inventoryRouter;
