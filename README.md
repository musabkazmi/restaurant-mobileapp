# Restaurant Management App

This is a simple restaurant management system using:

- React Native (Expo) for the frontend
- Flask for the backend

## 📁 Project Structure

restaurant-app/
├── frontend/ # Expo React Native app
├── backend/ # Flask backend API

shell
Copy
Edit

## 🚀 Getting Started

### Frontend Setup (Expo)

```bash
cd frontend
npm install
npx expo start
Backend Setup (Flask)
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install flask
python app.py
🔗 API Connection
The frontend connects to the backend using Axios. Configure the base URL in:

bash
Copy
Edit
frontend/utils/api.js
🧑‍💻 Author
S.M Musab Kazmi