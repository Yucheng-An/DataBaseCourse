const { MongoClient } = require('mongodb');
const { indexedDB, IDBKeyRange } = require('fake-indexeddb');

const mongoUri = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(mongoUri);
const mongoDbName = "lab3";
const mongoCollectionName = "4449";

function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("IndexDB", 1);
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("Sensor")) {
                db.createObjectStore("Sensor", { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function getIndexedDBData(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("Sensor", "readonly");
        const store = transaction.objectStore("Sensor");
        const request = store.getAll();
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

async function syncData() {
    try {
        await mongoClient.connect();
        const mongoDb = mongoClient.db(mongoDbName);
        const mongoCollection = mongoDb.collection(mongoCollectionName);
        const indexedDB = await openIndexedDB();
        const indexedDBData = await getIndexedDBData(indexedDB);
        // Loop over each entry in IndexedDB
        for (let indexedObj of indexedDBData) {
            const uuid = indexedObj.uuid;
            const mongoRecord = await mongoCollection.findOne({ uuid });
            if (!mongoRecord) {
                await mongoCollection.insertOne(indexedObj);
                console.log(`Inserted new record with UUID: ${uuid} into MongoDB.`);
            }
            }
        }

        console.log("Data synchronization completed.");
    } catch (error) {
        console.error("Error during data synchronization:", error);
    } finally {
        await mongoClient.close();
    }
}

// Run the sync process
syncData();
