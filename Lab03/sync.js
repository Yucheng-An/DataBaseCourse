const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3';
const client = new MongoClient(uri);
async function readData() {
    try {
        await client.connect();
        const database = client.db('lab3');
        const collection = database.collection('4449');
        const results = await collection.find({});
        console.log('Documents:', results);
    } catch (error) {
        console.error('Error reading data:', error);
    } finally {
        await client.close();
    }
}
readData();
