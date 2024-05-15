from app import app, users_db, logs_db
from flask import request, jsonify
import flask_login as fl
from bson.objectid import ObjectId
import re  # regex

# login part
login_manager = fl.LoginManager()
login_manager.init_app(app)
logged_users = set()

# user class
class User(fl.UserMixin):
    def __init__(self, name) -> None:
        super().__init__()
        self.id = name


# @login_manager.user_loader
# def load_user(id):
#     id = ObjectId(str(id))
#     for user in logged_users:
#         if user.id == id:
#             return user
#     return None

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# Ensure cookies are set properly for session management
@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.route("/login", methods=["POST"])
def login():
    name = request.form["name"]
    password = request.form["password"]
    x = users_db.find_one({"name": name})
    if not x:
        return jsonify({"message": "Incorrect password or login", "code": 401}) # User does not exist
    if password == x["password"]:
        user = User(x["_id"])
        fl.login_user(user)
        logged_users.add(user)
        return "Success", 200
    return jsonify({"message": "Incorrect password or login", "code": 418})


@app.route("/register", methods=["POST"])
def register():
    email = request.form["email"]
    name = request.form["name"]
    password = request.form["password"]

    if users_db.find_one({"name": name}) != None:
        return jsonify(
            {"message": "This nickname is already in use", "code": 418}
        )
    if not re.fullmatch(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", email
    ):
        return jsonify(
            {"message": "This is not a proper email addess", "code": 418}
        )
    if users_db.find_one({"email": email}) != None:
        return jsonify({"message": "This email is already in use", "code": 418})

    users_db.insert_one(
        {
            "email": email,
            "name": name,
            "password": password,
            "admin": False,
            "aquarium": [],
            "logs_id": ObjectId(),
        }
    )
    x = users_db.find_one({"name": name})
    logs_db.insert_one({"_id": x["logs_id"]})
    user = User(x["_id"])
    fl.login_user(user)
    logged_users.add(user)
    return "Success", 200


@app.route("/logout", methods=["POST"])
@fl.login_required
def logout():
    logged_users.remove(fl.current_user)
    fl.logout_user()
    return "Success", 200
