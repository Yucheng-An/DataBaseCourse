const { MongoClient } = require('mongodb');
const axios = require('axios'); // To fetch IndexedDB data through an API

// MongoDB connection details
const uri = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
const dbName = "lab3";
const collectionName = "4449";

async function getIndexedDBData() {
    try {
        const response = await axios.get('http://localhost:3000/indexeddb-data'); // Adjust this API URL to fetch your IndexedDB data
        return response.data; // Assuming the data is returned in the response body
    } catch (error) {
        console.error("Error fetching IndexedDB data: ", error);
        return [];
    }
}