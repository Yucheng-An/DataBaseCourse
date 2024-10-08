const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');


const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function fetchIndexedDBData() {

    return [
        {
            UUID: uuidv4(),
            source_db: "IndexedDB",
        }
    ];
}


async function syncData() {
    try {
        const indexedDBData = await fetchIndexedDBData();
        await client.connect();
        const database = client.db("lab3");
        const collection = database.collection("9994");
        for (let obj of indexedDBData) {
            const existingObject = await collection.findOne({ UUID: obj.UUID });
            if (existingObject) {
                await collection.updateOne(
                    { UUID: obj.UUID },
                    { $set: { ...obj, updated_at: new Date() } }
                );
                console.log(`Updated object with UUID: ${obj.UUID}`);
            } else {
                await collection.insertOne(obj);
                console.log(`Inserted new object with UUID: ${obj.UUID}`);
            }
        }

        console.log("Data sync completed successfully.");
    } catch (error) {
        console.error("Error during data sync:", error);
    } finally {
        await client.close();
    }
}

// Call the sync function
syncData();