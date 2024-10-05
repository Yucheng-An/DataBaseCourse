function setupIndexedDB(dbName, storeName, callback) {
    let request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            let objectStore = db.createObjectStore(storeName, { keyPath: "id" });
            objectStore.createIndex("id", "id", { unique: true });
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

function add100kObjects(db, storeName, callback) {
    let transaction = db.transaction(storeName, "readonly");
    let objectStore = transaction.objectStore(storeName);
    let countRequest = objectStore.count();
    countRequest.onsuccess = function () {
        if (countRequest.result === 0) {
            let writeTransaction = db.transaction(storeName, "readwrite");
            let writeObjectStore = writeTransaction.objectStore(storeName);
            for (let i = 0; i < 100000; i++) {
                let object = {
                    id: i,
                    task: `Task_${Math.random().toString(36).substring(7)}`, // Random string
                    status: `Status_${Math.floor(Math.random() * 100)}`, // Random number between 0-99
                    dueDate: new Date(Date.now() + Math.floor(Math.random() * 1000000000)) // Random future date
                };
                writeObjectStore.add(object);
            }
            writeTransaction.oncomplete = function () {
                console.log("100k objects added.");
                callback();
            };
            writeTransaction.onerror = function (event) {
                console.error("Error adding objects:", event);
            };
        } else {
            console.log("Objects already exist, skipping insertion.");
            callback();
        }
    };

    countRequest.onerror = function (event) {
        console.error("Error counting objects:", event);
    };
}

for (let i = 0; i < 10; i++) {
    let object = {
        id: i,
        task: `Task_${Math.random().toString(36).substring(7)}`, // Random string
        status: `Status_${Math.floor(Math.random() * 100)}`, // Random number between 0-99
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 1000000000)) // Random future date
    }
    console.log(object)
}

