const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const IndexedDB = require('fake-indexeddb'); 
const IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange'); // For IDBKeyRange

const mongoUrl = "mongodb://localhost:27017/";
const dbName = "lab3";
const collectionName = "4449";

async function connectMongoDB() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName).collection(collectionName);
}

async function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = IndexedDB.open('IndexDB', 1);
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            db.createObjectStore('Sensor', { keyPath: 'id' });
        };
        request.onsuccess = function (event) {
            console.log("Opened IndexedDB");
            resolve(event.target.result);
        }
        request.onerror = function (event) {
            console.error('Error opening IndexedDB:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

// Sync function to check and update data between MongoDB and IndexedDB
async function syncData() {
    try {
        const collection = await connectMongoDB();
        const indexedDB = await openIndexedDB();

        // Read all MongoDB data
        const mongoData = await collection.find({}).toArray();
        console.log(`MongoDB Data Count: ${mongoData.length}`);

        // Read all IndexedDB data
        const transaction = indexedDB.transaction('Sensor', 'readonly');
        const sensorStore = transaction.objectStore('Sensor');

        const indexedDBData = await new Promise((resolve, reject) => {
            const request = sensorStore.getAll();
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.errorCode);
        });

        console.log(`IndexedDB Data Count: ${indexedDBData.length}`);

        // Sync logic: Check differences and update accordingly
        const indexedDBUuids = new Set(indexedDBData.map(item => item.uuid));
        const mongoUuids = new Set(mongoData.map(item => item.uuid));

        // Sync from MongoDB to IndexedDB
        const toInsertInIndexedDB = mongoData.filter(item => !indexedDBUuids.has(item.uuid));
        if (toInsertInIndexedDB.length > 0) {
            console.log(`Inserting ${toInsertInIndexedDB.length} items into IndexedDB`);
            const transactionWrite = indexedDB.transaction('Sensor', 'readwrite');
            const sensorStoreWrite = transactionWrite.objectStore('Sensor');
            toInsertInIndexedDB.forEach(item => sensorStoreWrite.add(item));
        } else {
            console.log("No new data to insert into IndexedDB");
        }

        // Sync from IndexedDB to MongoDB
        const toInsertInMongoDB = indexedDBData.filter(item => !mongoUuids.has(item.uuid));
        if (toInsertInMongoDB.length > 0) {
            console.log(`Inserting ${toInsertInMongoDB.length} items into MongoDB`);
            await collection.insertMany(toInsertInMongoDB);
        } else {
            console.log("No new data to insert into MongoDB");
        }

        console.log("Sync completed successfully.");
    } catch (error) {
        console.error('Sync Error:', error);
    }
}

// Start sync process
syncData();
