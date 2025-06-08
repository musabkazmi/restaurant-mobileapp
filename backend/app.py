from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React Native frontend

# Dummy credentials (replace with real DB later)
VALID_USER = {
    "email": "admin@example.com",
    "password": "admin123"
}

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email == VALID_USER["email"] and password == VALID_USER["password"]:
        return jsonify({"success": True, "message": "Login successful!"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000,debug=True)
