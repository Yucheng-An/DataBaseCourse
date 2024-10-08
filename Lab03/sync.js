const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
function readIndexDBJSONFile() {
    const data = fs.readFileSync('browserIndexDBSensors', 'utf8');
    return JSON.parse(data);
}
async function syncDataToMongoDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('lab3');
        const collection = db.collection('4449');
        const indexDBData = readIndexDBJSONFile();
        for (const obj of indexDBData) {
            await collection.updateOne(
                { uuid: obj.uuid },
                { $set: obj },
                { upsert: true }
            );
        }
        console.log('Data sync complete. IndexedDB data successfully synced to MongoDB.');
    } catch (err) {
        console.error('Error syncing data to MongoDB:', err);
    } finally {
        await client.close();
    }
}
syncDataToMongoDB(indexedDBData);