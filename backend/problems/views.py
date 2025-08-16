from django.shortcuts import render

# Create your views here.
from django.conf import settings
from pymongo import MongoClient
from django.http import JsonResponse

def test_mongo(request):
    client = MongoClient(settings.MONGO_DB_SETTINGS['HOST'])
    db = client[settings.MONGO_DB_SETTINGS['NAME']]
    collection = db[settings.MONGO_DB_SETTINGS['COLLECTION']]

    # Test insert
    collection.insert_one({"title": "Hello MongoDB!"})

    return JsonResponse({"status": "MongoDB connected and test data inserted!"})
