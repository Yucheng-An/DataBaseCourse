// create the indexedDB
let req = indexedDB.open("BookDB",1)
req.onsuccess = function(event){
    let db = event.target.result

}

// trigger when creating database first time
req.onupgradeneeded = function(e){}

// trigger when starting or refreshing the website
req.onsuccess = function(e){}


// trigger when starting or refreshing the website
req.onerror = function(e){}

