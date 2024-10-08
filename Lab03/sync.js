const { MongoClient } = require('mongodb');
const axios = require('axios'); // To fetch IndexedDB data through an API

// MongoDB connection details
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/";
const dbName = "lab3";
const collectionName = "4449";

// // Function to fetch MongoDB data
// async function getMongoDBData(client) {
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     const mongoData = await collection.find({}); // Fetch all data from MongoDB
//     return mongoData;
// }
// console.log(getMongoDBData())


async function getIndexedDBData() {
    try {
        const response = await axios.get('https://se4cps.github.io/lab/dms2/#/250'); // Adjust this API URL to fetch your IndexedDB data
        return response.data; // Assuming the data is returned in the response body
    } catch (error) {
        console.error("Error fetching IndexedDB data: ", error);
        return [];
    }
}
console.log(getIndexedDBData())