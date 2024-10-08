const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3?retryWrites=true&w=majority&tls=true";
const indexedDBFile = './indexeddb.json';

async function fetchMongoDBData() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('4449');
        const mongoData = await collection.find({}).toArray();
        console.log('MongoDB Data:', mongoData);
        return mongoData;
    } finally {
        await client.close();
    }
}


function fetchIndexedDBData() {
    if (fs.existsSync(indexedDBFile)) {
        const indexedDBData = JSON.parse(fs.readFileSync(indexedDBFile, 'utf8'));
        console.log('IndexedDB Data:', indexedDBData);
        return indexedDBData;
    } else {
        console.log('IndexedDB data file not found.');
        return [];
    }
}


async function syncData() {
    const mongoData = await fetchMongoDBData();
    const indexedDBData = fetchIndexedDBData();

    const mongoMap = new Map(mongoData.map(item => [item.uuid, item]));
    const indexedDBMap = new Map(indexedDBData.map(item => [item.uuid, item]));

    const newRecords = [];
    const updatedRecords = [];

    indexedDBData.forEach(item => {
        if (!mongoMap.has(item.uuid)) {
            newRecords.push(item);
        } else if (JSON.stringify(mongoMap.get(item.uuid)) !== JSON.stringify(item)) {
            updatedRecords.push(item);
        }
    });

    if (newRecords.length || updatedRecords.length) {
        console.log(`New records to sync: ${newRecords.length}`);
        console.log(`Records to update: ${updatedRecords.length}`);
    } else {
        console.log('IndexedDB and MongoDB are already in sync.');
    }
}

syncData().catch(console.error);
