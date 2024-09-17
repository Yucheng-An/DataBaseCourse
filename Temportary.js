// create the indexedDB
let req = indexedDB.open("BookDB",1)

// trigger when creating database first time
req.onupgradeneeded = function(event){
    let db = event.target.result
    db.createObjectStore("book", {keyPath: "uuid"})
    // let objStoreReq = db.createObjectStore("book", {keyPath: "uuid"})

}

// trigger when starting or refreshing the website
req.onsuccess = function(event){
    let db = event.target.result
    // Need to create a transaction to perform any operation on the database
    let transaction = db.getObjectStore("book").transaction("book", "readwrite")
}


// trigger when starting or refreshing the website
req.onerror = function(event){}

