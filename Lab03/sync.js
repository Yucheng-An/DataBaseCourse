const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const mongoUrl = "mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3";
const dbName = "lab3";
const collectionName = "4449";

async function connectMongoDB() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(dbName).collection(collectionName);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

app.post('/sync', async (req, res) => {
    const sensorData = req.body; // Array of sensor data from IndexedDB
    if (!Array.isArray(sensorData) || sensorData.length === 0) {
        return res.status(400).json({ message: 'Invalid data' });
    }
    try {
        const collection = await connectMongoDB();
        await collection.insertMany(sensorData, { ordered: false });
        res.status(200).json({ message: 'Data synced successfully' });
    } catch (error) {
        console.error('Error syncing data with MongoDB:', error);
        res.status(500).json({ message: 'Failed to sync data' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
