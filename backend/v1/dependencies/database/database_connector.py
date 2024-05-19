from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from threading import Lock

# Used to obtain mongoDB connection
class Connector:
    """
    This is a thread-safe implementation of Singleton.
    """

    _instances = {}

    _lock: Lock = Lock()
    """
    We now have a lock object that will be used to synchronize threads during
    first access to the Singleton.
    """

    def __call__(cls, *args, **kwargs):
        """
        Possible changes to the value of the `__init__` argument do not affect
        the returned instance.
        """
        # Now, imagine that the program has just been launched. Since there's no
        # Singleton instance yet, multiple threads can simultaneously pass the
        # previous conditional and reach this point almost at the same time. The
        # first of them will acquire lock and will proceed further, while the
        # rest will wait here.
        with cls._lock:
            # The first thread to acquire the lock, reaches this conditional,
            # goes inside and creates the Singleton instance. Once it leaves the
            # lock block, a thread that might have been waiting for the lock
            # release may then enter this section. But since the Singleton field
            # is already initialized, the thread won't create a new object.
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
        return cls._instances[cls]
    # get mongo_api from app
    instance = None

    def __init__(self, mongo_uri):
        self.mongo_uri = mongo_uri
        self.client = self.__get_db_session()
        self.db = None

        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
            print("Failed to connect to MongoDB")


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

    def get_db(self, db_name):
        return self.client[db_name]

    def close(self):
        self.client.close()

    def __del__(self):
        self.close()