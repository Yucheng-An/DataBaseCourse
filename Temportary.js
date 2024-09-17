let req = indexedDB.open("BookDB",1)
req.onsuccess = function(e){
    db = req.result;
    console.log("Success");
}


