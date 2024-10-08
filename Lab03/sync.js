const { MongoClient } = require('mongodb');
const axios = require('axios'); // To fetch IndexedDB data through an API

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


async function getIndexedDBData() {
    try {
        const response = await axios.get('http://localhost:63343/Database%20Managment%20Course/Lab03/app.html?_ijt=3evqdkoj2i9t4i8rbfna1igfdo&_ij_reload=RELOAD_ON_SAVE'); // Adjust this API URL to fetch your IndexedDB data
        return response.data; // Assuming the data is returned in the response body
    } catch (error) {
        console.error("Error fetching IndexedDB data: ", error);
        return [];
    }
}
console.log(getIndexedDBData())