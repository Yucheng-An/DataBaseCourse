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
const Sensor = mongoose.model('4449', sensorSchema)
mongoose
    .connect(url)
    .then((result) => {
        console.log('MongoDB has been connected')
    })
    .then(() => {
        console.log('task saved!')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))