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

    def upload_photo(self, photo: bytes, identifier_field_name: str = None, identifier: str = None):
        """
        Uploads a photo to the MongoDB collection
        The photo is stored as bytes in the collection
        The document will look somewhat like this:
        {
            _id: ObjectId,
            photo: photo (Binary.createFromBase64(...)),
            identifier_field_name: identifier
        }

        If a document for given identifier already exists, it will be replaced with the new photo.
        :param photo: bytes
        :param identifier_field_name: str - the field name used to identify the photo's purpose, like species_name
        :param identifier: str - the identifier for the photo, like 'tuna'
        :return: dict
        """
        if not photo:
            return {'error': 'No file provided', 'code': 400}
        elif not identifier_field_name or not identifier:
            return {'error': 'Identifier or it\'s field name not provided', 'code': 400}

        try:
            if self.file_collection.find_one({f'{identifier_field_name}': identifier}):
                self.file_collection.update_one({f'{identifier_field_name}': identifier}, {'$set': {'photo': photo}})
            else:
                self.file_collection.insert_one({'photo': photo, f'{identifier_field_name}': identifier})
        except Exception as e:
            return {'message': 'error inserting documents:' + str(e), 'code': 500}

        return {'message': 'photo uploaded successfully', 'code': 200}


def get_file(identifier_field_name: str = None, identifier: str = None):
    if not identifier_field_name or not identifier:
        return {'error': 'Identifier or it\'s field name not provided', 'code': 400}

    pass