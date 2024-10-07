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

let patient = {
    "uuid":crypto.randomUUID(),
    "name": "asdf",
        ...
}

let requestExtract  = indexedDB.open("patinentDbExtract", 1);
let requestTransform = indexedDB.open("patinentDbTransform", 1);
let requestLoad      = indexedDB.open("patinentDbLoad", 1);

requestExtract.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("patient", { keyPath: "uuid" })
}

requestTransform.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("patient", { keyPath: "uuid" })
}

requestExtract.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction("patient", "readwrite");
    let os = transaction.objectStore("patient");
    os.add(patient);
    patient.name = patient.name.trim()=== "" ? "unset" : patient.name.trim();

}

requestTransform.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(["patient"], "readwrite");
    let os = transaction.objectStore("patient");
    patient.name = patient.name.trim()=== "" ? "unset" : patient.name.trim();
    os.add(patient);

}






