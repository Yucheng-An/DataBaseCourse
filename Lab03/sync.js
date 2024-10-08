const { MongoClient } = require('mongodb');
const { indexedDB, IDBKeyRange } = require('fake-indexeddb');

const mongoUri = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(mongoUri);
const mongoDbName = "lab3";
const mongoCollectionName = "4449";

// Initialize IndexedDB
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

// Fetch all data from IndexedDB
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

// Sync function to update MongoDB based on IndexedDB data
async function syncData() {
    try {
        // Connect to MongoDB
        await mongoClient.connect();
        const mongoDb = mongoClient.db(mongoDbName);
        const mongoCollection = mongoDb.collection(mongoCollectionName);

        // Open IndexedDB and fetch all data
        const indexedDB = await openIndexedDB();
        const indexedDBData = await getIndexedDBData(indexedDB);

        // Loop over each entry in IndexedDB
        for (let indexedObj of indexedDBData) {
            const uuid = indexedObj.uuid;

            // Check if the record exists in MongoDB
            const mongoRecord = await mongoCollection.findOne({ uuid });

            if (!mongoRecord) {
                // Insert record if it doesn't exist in MongoDB
                await mongoCollection.insertOne(indexedObj);
                console.log(`Inserted new record with UUID: ${uuid} into MongoDB.`);
            } else {
                // Compare the `updatedTime` fields to see if an update is needed
                const indexedTime = new Date(indexedObj.updatedTime);
                const mongoTime = new Date(mongoRecord.updatedTime);

                if (indexedTime > mongoTime) {
                    // Update MongoDB record if the IndexedDB record is more recent
                    await mongoCollection.updateOne(
                        { uuid },
                        { $set: indexedObj }
                    );
                    console.log(`Updated record with UUID: ${uuid} in MongoDB.`);
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
