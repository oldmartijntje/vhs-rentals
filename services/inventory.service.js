import { getArchivedRentalsServiceForCustomer, getDetailedInventoryStatusFromDatabase } from "../dao/inventory.dao.js";
import { addInventoryItemToDatabase } from "../dao/inventory.dao.js";
import { setRentalReturnedNow, updateInventoryStoreId } from "../dao/inventory.dao.js";
import { createRentalForCustomer } from "../dao/inventory.dao.js";
import { customerReturnInventoryItem } from "../dao/inventory.dao.js";
import { getCurrentRentalsForCustomer } from "../dao/inventory.dao.js";
import { getAllCurrentlyRentedInventory } from "../dao/inventory.dao.js";
import { getArchivedRentals } from "../dao/inventory.dao.js";

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

export function getCustomerCurrentRentals(customer_id, callback) {
    getCurrentRentalsForCustomer(customer_id, callback);
}

export function getAllRentedInventory(film_id, callback) {
    getAllCurrentlyRentedInventory(film_id, callback);
}

export function getArchivedRentalsService(film_id, callback) {
    getArchivedRentals(film_id, callback);
}

export function getArchivedRentalsServiceForCustomers(customer_id, film_id, callback) {
    getArchivedRentalsServiceForCustomer(customer_id, film_id, callback);
}
