import os
from uuid import uuid4
from PIL import Image
import random

from bson import decode_all
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
from pymongo.collection import Collection

class FileHandler:

    def __init__(self, file_collection: Collection):
        self.file_collection = file_collection


    def upload_photo(self, photo: bytes):
        documents = None
        if not photo:
            return {'error': 'No file provided', 'code': 400}

        try:
            # Decode BSON to a list of documents
            # documents = decode_all(photo)
            try:
                # Insert the documents into MongoDB collection
                # Photo is of type bytes
                result = self.file_collection.insert_one({'photo': photo})
            except Exception as e:
                return {'message': 'error inserting documents:' + str(e), 'code': 500}
        except Exception as e:
            return {'message': "error decoding BSON file:" + str(e), 'code': 500}

        return {'message': 'photo uploaded successfully', 'code': 200}