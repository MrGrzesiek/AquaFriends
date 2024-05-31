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

#    def __get_img_url(self, file, fileName: str = random.randint(0, 1000)) -> str:
#        randon_uid = str(uuid4())
#        _, f_ext = os.path.splitext(file.filename)
#
#        picture_name = (randon_uid if fileName == None else fileName.lower().replace(' ', '')) + f_ext
#
#        path = os.path.join(self.img_temp_folder)
#        if not os.path.exists(path):
#            os.makedirs(path)
#
#        picture_path = os.path.join(path, picture_name)
#
#        output_size = (125, 125)
#        img = Image.open(file.file)
#
#        img.thumbnail(output_size)
#        img.save(picture_path)
#
#        return f'{self.img_temp_folder}/{picture_name}'
#
#    def __delete_img(self, img_path: str):
#        try:
#            os.remove(img_path)
#        except:
#            pass
#
#
#    def __upload_img_to_db(self, file_collection, img_url: str):
#        try:
#            file_collection.insert_one({'img_url': img_url})
#            return img_url
#        except:
#            return None
#
#
#    def upload_img(self, file_collection, file, fileName: str = None):
#        img_url = self.__get_img_url(file, fileName)
#        return self.__upload_img_to_db(file_collection, img_url)

    async def upload_bson(self, file: UploadFile = File(...)):
        try:
            # Read the contents of the uploaded BSON file
            file_contents = await file.read()

            # Decode BSON to a list of documents
            documents = decode_all(file_contents)

            # Insert the documents into MongoDB collection
            result = self.file_collection.insert_many(documents)

            # Return the inserted IDs
            return JSONResponse(content={"inserted_ids": result.inserted_ids})
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)