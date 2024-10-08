const { MongoClient } = require('mongodb');
const { indexedDB } = require('fake-indexeddb');

// MongoDB connection details
const mongoUri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
const mongoClient = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
});
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

        // Sync IndexedDB to MongoDB
        for (let indexedObj of indexedDBData) {
            if (indexedObj.sourceDB === "IndexedDB") {
                const sensorID = indexedObj.sensorID;
                const indexedUpdatedTime = new Date(indexedObj.updatedTime);

                // Find matching record in MongoDB by sensorID
                const mongoRecord = await mongoCollection.findOne({ sensorID, sourceDB: "MongoDB" });

                if (!mongoRecord) {
                    // Insert into MongoDB if the record doesn't exist
                    await mongoCollection.insertOne(indexedObj);
                    console.log(`Inserted new record with sensorID: ${sensorID} from IndexedDB into MongoDB.`);
                } else {
                    const mongoUpdatedTime = new Date(mongoRecord.updatedTime);

                    if (indexedUpdatedTime > mongoUpdatedTime) {
                        // Update MongoDB if IndexedDB has more recent data
                        await mongoCollection.updateOne(
                            { sensorID, sourceDB: "MongoDB" },
                            { $set: indexedObj }
                        );
                        console.log(`Updated record with sensorID: ${sensorID} in MongoDB from IndexedDB.`);
                    }
                }
            }
        }

        // Sync MongoDB to IndexedDB
        const mongoDataCursor = await mongoCollection.find({ sourceDB: "MongoDB" });
        const mongoData = await mongoDataCursor.toArray();

        const transaction = indexedDB.transaction("Sensor", "readwrite");
        const indexedStore = transaction.objectStore("Sensor");

        for (let mongoObj of mongoData) {
            const sensorID = mongoObj.sensorID;

            // Check if the record exists in IndexedDB
            const indexedRecordRequest = indexedStore.index("sensorID").get(sensorID);

            indexedRecordRequest.onsuccess = function (event) {
                const indexedRecord = event.target.result;

                if (!indexedRecord) {
                    // Insert into IndexedDB if it doesn't exist
                    indexedStore.add(mongoObj);
                    console.log(`Inserted new record with sensorID: ${sensorID} from MongoDB into IndexedDB.`);
                } else {
                    const mongoUpdatedTime = new Date(mongoObj.updatedTime);
                    const indexedUpdatedTime = new Date(indexedRecord.updatedTime);

                    if (mongoUpdatedTime > indexedUpdatedTime) {
                        // Update IndexedDB if MongoDB has more recent data
                        indexedStore.put(mongoObj);
                        console.log(`Updated record with sensorID: ${sensorID} in IndexedDB from MongoDB.`);
                    }
                }
            };
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
