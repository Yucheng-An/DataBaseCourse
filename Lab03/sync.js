const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const { MongoClient } = require('mongodb');

// MongoDB connection URL
const uri = 'mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3';
const client = new MongoClient(uri);

async function readData() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Access the database and collection
        const database = client.db('lab3');
        const collection = database.collection('4449');

        // Query for data (e.g., find all documents in the collection)
        const results = await collection.find({}).toArray();

        // Output the results
        console.log('Documents:', results);
    } catch (error) {
        console.error('Error reading data:', error);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

readData();

readData();
