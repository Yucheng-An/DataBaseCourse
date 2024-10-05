function setupIndexedDB(dbName, storeName, callback) {
    let request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        let db = event.target.result;

        // Create object store and index if they don't already exist
        if (!db.objectStoreNames.contains(storeName)) {
            let objectStore = db.createObjectStore(storeName, { keyPath: "id" });
            objectStore.createIndex("name", "name", { unique: false });
        }
    };

    request.onsuccess = function (event) {
        let db = event.target.result;
        callback(db);
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event);
    };
}
