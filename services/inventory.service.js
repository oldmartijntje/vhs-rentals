import { getDetailedInventoryStatusFromDatabase } from "../dao/inventory.dao.js";
import { addInventoryItemToDatabase } from "../dao/inventory.dao.js";

export function getInventoryDataByFilm(film_id, callback) {
    getDetailedInventoryStatusFromDatabase(film_id, callback)
}

export function addInventoryItem(film_id, store_id, callback) {
    addInventoryItemToDatabase(film_id, store_id, callback);
}
