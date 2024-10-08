const fs = require('fs');
const { MongoClient } = require('mongodb');
// MongoDB connection URI
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
// Function to load data from exported IndexedDB JSON file
function loadIndexedDBData() {
    const data = fs.readFileSync('indexeddb_export.json', 'utf8');
    return JSON.parse(data);
}
// Function to sync IndexedDB data to MongoDB
async function syncDataToMongoDB(data) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('2109_MayureshMore');

        // Insert data into MongoDB, assuming UUID is the unique identifier
        for (const obj of data) {
            // Upsert the document in MongoDB (insert or update if exists)
            await collection.updateOne(
                { uuid: obj.uuid }, // Matching the unique UUID
                { $set: obj },      // Updating the document with the new data
                { upsert: true }    // Insert if it does not exist
            );
        }
        console.log('Data sync complete. IndexedDB data successfully synced to MongoDB.');
    } catch (err) {
        console.error('Error syncing data to MongoDB:', err);
    } finally {
        await client.close();
    }
}
// Load data from IndexedDB export and sync to MongoDB
const indexedDBData = loadIndexedDBData();
syncDataToMongoDB(indexedDBData);