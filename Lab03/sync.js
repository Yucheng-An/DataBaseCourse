const mongoose = require('mongoose').set('strictQuery', true)
const url = 'mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/DMS/?retryWrites=true&w=majority'
const sensorSchema = new mongoose.Schema({
    uuid: String,
    sourceDB: String,
    createdTime: Date,
    updatedTime: Date,
    sensorID:String,
    sensorLocation:Array,
    sensorStatus:String
})

mongoose
    .connect(url).then(result => {
        console.log('connected to MongoDB')
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })