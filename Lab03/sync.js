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
    const mongoData = await collection.find({}).toArray();
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

        const mongoDataMap = new Map(mongoData.map(item => [item.uuid, item]));
        const indexedDBMap = new Map(indexedDBData.map(item => [item.uuid, item]));

        const updatesToMongo = [];
        const updatesToIndexedDB = [];

        // Compare and update MongoDB and IndexedDB
        for (const [uuid, indexedDBItem] of indexedDBMap) {
            const mongoItem = mongoDataMap.get(uuid);
            if (!mongoItem) {
                updatesToMongo.push({ ...indexedDBItem, sourceDB: 'IndexedDB' });
            } else if (new Date(indexedDBItem.updatedTime) > new Date(mongoItem.updatedTime)) {
                updatesToMongo.push({ ...indexedDBItem, sourceDB: 'IndexedDB' });
            }
        }

        for (const [uuid, mongoItem] of mongoDataMap) {
            const indexedDBItem = indexedDBMap.get(uuid);
            if (!indexedDBItem) {
                updatesToIndexedDB.push({ ...mongoItem, sourceDB: 'MongoDB' });
            } else if (new Date(mongoItem.updatedTime) > new Date(indexedDBItem.updatedTime)) {
                updatesToIndexedDB.push({ ...mongoItem, sourceDB: 'MongoDB' });
            }
        }

        console.log(`Updates to MongoDB: ${updatesToMongo.length}`);
        console.log(`Updates to IndexedDB: ${updatesToIndexedDB.length}`);

        // Update MongoDB
        if (updatesToMongo.length > 0) {
            const collection = client.db(dbName).collection(collectionName);
            for (const update of updatesToMongo) {
                await collection.updateOne({ uuid: update.uuid }, { $set: update }, { upsert: true });
            }
            console.log('MongoDB synced.');
        }

        return updatesToIndexedDB;
    } catch (error) {
        console.error('Error during sync: ', error);
    } finally {
        await client.close();
    }
}

// Endpoint to receive IndexedDB data
app.post('/sync-indexeddb', async (req, res) => {
    const indexedDBData = req.body;
    console.log(`Received ${indexedDBData.length} records from IndexedDB.`);

    const updatesToIndexedDB = await syncData(indexedDBData);

    res.json({ message: 'Sync completed', updatesToIndexedDB });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
