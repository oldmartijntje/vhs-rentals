import { getDetailedInventoryStatusFromDatabase } from "../dao/inventory.dao.js";
import { addInventoryItemToDatabase } from "../dao/inventory.dao.js";
import { setRentalReturnedNow, updateInventoryStoreId } from "../dao/inventory.dao.js";
import { createRentalForCustomer } from "../dao/inventory.dao.js";
import { customerReturnInventoryItem } from "../dao/inventory.dao.js";

export function getInventoryDataByFilm(film_id, callback) {
    getDetailedInventoryStatusFromDatabase(film_id, callback)
}

export function addInventoryItem(film_id, store_id, callback) {
    addInventoryItemToDatabase(film_id, store_id, callback);
}

export function returnRentalNow(inventory_id, callback) {
    setRentalReturnedNow(inventory_id, callback);
}

export function editInventoryStoreId(inventory_id, store_id, callback) {
    updateInventoryStoreId(inventory_id, store_id, callback);
}

export function rentInventoryToCustomer(inventory_id, customer_id, rental_period_days, callback) {
    createRentalForCustomer(inventory_id, customer_id, rental_period_days, callback);
}

export function customerReturnInventory(inventory_id, customer_id, callback) {
    customerReturnInventoryItem(inventory_id, customer_id, callback);
}
