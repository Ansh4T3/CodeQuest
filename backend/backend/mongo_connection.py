from pymongo import MongoClient

# Your MongoDB Compass connection string
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "CodeQuest"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
