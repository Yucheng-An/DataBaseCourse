// Create the IndexedDB
let req = indexedDB.open("BookDB", 1);

// Trigger when creating the database for the first time
req.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("book", { keyPath: "uuid" });
};

// Trigger when starting or refreshing the website
req.onsuccess = function(event) {
    let db = event.target.result;

    // Create a transaction to perform any operation on the database
    let transactionBook = db.transaction("book", "readwrite"); // Fix: 'transaction' should be invoked on 'db'

    // Access the object store
    let bookObjectStore = transactionBook.objectStore("book"); // Fix: 'objectStore' not 'getObjectStore'

    // Create a book object
    let book = {
        "uuid": crypto.randomUUID(),
        "author": "J.K. Rowling", // Author of the book
        "title": "Harry Potter and the Philosopher's Stone", // Title of the book
        "description": "Something" // Description of the book
    };

    // Add the book to the object store
    let addReq = bookObjectStore.add(book);

    // Optional: Handle success or error
    addReq.onsuccess = function() {
        console.log("Book added successfully!");
    };
    addReq.onerror = function() {
        console.log("Error adding the book.");
    };
};


// trigger when starting or refreshing the website
req.onerror = function(event){}


// MongoDB
// Create a new database
//use BookDB;
// Create a new collection
//db.createCollection("book");
// Insert a new document
//db.book.insertOne({
//    "uuid": "123",
//    "author": "J.K. Rowling",
//    "title": "Harry Potter and the Philosopher's Stone",
//    "description": "Something"
//});
// Find the document
//db.book.find({ "uuid": "123" });
// Update the document
//db.book.updateOne(
//    { "uuid": "123" },
//    { $set: { "description": "Something else" } }
//);
// Delete the document
//db.book.deleteOne({ "uuid": "123" });
// Drop the collection
//db.book.drop();
// Drop the database
//db.dropDatabase


//Lab02
    [ {"id": "V001", "make": "Toyota", "model": "Camry", "year": 2020, "mileage": 15000, "fuelType": "Gasoline", "color": "Blue", "owner": "John Doe", "lastServiceDate": "2024-01-15", "isElectric": false}, {"id": "V002", "make": "Honda", "model": "Civic", "year": 2019, "mileage": 25000, "fuelType": "Gasoline", "color": "Red", "owner": "Jane Smith", "lastServiceDate": "2024-03-10", "isElectric": false}, {"id": "V003", "make": "Tesla", "model": "Model 3", "year": 2022, "mileage": 5000, "fuelType": "Electric", "color": "White", "owner": "Emily Johnson", "lastServiceDate": "2024-06-22", "isElectric": true}, {"id": "V004", "make": "Ford", "model": "F-150", "year": 2018, "mileage": 60000, "fuelType": "Diesel", "color": "Black", "owner": "Michael Brown", "lastServiceDate": "2024-02-08", "isElectric": false}, {"id": "V005", "make": "Chevrolet", "model": "Bolt EV", "year": 2021, "mileage": 12000, "fuelType": "Electric", "color": "Green", "owner": "Sarah Smith", "lastServiceDate": "2024-07-30", "isElectric": true} ];



