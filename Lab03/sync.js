const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";

// Simulating IndexedDB data as a JSON file
const indexedDBFile = path.join(__dirname, 'indexeddb.json');  // Path to the JSON file representing IndexedDB

// Function to fetch MongoDB data
async function fetchMongoDBData() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('4449');

        // Fetch all data from MongoDB
        const mongoData = await collection.find({}).toArray();
        console.log('MongoDB Data fetched successfully.');
        return mongoData;
    } finally {
        await client.close();
    }
}

// Function to fetch IndexedDB data (from the JSON file)
function fetchIndexedDBData() {
    if (fs.existsSync(indexedDBFile)) {
        const indexedDBData = JSON.parse(fs.readFileSync(indexedDBFile, 'utf8'));
        console.log('IndexedDB Data fetched successfully.');
        return indexedDBData;
    } else {
        console.log('IndexedDB data file not found.');
        return [];
    }
}

// Function to sync data between IndexedDB and MongoDB
async function syncData() {
    const mongoData = await fetchMongoDBData();
    const indexedDBData = fetchIndexedDBData();

    // Create maps for easier comparison
    const mongoMap = new Map(mongoData.map(item => [item.uuid, item]));
    const indexedDBMap = new Map(indexedDBData.map(item => [item.uuid, item]));

    const newRecords = [];
    const updatedRecords = [];

    // Compare data from IndexedDB to MongoDB
    indexedDBData.forEach(item => {
        if (!mongoMap.has(item.uuid)) {
            newRecords.push(item); // New records that don't exist in MongoDB
        } else if (JSON.stringify(mongoMap.get(item.uuid)) !== JSON.stringify(item)) {
            updatedRecords.push(item); // Records that need to be updated in MongoDB
        }
    });

    if (newRecords.length > 0 || updatedRecords.length > 0) {
        console.log(`New records to sync: ${newRecords.length}`);
        console.log(`Records to update: ${updatedRecords.length}`);
    } else {
        console.log('IndexedDB and MongoDB are already in sync.');
    }

    // Insert new records into MongoDB
    if (newRecords.length > 0) {
        await insertNewRecords(newRecords);
    }

    // Update existing records in MongoDB
    if (updatedRecords.length > 0) {
        await updateRecords(updatedRecords);
    }
}

// Function to insert new records into MongoDB
async function insertNewRecords(newRecords) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('4449');

        await collection.insertMany(newRecords);
        console.log(`${newRecords.length} new records inserted into MongoDB.`);
    } finally {
        await client.close();
    }
}

// Function to update existing records in MongoDB
async function updateRecords(updatedRecords) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('4449');

        for (const record of updatedRecords) {
            await collection.updateOne(
                { uuid: record.uuid },
                { $set: record }
            );
        }
        console.log(`${updatedRecords.length} records updated in MongoDB.`);
    } finally {
        await client.close();
    }
}

// Run sync
syncData().catch(console.error);
