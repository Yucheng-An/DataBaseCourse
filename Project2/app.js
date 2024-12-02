async function getData() {
    try {
        const url = "http://127.0.0.1:5000/get_flower_data";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const combinedData = [];

        // Extracting MongoDB data
        data.MongoDB.flowers.forEach(res => {
            const flowerEntry = {
                database: data.MongoDB.database,
                flower: {
                    name: res.name,
                    color: res.color,
                    price: res.price,
                    stock: res.stock,
                    zip_code: res.zip_code
                }
            };
            combinedData.push(flowerEntry);
        });

        // Extracting Neo4J data
        data.Neo4J.relationships.forEach(res => {
            const flowerEntry = {
                database: data.Neo4J.database,
                flower: {
                    name: res.name,
                    color: res.color,
                    price: res.price,
                    stock: res.stock,
                    zip_code: res.zip_code
                }
            };
            combinedData.push(flowerEntry);
        });

        // Extracting Redis data
        Object.entries(data.Redis.inventory).forEach(([flowerName, res]) => {
            const flowerEntry = {
                database: data.Redis.database,
                flower: {
                    name: res.name,
                    color: res.color,
                    price: res.price,
                    stock: res.stock,
                    zip_code: res.zip_code
                }
            };
            combinedData.push(flowerEntry);
        });

        // Extracting SQL data
        data.SQL.flower_sales.forEach(res => {
            const flowerEntry = {
                database: data.SQL.database,
                flower: {
                    name: res.name,
                    color: res.color,
                    price: res.price,
                    stock: res.stock,
                    zip_code: res.zip_code
                }
            };
            combinedData.push(flowerEntry);
        });

        return combinedData;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

(async () => {
    // Retrieve data lake
    const lake = await getData();
    console.log('Lake:', lake);

    // Transform data lake into warehouse by Harsh Bhanushali
    const warehouse = lake.reduce((acc, entry) => {
        const zip = entry.flower?.zip_code;
        if (zip) {
            if (!acc[zip]) {
                acc[zip] = { zipCode: zip, count: 0 };
            }
            acc[zip].count += 1; 
        }
        return acc;
    }, {});
    console.log('Warehouse:', warehouse);
    
    // Data Loading and Display in app.html by Yucheng An
    const zipCode = Object.keys(warehouse);
    const dataCount = Object.values(warehouse).map(item => item.count);
    const content = document.getElementById('barChart').getContext('2d');
    new Chart(content, {
        type: 'bar',
        data: {
            labels: zipCode,
            datasets: [{
                label: 'Count of Flowers by Zip Code',
                data: dataCount,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
    });


})();
