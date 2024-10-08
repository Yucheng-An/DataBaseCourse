const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const mongoUrl = "mongodb://localhost:27017";
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

app.get('/fetch', async (req, res) => {
    try {
        const collection = await connectMongoDB();
        const mongoData = await collection.find({}).toArray();
        res.status(200).json(mongoData);
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).json({ message: 'Failed to fetch data from MongoDB' });
    }
});

app.post('/sync', async (req, res) => {
    const sensorData = req.body;
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
