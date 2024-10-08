const { MongoClient } = require('mongodb');
const axios = require('axios'); // To fetch IndexedDB data through an API

// MongoDB connection details
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/";
const dbName = "lab3";
const collectionName = "4449";
const indexDBLocation =

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
        const response = await axios.get('file:///Users/yuchengan/Database%20Managment%20Course/Lab03/app.html');
        return response.data; // Assuming the data is returned in the response body
    } catch (error) {
        console.error("Error fetching IndexedDB data: ", error);
        return [];
    }
}
data1 = getIndexedDBData()
console.log(data1)