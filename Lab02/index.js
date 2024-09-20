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
//Checksum one object of Vehicle
async function createChecksum(oneVehicle) {
    const dataAsBytes = new TextEncoder().encode(oneVehicle);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataAsBytes);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}
// Go through all vehicles and add checksum to each vehicle
async function addChecksumsToVehicles(vehicles) {
    for (let vehicle of vehicles) {
        vehicle.checksum = await createChecksum(JSON.stringify(vehicle));
    }
    return vehicles
}
// print out in console
addChecksumsToVehicles(vehicles).then(result => console.log(result));

//Question 4
function checkVilde(vehicles) {
    const brands = ["Toyota", "Honda", "Tesla", "Ford", "Chevrolet"];
    const lastServiceDate = new Date("2024-01-01");
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    // Go through all vehicles and add checksum to each vehicle
    vehicles.forEach(vehicle => {
        if (!checkMake(vehicle.make)) {
            console.log(`Invalid make: ${vehicle.make}`);
        }
        if (!checkYear(vehicle.year)) {
            console.log(`Invalid date: ${vehicle.lastServiceDate}`);
        }
        if (new Date(vehicle.lastServiceDate) > lastServiceDate) {
            console.log(`Last service date is in the future: ${vehicle.lastServiceDate}`);
        }
    })
}
function checkMake(info) {
    const allowedMakes = ["Toyota", "Honda", "Tesla", "Ford", "Chevrolet"]; // Define allowed makes
    return typeof info === 'string' && allowedMakes.includes(info);
}
function checkYear(info) {
    const currentYear = new Date().getFullYear()
    return typeof info === 'number' && info >= 1886 && info <= currentYear
}
function checkLSD(info) {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for YYYY-MM-DD format
    const serviceDate = new Date(info);
    const currentDate = new Date();
    return typeof info === 'string' && regex.test(info) && serviceDate <= currentDate// Check format
}

console.log(checkVilde("2"));