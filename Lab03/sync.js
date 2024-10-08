async function indexDBExport() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('IndexDB', 1);
        request.onsuccess = async (event) => {
            const db = event.target.result;
            const transaction = db.transaction('Sensor', 'readonly');
            const objectStore = transaction.objectStore('Sensor');
            const allIndexDBData = objectStore.getAll();
            allIndexDBData.onsuccess = function () {
                const data = allIndexDBData.result;
                const jsonData = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonData], { type: "application/json" });
                const temp1 = document.createElement("a");
                temp1.href = URL.createObjectURL(blob);
                temp1.download = "browserIndexDBSensors.json";
                document.body.appendChild(temp1);
                temp1.click();
                document.body.removeChild(temp1);
                resolve();
            };
            allIndexDBData.onerror = function () {
                reject('Failed to retrieve data from IndexedDB.');
            };
        };
        request.onerror = function (event) {
            reject('Error opening IndexedDB: ' + event.target.errorCode);
        };
    });
}

indexDBExport().then(() => {