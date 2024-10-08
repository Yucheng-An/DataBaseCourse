const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";

function readIndexDBJSONFile() {
    try {
        const data = fs.readFileSync('browserIndexDBSensors', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading the IndexedDB JSON file:', err);
        return null;
    }
}
async function syncDataToMongoDB() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('4449');
        const indexDBData = readIndexDBJSONFile();
        if (!indexDBData) {
            console.error('No data to sync.');
            return;
        }
        const bulkOps = indexDBData.map(obj => ({
            updateOne: {
                filter: { uuid: obj.uuid },
                update: { $set: obj },
                upsert: true
            }
        }));
        if (bulkOps.length > 0) {
            await collection.bulkWrite(bulkOps);
            console.log('IndexedDB synced to MongoDB.');
        } else {
            console.log('No documents to update or insert.');
        }
    } catch (err) {
        console.error('Error syncing data to MongoDB:', err);
    } finally {
        await client.close();
    }
}

syncDataToMongoDB().then(r => console.log('Done'));
