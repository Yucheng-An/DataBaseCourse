// create the indexedDB
let req = indexedDB.open("BookDB",1)
req.onsuccess = function(e){
    db = req.result;
    console.log("Success");
}

// trigger when creating database first time 
req.onupgradeneeded = function(e){}

req.onsuccess = function(e){}

req.onerror = function(e){}

