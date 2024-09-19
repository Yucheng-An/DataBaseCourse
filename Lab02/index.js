const crypto = require('crypto');

const vehicles = [ {"id": "V001", "make": "Toyota", "model": "Camry", "year": 2020, "mileage": 15000, "fuelType": "Gasoline", "color": "Blue", "owner": "John Doe", "lastServiceDate": "2024-01-15", "isElectric": false}, {"id": "V002", "make": "Honda", "model": "Civic", "year": 2019, "mileage": 25000, "fuelType": "Gasoline", "color": "Red", "owner": "Jane Smith", "lastServiceDate": "2024-03-10", "isElectric": false}, {"id": "V003", "make": "Tesla", "model": "Model 3", "year": 2022, "mileage": 5000, "fuelType": "Electric", "color": "White", "owner": "Emily Johnson", "lastServiceDate": "2024-06-22", "isElectric": true}, {"id": "V004", "make": "Ford", "model": "F-150", "year": 2018, "mileage": 60000, "fuelType": "Diesel", "color": "Black", "owner": "Michael Brown", "lastServiceDate": "2024-02-08", "isElectric": false}, {"id": "V005", "make": "Chevrolet", "model": "Bolt EV", "year": 2021, "mileage": 12000, "fuelType": "Electric", "color": "Green", "owner": "Sarah Smith", "lastServiceDate": "2024-07-30", "isElectric": true} ];
//Question 2
function getVehicleSumMileage(vehicles) {
    let sum = 0;
    for (let i = 0; i < vehicles.length; i++) {
        sum += vehicles[i].mileage;
    }
    return sum;
}
console.log("Total mileage:" + getVehicleSumMileage(vehicles));


//Question 3
// Function to create a checksum for a given data string
async function createChecksum(oneVehicle) {
    const dataAsBytes = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataAsBytes);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

// Function to add a checksum to each vehicle object
async function addChecksumsToVehicles(vehicles) {
    for (let vehicle of vehicles) {
        const checksum = await createChecksum(JSON.stringify(vehicle));
        vehicle.checksum = checksum;
    }
    console.log(vehicles);
}

addChecksumsToVehicles(vehicles);

