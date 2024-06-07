
from pymongo.collection import Collection
from pymongo.mongo_client import MongoClient
from threading import Lock

from dependencies.database.file_handler import FileHandler


# Used to obtain mongoDB connection
class Connector:
    DB_NAME = 'database'
    USERS_COLLECTION = 'users'

    FISH_SPECIES_IDENTIFIER_FIELD_NAME = 'species_name'

    _instance = None
    _lock: Lock = Lock()

    """
    Connector's util functions, do not push to master/main change without code review.
    """

    def __new__(cls, mongo_uri=None):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(Connector, cls).__new__(cls)
                if mongo_uri:
                    cls._instance.mongo_uri = mongo_uri
                    cls._instance.client = MongoClient(mongo_uri)
                    try:
                        cls._instance.client.admin.command('ping')
                        print("Pinged your deployment. You successfully connected to MongoDB!")
                    except Exception as e:
                        print(e)
                        print("Failed to connect to MongoDB")
                else:
                    cls._instance.client = None
        return cls._instance

    def __init__(self, mongo_uri=None):
        if mongo_uri is None:
            return

        self.mongo_uri = mongo_uri
        self.client = self.__get_db_session()

        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
            print("Failed to connect to MongoDB")

        self.file_handler = FileHandler(self.get_file_collection())

    def __get_db_session(self):
        self.client = MongoClient(self.mongo_uri)
        return self.client

    def ping(self):
        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
            print("Failed to connect to MongoDB")

    def __get_collection(self, collection_name: str):
        if self.client is None:
            raise Exception("MongoDB client is not initialized. Please provide a valid MongoDB URI.")
        try:
            self.ping()
            return self.client.get_database(self.DB_NAME).get_collection(collection_name)
        except Exception as e:
            print(e)
            print(f'Failed to get database named {collection_name}')
            return None

    def upload_photo(self, photo: bytes, identifier_field_name: str = None, identifier: str = None):
        if not photo:
            return {'error': 'No file provided', 'code': 400}
        elif not identifier_field_name or not identifier:
            return {'error': 'Identifier or it\'s field name not provided', 'code': 400}

        return self.file_handler.upload_photo(photo, identifier_field_name, identifier)

    def get_photo(self, identifier_field_name: str = None, identifier: str = None):
        if not identifier_field_name or not identifier:
            return {'error': 'Identifier or it\'s field name not provided', 'code': 400}

        return self.file_handler.get_file(identifier_field_name, identifier)

    """
    Collection getters
    """

    """
    If you need more collection getters, you can add them here.
    """
    def get_users_collection(self) -> Collection:
        return self.__get_collection("users")

    def get_species_collection(self) -> Collection:
        return self.__get_collection("species")

    def get_file_collection(self) -> Collection:
        return self.__get_collection("file")


    """
    Files functions
    """

    async def upload_species_photo(self, species_name: str, file: bytes):
        """
        Uploads photo of fish species to the database.
        :param species_name:
        :param file:
        :return:
        """
        # Check if fish species with this name exists
        species = self.get_species_collection().find_one({'name': species_name.lower()})
        if not species:
            return {'code': 404, 'message': f'Fish species {species_name.lower()} not found'}

        return self.upload_photo(file, self.FISH_SPECIES_IDENTIFIER_FIELD_NAME, species_name.lower())

    async def get_species_photo(self, species_name: str):
        """
        Retrieves photo of fish species from the database.
        :param species_name:
        :return:
        """
        return self.get_photo(self.FISH_SPECIES_IDENTIFIER_FIELD_NAME, species_name.lower())