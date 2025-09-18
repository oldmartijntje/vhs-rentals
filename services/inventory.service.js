import { getDetailedInventoryStatusFromDatabase } from "../dao/inventory.dao.js";

export function getInventoryDataByFilm(film_id, callback) {
    getDetailedInventoryStatusFromDatabase(film_id, callback)
}
