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


// Mongo
