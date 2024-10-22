const statuses = ["in progress", "completed", "pending"];
const tasks = [
    "Finish the monthly report",
    "Prepare presentation slides",
    "Review code changes",
    "Write documentation",
    "Attend team meeting",
    "Test new feature",
    "Fix bugs from review",
    "Complete project plan",
    "Update client on progress",
    "Conduct code review session",
    "Organize project files",
    "Write user manual",
    "Research new software tools",
    "Implement feedback from team",
    "Optimize performance issues",
    "Update project roadmap",
    "Schedule meeting with client",
    "Create test cases for new feature",
    "Prepare financial report",
    "Submit time-off request",
    "Evaluate team performance",
    "Run software simulations",
    "Implement security patches",
    "Organize team-building event",
    "Prepare meeting agenda",
    "Review technical documentation",
    "Update internal knowledge base",
    "Deploy new software version",
    "Track project milestones",
    "Review legal documents",
    "Analyze user feedback",
    "Check system backups",
    "Prepare budget forecast",
    "Host a training session",
    "Organize feedback from users",
    "Draft a proposal for a new project",
    "Perform database maintenance",
    "Schedule code deployment",
    "Collaborate on project deliverables",
    "Prepare project timeline",
    "Organize marketing materials",
    "Perform system integration tests"
];

function setupIndexedDB(dbName, storeName, callback) {
    let request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            let objectStore = db.createObjectStore(storeName, { keyPath: "id" });
            objectStore.createIndex("id", "id", { unique: false });
            objectStore.createIndex("status", "status", { unique: false });
        }

        //Create an object store for TodoListCompleted
        if (!db.objectStoreNames.contains("TodoListCompleted")) {
            objectStore = db.createObjectStore("TodoListCompleted", { keyPath: "id" });
        }

    };
    request.onsuccess = function (event) {
        let db = event.target.result;
        callback(db);
    };
    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event);
    };
}
function add100kObjects(db, storeName, callback) {
    let transaction = db.transaction(storeName, "readonly");
    let objectStore = transaction.objectStore(storeName);
    let countRequest = objectStore.count();
    countRequest.onsuccess = function () {
        if (countRequest.result === 0) {
            let writeTransaction = db.transaction(storeName, "readwrite");
            let writeObjectStore = writeTransaction.objectStore(storeName);
            for (let i = 0; i < 100000; i++) {
                let object = {
                    id: i,
                    task: `${tasks[Math.floor(Math.random() * tasks.length)]}`,
                    status: `${statuses[Math.floor(Math.random() * statuses.length)]}`,
                    dueDate: new Date(Date.now() + Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0]
                };
                writeObjectStore.add(object);
            }
            writeTransaction.oncomplete = function () {
                console.log("100k objects added.");
                callback();
            };
            writeTransaction.onerror = function (event) {
                console.error("Error adding objects:", event);
            };
        } else {
            console.log("Objects already exist, skipping insertion.");
            callback();
        }
    };

    countRequest.onerror = function (event) {
        console.error("Error counting objects:", event);
    };
}


// Function readingCompletedObject: Reading 1000 completed objects
function setCompleteStatus(db, storeName, completedNumber, progressNumber, pendingNumber, callback) {
    let transaction = db.transaction(storeName, "readwrite");
    let objectStore = transaction.objectStore(storeName);
    let counter = 0;
    let completedCounter = 0;
    let progressCounter = 0;
    let pendingCounter = 0;
    let request = objectStore.openCursor();
    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let updatedValue = cursor.value;
            if (completedCounter < completedNumber) {
                updatedValue.status = "completed";
                completedCounter++;
            } else if (progressCounter < progressNumber) {
                updatedValue.status = "in progress";
                progressCounter++;
            } else if (pendingCounter < pendingNumber) {
                updatedValue.status = "pending";
                pendingCounter++;
            }
            counter++;
            cursor.update(updatedValue);
            cursor.continue();
        } else {
            console.log("1000 Status update completed.")
            console.log("Completed:", completedCounter, " In Progress:", progressCounter, " Pending:", pendingCounter);
            callback();
        }
    };
    transaction.onerror = function (event) {
        console.error("Error updating statuses:", event);
    };
}

function readSomeStatusWithSomeMethod(db, storeName, status, method, callback) {
    let transaction = db.transaction(storeName, method);
    let objectStore = transaction.objectStore(storeName);
    let counter = 0;
    let request = objectStore.openCursor();
    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === status) {
                counter++;
            }
            cursor.continue();
        } else {
            console.log(`Found status '${status}':`, counter, " By using method:", method , "!!!");
            callback();
        }
    };
    transaction.onerror = function (event) {
        console.error("Error updating statuses:", event);
    };
}


// An index on the `status` field, then measure and display the time to read all completed tasks
function indexField(db, storeName, status ,callback) {
    let transaction = db.transaction(storeName, "readonly");
    let objectStore = transaction.objectStore(storeName);
    let index = objectStore.index("status");
    let counter = 0;
    let request = index.openCursor(IDBKeyRange.only(status));
    const data = [];
    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            counter++;
            data.push(cursor.value);
            cursor.continue();
        } else {
            console.log(`Found status '${status}':`, counter, " By using index ('status')!!!");
            callback(counter, data);
        }
    };
}

function copyAllCompletedTasksFromToDoListToToDoListCompleted() {

}


function main() {
    const dbName = "Project1DB";
    const storeName = "TodoList";
    setupIndexedDB(dbName, storeName, function (db) {
        // add 100k objects
        add100kObjects(db, storeName, function () {
            // 1. Set 1000 objects to status "completed" and the remaining ones to status "progress"
            setCompleteStatus(db, storeName, 1000, 100000-1000, 0, function () {
                //2. Measure and display the time (in milliseconds) required to read all objects with `status` set to "completed" on the console or the browser
                let startTime = performance.now();
                readSomeStatusWithSomeMethod(db, storeName, "completed","readwrite", function () {
                    let endTime = performance.now();
                    console.log(`Time took to read all objects with status "completed" with readwrite method: ${(endTime - startTime).toFixed(2)} ms`);
                    // 3. Apply a read-only flag to the object store and measure and display the time to read all completed tasks again on the console or the browser.
                    startTime = performance.now();
                    readSomeStatusWithSomeMethod(db, storeName, "completed", "readonly", function () {
                        endTime = performance.now();
                        console.log(`Time took to read all objects with status "completed" with read-only method" :${(endTime - startTime).toFixed(2)} ms`);
                        //4. Create an index on the `status` field, then measure and display the time to read all completed tasks on the console or the browser
                        startTime = performance.now();
                        indexField(db, storeName,"completed", function (counter, data) {
                            endTime = performance.now();
                            console.log(`Time took to read all objects with status "completed" with indexing on "status": ${(endTime - startTime).toFixed(2)} ms`);
                            // 5. Define a new object store called "TodoListCompleted", copy all completed tasks from "TodoList" to this new store,
                            // and measure and display the time required to read all completed tasks from "TodoListCompleted" on the console or the browser

                            let transaction = db.transaction("TodoListCompleted", "readwrite");
                            objectStore = transaction.objectStore("TodoListCompleted");
            
                            for (let i = 0; i < data.length; i++) {
                                objectStore.add(data[i]);
                            }
                            startTime = performance.now();
                            readSomeStatusWithSomeMethod(db, "TodoListCompleted", "completed", "readonly", function() {
                                endTime = performance.now();
                                console.log(`Time took to read all objects with status "completed" with read-only method from TodoListCompleted" :${(endTime - startTime).toFixed(2)} ms`);
                            })
                        });
                    });
                });
            });
        });
    });
}

main();