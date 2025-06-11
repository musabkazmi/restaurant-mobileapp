from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Restaurant, MenuItem

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/restaurant_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    print("❌ Dropping tables...")
    db.drop_all()
    print("✅ Tables dropped.")
