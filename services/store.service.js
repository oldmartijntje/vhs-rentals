import { getAllStoreAddressesFromDatabase } from "../dao/store.dao.js";

export function getAllStores(callback) {
    getAllStoreAddressesFromDatabase(callback)
}