from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulate data from MongoDB
def get_data_from_mongodb():
    return {
        "database": "MongoDB",
        "flowers": [
            {"name": "Rose", "color": "Red", "price": 10, "stock": 100, "zip_code": "10001"},
            {"name": "Tulip", "color": "Yellow", "price": 7, "stock": 150, "zip_code": "10002"},
            {"name": "Orchid", "color": "Purple", "price": 15, "stock": 80, "zip_code": "10003"},
            {"name": "Sunflower", "color": "Yellow", "price": 5, "stock": 200, "zip_code": "10004"},
            {"name": "Daisy", "color": "White", "price": 3, "stock": 300, "zip_code": "10005"}
        ]
    }

# Simulate data from Neo4J
def get_data_from_neo4j():
    return {
        "database": "Neo4J",
        "relationships": [
            {"flower": "Rose", "related_to": "Gift Bouquet", "zip_code": "10001"},
            {"flower": "Tulip", "related_to": "Spring Collection", "zip_code": "10002"},
            {"flower": "Orchid", "related_to": "Exotic Collection", "zip_code": "10003"},
            {"flower": "Sunflower", "related_to": "Summer Collection", "zip_code": "10004"},
            {"flower": "Daisy", "related_to": "Wedding Bouquet", "zip_code": "10005"}
        ]
    }

# Simulate data from Redis
def get_data_from_redis():
    return {
        "database": "Redis",
        "inventory": {
            "Rose": {"quantity": 100, "last_restock": "2023-10-01", "zip_code": "10001"},
            "Tulip": {"quantity": 150, "last_restock": "2023-10-03", "zip_code": "10002"},
            "Orchid": {"quantity": 80, "last_restock": "2023-10-05", "zip_code": "10003"},
            "Sunflower": {"quantity": 200, "last_restock": "2023-10-07", "zip_code": "10004"},
            "Daisy": {"quantity": 300, "last_restock": "2023-10-09", "zip_code": "10005"}
        }
    }

# Simulate data from SQL
def get_data_from_sql():
    return {
        "database": "SQL",
        "flower_sales": [
            {"name": "Rose", "units_sold": 50, "revenue": 500, "zip_code": "10001"},
            {"name": "Tulip", "units_sold": 70, "revenue": 490, "zip_code": "10002"},
            {"name": "Orchid", "units_sold": 30, "revenue": 450, "zip_code": "10003"},
            {"name": "Sunflower", "units_sold": 90, "revenue": 450, "zip_code": "10004"},
            {"name": "Daisy", "units_sold": 120, "revenue": 360, "zip_code": "10005"}
        ]
    }

@app.route('/get_flower_data', methods=['GET'])
def get_flower_data():
    # Simulate gathering data from the four sources
    mongo_data = get_data_from_mongodb()
    neo4j_data = get_data_from_neo4j()
    redis_data = get_data_from_redis()
    sql_data = get_data_from_sql()
    
    # Combine the data into a single JSON document
    combined_data = {
        "MongoDB": mongo_data,
        "Neo4J": neo4j_data,
        "Redis": redis_data,
        "SQL": sql_data
    }
    
    return jsonify(combined_data)

if __name__ == '__main__':
    app.run(debug=True)