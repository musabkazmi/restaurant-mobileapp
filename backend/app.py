from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from models import db, User, Restaurant, MenuItem  # Import your models

app = Flask(__name__)
CORS(app)  # Allow access from React Native Expo

# ⬇️ Replace with your own MySQL connection details
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/restaurant_db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init DB
db.init_app(app)

# 🔐 Dummy login for testing (replace with DB check later)
VALID_USER = {
    "email": "admin@example.com",
    "password": "admin123",
    "role": "manager"
}

@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, password=password).first()

    if user:
        return jsonify({
            "success": True,
            "role": user.role,
            "restaurant": user.restaurant.name,
            "restaurant_id": user.restaurant.id
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

@app.route('/menu/add', methods=['POST'])
def add_menu_item():
    data = request.get_json()

    # Validate required fields
    name = data.get("name")
    price = data.get("price")
    category = data.get("category")
    available = data.get("available", True)
    vegan = data.get("vegan", False)
    description = data.get("description", "")
    restaurant_id = data.get("restaurant_id", 1)  # Placeholder (adjust later with auth)

    if not all([name, price, category]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    try:
        item = MenuItem(
            name=name,
            price=price,
            category=category,
            available=available,
            vegan=vegan,
            description=description,
            restaurant_id=restaurant_id
        )
        db.session.add(item)
        db.session.commit()

        return jsonify({"success": True, "message": "Item added", "item_id": item.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)