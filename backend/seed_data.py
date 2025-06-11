from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Restaurant, MenuItem

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/restaurant_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.drop_all()  # Start clean
    db.create_all()

    # Create 2 restaurants
    rest1 = Restaurant(name="Pizza Town", address="Main St 1")
    rest2 = Restaurant(name="Burger Hub", address="2nd Avenue")
    db.session.add_all([rest1, rest2])
    db.session.commit()

    # Add users for Restaurant 1
    manager1 = User(email="manager1@pizza.com", password="pass123", role="manager", restaurant_id=rest1.id)
    waiter1_1 = User(email="waiter1a@pizza.com", password="pass123", role="waiter", restaurant_id=rest1.id)
    waiter1_2 = User(email="waiter1b@pizza.com", password="pass123", role="waiter", restaurant_id=rest1.id)
    kitchen1_1 = User(email="kitchen1a@pizza.com", password="pass123", role="kitchen", restaurant_id=rest1.id)
    kitchen1_2 = User(email="kitchen1b@pizza.com", password="pass123", role="kitchen", restaurant_id=rest1.id)

    # Add users for Restaurant 2
    manager2 = User(email="manager2@burger.com", password="pass123", role="manager", restaurant_id=rest2.id)
    waiter2_1 = User(email="waiter2a@burger.com", password="pass123", role="waiter", restaurant_id=rest2.id)
    waiter2_2 = User(email="waiter2b@burger.com", password="pass123", role="waiter", restaurant_id=rest2.id)
    kitchen2_1 = User(email="kitchen2a@burger.com", password="pass123", role="kitchen", restaurant_id=rest2.id)
    kitchen2_2 = User(email="kitchen2b@burger.com", password="pass123", role="kitchen", restaurant_id=rest2.id)

    db.session.add_all([
        manager1, waiter1_1, waiter1_2, kitchen1_1, kitchen1_2,
        manager2, waiter2_1, waiter2_2, kitchen2_1, kitchen2_2
    ])
    db.session.commit()

    print("✅ Test data inserted.")
