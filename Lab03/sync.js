const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB connection details
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
const dbName = "lab3";
const collectionName = "4449";

// Function to fetch MongoDB data
async function getMongoDBData(client) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const mongoData = await collection.find({}).toArray(); // Fetch all data from MongoDB
    return mongoData;
}

// Compare and sync MongoDB and IndexedDB data
async function syncData(indexedDBData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        // Fetch MongoDB data
        const mongoData = await getMongoDBData(client);
        console.log(`Fetched ${mongoData.length} records from MongoDB.`);

        // Create a map for efficient lookup
        const mongoDataMap = new Map(mongoData.map(item => [item.uuid, item]));
        const indexedDBMap = new Map(indexedDBData.map(item => [item.uuid, item]));

        const updatesToMongo = [];
        const updatesToIndexedDB = [];

        // Compare IndexedDB with MongoDB
        for (const [uuid, indexedDBItem] of indexedDBMap) {
            const mongoItem = mongoDataMap.get(uuid);
            if (!mongoItem) {
                // If MongoDB doesn't have the record, add it to MongoDB
                updatesToMongo.push({ ...indexedDBItem, sourceDB: 'IndexedDB' });
            } else if (new Date(indexedDBItem.updatedTime) > new Date(mongoItem.updatedTime)) {
                // If IndexedDB data is more recent, update MongoDB
                updatesToMongo.push({ ...indexedDBItem, sourceDB: 'IndexedDB' });
            }
        }

        // Compare MongoDB with IndexedDB
        for (const [uuid, mongoItem] of mongoDataMap) {
            const indexedDBItem = indexedDBMap.get(uuid);
            if (!indexedDBItem) {
                // If IndexedDB doesn't have the record, sync from MongoDB
                updatesToIndexedDB.push({ ...mongoItem, sourceDB: 'MongoDB' });
            } else if (new Date(mongoItem.updatedTime) > new Date(indexedDBItem.updatedTime)) {
                // If MongoDB data is more recent, sync to IndexedDB
                updatesToIndexedDB.push({ ...mongoItem, sourceDB: 'MongoDB' });
            }
        }

        console.log(`Updates to MongoDB: ${updatesToMongo.length}`);
        console.log(`Updates to IndexedDB: ${updatesToIndexedDB.length}`);

        // Perform MongoDB updates
        if (updatesToMongo.length > 0) {
            const collection = client.db(dbName).collection(collectionName);
            for (const update of updatesToMongo) {
                await collection.updateOne(
                    { uuid: update.uuid },
                    { $set: update },
                    { upsert: true } // Create document if it doesn't exist
                );
            }
            console.log('MongoDB synced.');
        }

        // Return updates for IndexedDB to be handled by the client
        return updatesToIndexedDB;

    } catch (error) {
        console.error('Error during sync: ', error);
    } finally {
        await client.close();
    }
}

// Endpoint to receive IndexedDB data and sync with MongoDB
app.post('/sync-indexeddb', async (req, res) => {
    const indexedDBData = req.body; // IndexedDB data received from the client
    console.log(`Received ${indexedDBData.length} records from IndexedDB.`);

    // Sync the data
    const updatesToIndexedDB = await syncData(indexedDBData);

    // Respond with updates that need to be applied to IndexedDB
    res.json({ message: 'Sync completed', updatesToIndexedDB });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
