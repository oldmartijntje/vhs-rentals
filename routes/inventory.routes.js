import express from 'express';
import { getInventoryData, addInventoryItemController, returnRentalController, editInventoryStoreIdController, rentInventoryController, userReturnInventoryController, getMyCurrentRentalsController, getAllRentedInventoryController } from '../controllers/inventory.controller.js';

const inventoryRouter = express.Router();

inventoryRouter.get('', getInventoryData);
inventoryRouter.post('', addInventoryItemController);
inventoryRouter.put('/return', returnRentalController);
inventoryRouter.put('', editInventoryStoreIdController);
inventoryRouter.put('/return-user', userReturnInventoryController);
inventoryRouter.post('/rent', rentInventoryController);
inventoryRouter.get('/my-rentals', getMyCurrentRentalsController);
inventoryRouter.get('/all-rented', getAllRentedInventoryController);

export default inventoryRouter;
