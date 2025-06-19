from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from dotenv import load_dotenv
import os
from openai import OpenAI

# from models import db, User, Restaurant, MenuItem, AIMessage  # Import AIMessage
from models import db, User, Restaurant, MenuItem, AIMessage, Order, OrderItem

from sqlalchemy import text  

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:8081"])

# Session config for storing chat history
app.secret_key = 'your-super-secret-key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

MANAGER_AI_TOKEN = "secret-manager-ai-token"

# Use external DB URI from environment
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DB_URI")
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/restaurant_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SESSION_COOKIE_SAMESITE'] = "Lax"
app.config['SESSION_COOKIE_SECURE'] = False  # for local dev

db.init_app(app)

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
            "restaurant_id": user.restaurant.id,
            "user_id": user.id
        })
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/menu/add', methods=['POST'])
def add_menu_item():
    data = request.get_json()
    name = data.get("name")
    price = data.get("price")
    category = data.get("category")
    available = data.get("available", True)
    vegan = data.get("vegan", False)
    description = data.get("description", "")
    restaurant_id = data.get("restaurant_id", 1)

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

@app.route('/menu/list', methods=['GET'])
def list_menu_items():
    try:
        items = MenuItem.query.all()
        return jsonify({"success": True, "items": [item.to_dict() for item in items]}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/menu/<int:item_id>/availability', methods=['PUT'])
def update_availability(item_id):
    data = request.get_json()
    available = data.get("available")
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({"success": False, "message": "Item not found"}), 404
    item.available = available
    db.session.commit()
    return jsonify({"success": True, "message": "Availability updated"})

@app.route('/menu/update/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    data = request.get_json()
    try:
        item = MenuItem.query.get(item_id)
        if not item:
            return jsonify({"success": False, "message": "Item not found"}), 404

        if 'available' in data:
            item.available = data['available']
        if 'price' in data:
            item.price = data['price']
        if 'description' in data:
            item.description = data['description']
        if 'vegan' in data:
            item.vegan = data['vegan']

        db.session.commit()
        return jsonify({"success": True, "message": "Item updated", "item": item.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/ai/chat', methods=['POST'])
def chat():
    auth = request.headers.get("Authorization")
    if auth != "Bearer secret-manager-ai-token":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    question = data.get("question")
    user_id = data.get("user_id")

    if not question or not user_id:
        return jsonify({"error": "Missing question or user_id"}), 400

    print(f"\n🔹 Question from user {user_id}: {question}")

    messages = AIMessage.query.filter_by(user_id=user_id).order_by(AIMessage.timestamp).all()

    if not any(m.role == "system" for m in messages):
        print("📥 Injecting menu into system prompt...")
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        menu_items = MenuItem.query.filter_by(restaurant_id=user.restaurant_id).all()
        if not menu_items:
            return jsonify({"error": "No menu items found for this restaurant"}), 404

        formatted_menu = "\n".join([
            f"{item.name} (₹{item.price}) - {item.category} | "
            f"{'Vegan' if item.vegan else 'Non-Vegan'} | "
            f"{'Available' if item.available else 'Unavailable'}\n"
            f"Description: {item.description}"
            for item in menu_items
        ])

        system_msg = AIMessage(
            user_id=user_id,
            role="system",
            content=f"You are a helpful restaurant assistant AI. ONLY use this menu:\n\n{formatted_menu}"
        )
        db.session.add(system_msg)
        db.session.commit()
        messages.insert(0, system_msg)

    user_msg = AIMessage(user_id=user_id, role="user", content=question)
    db.session.add(user_msg)
    db.session.commit()
    messages.append(user_msg)

    message_payload = [{"role": m.role, "content": m.content} for m in messages]

    try:
        print("🚀 Sending to OpenAI...")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=message_payload
        )
        ai_response = response.choices[0].message.content
        print("💬 AI:", ai_response)

        ai_msg = AIMessage(user_id=user_id, role="assistant", content=ai_response)
        db.session.add(ai_msg)
        db.session.commit()

        return jsonify({"answer": ai_response})

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/db/tables')
def list_tables():
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    return jsonify({"tables": tables})

@app.route('/db/preview/<table_name>', methods=['GET'])
def preview_table(table_name):
    try:
        sql = text(f"SELECT * FROM {table_name} LIMIT 10")
        result = db.session.execute(sql)
        rows = [dict(row._mapping) for row in result]  # ✅ FIXED LINE
        return jsonify({"success": True, "rows": rows})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/db/seed-restaurants')
def seed_restaurants():
    try:
        restaurants = [
            {"name": "Pizza Town", "address": "Main St 1"},
            {"name": "Burger Hub", "address": "2nd Avenue"}
        ]

        for r in restaurants:
            restaurant = Restaurant(**r)
            db.session.add(restaurant)
        db.session.commit()

        return jsonify({"success": True, "message": "Restaurants inserted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)})

@app.route('/db/seed-users')
def seed_users():
    try:
        users = [
            {"email": "manager1@pizza.com", "password": "pass123", "role": "manager", "restaurant_id": 1},
            {"email": "waiter1a@pizza.com", "password": "pass123", "role": "waiter", "restaurant_id": 1},
            {"email": "waiter1b@pizza.com", "password": "pass123", "role": "waiter", "restaurant_id": 1},
            {"email": "kitchen1a@pizza.com", "password": "pass123", "role": "kitchen", "restaurant_id": 1},
            {"email": "kitchen1b@pizza.com", "password": "pass123", "role": "kitchen", "restaurant_id": 1},
            {"email": "manager2@burger.com", "password": "pass123", "role": "manager", "restaurant_id": 2},
            {"email": "waiter2a@burger.com", "password": "pass123", "role": "waiter", "restaurant_id": 2},
            {"email": "waiter2b@burger.com", "password": "pass123", "role": "waiter", "restaurant_id": 2},
            {"email": "kitchen2a@burger.com", "password": "pass123", "role": "kitchen", "restaurant_id": 2},
            {"email": "kitchen2b@burger.com", "password": "pass123", "role": "kitchen", "restaurant_id": 2},
        ]

        for u in users:
            user = User(**u)
            db.session.add(user)
        db.session.commit()
        return jsonify({"success": True, "message": "Users inserted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)})

@app.route('/db/seed-menu', methods=['POST'])
def seed_menu():
    try:
        items = [
    {
        "name": "Cheese Burger",
        "price": 7.99,
        "category": "Food",
        "available": True,
        "vegan": False,
        "description": "Grilled beef burger with cheddar cheese",
        "restaurant_id": 2
    },
    {
        "name": "Vegan Salad",
        "price": 5.49,
        "category": "Food",
        "available": True,
        "vegan": True,
        "description": "Fresh garden vegetables with olive oil",
        "restaurant_id": 1
    },
    {
        "name": "Margherita Pizza",
        "price": 9.99,
        "category": "Food",
        "available": True,
        "vegan": False,
        "description": "Classic cheese and tomato pizza",
        "restaurant_id": 1
    },
    {
        "name": "Paneer Tikka",
        "price": 6.99,
        "category": "Food",
        "available": True,
        "vegan": False,
        "description": "Spiced grilled paneer cubes with onions and capsicum",
        "restaurant_id": 1
    },
    {
        "name": "Grilled Chicken Sandwich",
        "price": 5.75,
        "category": "Food",
        "available": True,
        "vegan": False,
        "description": "Tender grilled chicken breast with lettuce and mayo",
        "restaurant_id": 2
    },
    {
        "name": "Falafel Wrap",
        "price": 4.99,
        "category": "Food",
        "available": True,
        "vegan": True,
        "description": "Crispy falafel in pita bread with hummus and veggies",
        "restaurant_id": 2
    }
]

        for item_data in items:
            item = MenuItem(**item_data)
            db.session.add(item)

        db.session.commit()
        return jsonify({"success": True, "message": "Sample menu items added."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)})

@app.route('/order/create', methods=['POST'])
def create_order():
    data = request.get_json()
    print("🚨 Incoming JSON data:", data)  # Add this line to inspect input

    restaurant_id = data.get("restaurant_id")
    user_id = data.get("user_id")
    items = data.get("items")  # [{ menu_item_id: 1, quantity: 2 }, ...]

    if restaurant_id is None:
        return jsonify({"success": False, "message": "Missing restaurant_id"}), 400
    if user_id is None:
        return jsonify({"success": False, "message": "Missing waiter_id"}), 400
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({"success": False, "message": "Items must be a non-empty list"}), 400

    try:
        order = Order(
            restaurant_id=restaurant_id,
            created_by=user_id,
        )
        db.session.add(order)
        db.session.flush()  # to get order.id

        for item in items:
            order_item = OrderItem(
                order_id=order.id,
                menu_item_id=item["menu_item_id"],
                quantity=item["quantity"]
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({"success": True, "order_id": order.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ This line is skipped when run by Gunicorn (Render uses this mode)
if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)




# if __name__ == '__main__':
#     with app.app_context():
#         print("Creating tables...")
#         db.create_all()
#     app.run(host='0.0.0.0', port=5000, debug=True)
