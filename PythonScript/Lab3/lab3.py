# import random
# import string
# import uuid
# import pymongo
# from datetime import datetime
# def generateObject():
#     customId = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
#     customLocation = [round(random.uniform(-90.0, 90.0), 6), round(random.uniform(-180.0, 180.0), 6)]
#     statusOptions = ["working", "maintenance", "error"]
#     return {
#         "uuid": str(uuid.uuid4()),
#         "sourceDB": "MongoDB",
#         "createdTime": datetime.now(),
#         "updatedTime": datetime.now(),
#         "sensorID": customId,
#         "sensorLocation": customLocation,
#         "sensorStatus": random.choice(statusOptions)
#     }
# 
# 
# resObjects = [generateObject() for _ in range(1000)]
# lab3Client = pymongo.MongoClient("mongodb+srv://i40:dbms2@cluster0.lixbqmp.mongodb.net/lab3")
# db = lab3Client.lab3
# myCollectionName = "4448"
# collection = db[myCollectionName]
# try:
#     collection.insert_many(resObjects)
#     print("Successfully inserted 1000 objects into MongoDB.")
# except Exception as e:
#     print("An error occurred:", e)


import random
import string
import uuid
import pymongo
from datetime import datetime
def generateObject():
    customId = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    customLocation = [round(random.uniform(-90.0, 90.0), 6), round(random.uniform(-180.0, 180.0), 6)]
    statusOptions = ["working", "maintenance", "error"]
    return {
        "uuid": str(uuid.uuid4()),
        "sourceDB": "MongoDB",
        "createdTime": datetime.now(),
        "updatedTime": datetime.now(),
        "sensorID": customId,
        "sensorLocation": customLocation,
        "sensorStatus": random.choice(statusOptions)
    }

resObjects = [generateObject() for _ in range(1000)]
lab3Client = pymongo.MongoClient("mongodb://localhost:27017/lab3")
db = lab3Client.lab3
myCollectionName = "4449"
collection = db[myCollectionName]
try:
    collection.insert_many(resObjects)
    print("Successfully inserted 1000 objects into MongoDB.")
except Exception as e:
    print("An error occurred:", e)

