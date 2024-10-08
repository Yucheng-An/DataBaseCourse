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

// Function setupIndexedDB: Setting up IndexedDB and add100kObjects adding 100k objects
function setupIndexedDB(dbName, storeName, callback) {
    let request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            let objectStore = db.createObjectStore(storeName, { keyPath: "id" });
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
function readingCompletedObject(db, storeName, callback) {
    let transaction = db.transaction(storeName, "readwrite");
    let objectStore = transaction.objectStore(storeName);
    let completedObjects = [];
    let request = objectStore.openCursor();
    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === "completed") {
                completedObjects.push(cursor.value)
            }
            cursor.continue();
        } else {
            callback(completedObjects);
        }
    };
}

// Function readingObjectNames: Reading 100k object names
// function readingObjectNamesReadOnly(db, storeName, callback) {
//     let transaction = db.transaction(storeName, "readonly");
//     let objectStore = transaction.objectStore(storeName);
//     let count = 0;
//     let request = objectStore.openCursor();
//     request.onsuccess = function (event) {
//         let cursor = event.target.result;
//         if (cursor) {
//             if (cursor.value.status === "completed") {
//                 count++;
//             }
//             cursor.continue();
//         } else {
//             callback(count);
//         }
//     };
// }

// Function readingObjectNameIndex: Reading 100k object names using an index
function readingObjectNameIndex(db, storeName, callback) {
    let transaction = db.transaction(storeName, "readonly");
    let objectStore = transaction.objectStore(storeName);
    let index = objectStore.index("name");
    let count = 0;

    let request = index.openCursor();
    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === "completed") {
                count++;
            }
            cursor.continue();
        } else {
            callback(count);
        }
    };
}

// Function readingObjectNameRT: Reading 100k objects with readonly transaction
function readingObjectNameRT(db, storeName, callback) {
    let transaction = db.transaction(storeName, "readonly");
    let objectStore = transaction.objectStore(storeName);
    let count = 0;
    let request = objectStore.openCursor();
    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === "completed") {
                count++;
            }
            cursor.continue();
        } else {
            callback(count);
        }
    };
}

function measurePerformance() {
    const dbName = "Project1DB";
    const storeName = "TodoList";
    setupIndexedDB(dbName, storeName, function(db) {
        add100kObjects(db, storeName, function() {
            const performanceResults = [];

            // Measure performance of readingCompletedObject
            let start = performance.now();
            readingCompletedObject(db, storeName, function (completedObjects) {
                let end = performance.now();
                performanceResults.push({
                    Operation: "readingObjectNames (Read 100k objects)",
                    TimeTakenMs: (end - start).toFixed(2)
                });
                console.table("Performance for reading completed objects in ms", performanceResults[0].TimeTakenMs);
                // Measure performance of readingObjectNameIndex
                start = performance.now();
                readingObjectNameIndex(db, storeName, function (count) {
                    end = performance.now();
                    performanceResults.push({
                        Operation: "readingObjectNameIndex (Index read 100k objects)",
                        TimeTakenMs: (end - start).toFixed(2)
                    });

                    // Measure performance of readingObjectNameRT
                    start = performance.now();
                    readingObjectNameRT(db, storeName, function (count) {
                        end = performance.now();
                        performanceResults.push({
                            Operation: "readingObjectNameRT (Readonly read 100k objects)",
                            TimeTakenMs: (end - start).toFixed(2)
                        });
                        console.table(performanceResults);

                        let TodoListCompleted = [];
                        todoList
                    });
                });
            });
        });
    });
}

measurePerformance();
