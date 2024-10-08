const mongoose = require('mongoose').set('strictQuery', true)
const url = 'mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3/?retryWrites=true&w=majority'
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
    .connect(url)
const Sensor = mongoose.model('4449', sensorSchema)
Sensor.find({}).then(result => {
    result.forEach(task => {
        console.log(task)
    })
    mongoose.connection.close()
})