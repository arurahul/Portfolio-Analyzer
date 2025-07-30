🧠 Project Overview
A secure, full-stack portfolio analyzer application inspired by JPMorgan Chase use cases. It implements:

Role-based access control

JWT-secured APIs

Frontend and backend authentication

Confidential financial data display

⚙️ Tech Stack
Layer	Technology
Frontend	React, TypeScript, Axios, React Router
Backend	Flask, Flask-JWT-Extended, SQLAlchemy
Security	JWT Auth, Clearance & Department Claims
Database	SQLite (dev), PostgreSQL (prod-ready)

📁 Project Structure
bash
Copy
Edit
finance-analyzer/
├── backend/
│   ├── models/
│   │   └── user.py
│   ├── routes/
│   │   └── auth.py, portfolio.py
│   ├── extensions.py
│   └── app.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   └── App.tsx
│
├── README.md
└── requirements.txt
✅ Completed Features
🔒 Authentication & Authorization (Day 1-3)
JWT-based login/logout

Secure password hashing (JPMC-style policy)

Claims-based routing: department, clearance

Protected frontend routes via context

🔄 Routing & Session Flow
React routing with protected route guard

Global context to maintain user session

JWT storage in localStorage

📌 Upcoming Features
Feature	ETA
🔗 Portfolio API Integration	Day 4
📊 Financial Data Mocking	Day 5-6
🛠️ System Settings Admin Page	Day 6-7
📈 Charting & Data UI	Day 8-9
🔐 Security Enhancements	Day 10
📦 Deployment Prep	Day 14
🧪 Final Test & Demo	Day 15

🚀 Quick Start
bash
Copy
Edit
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
flask run

# Frontend
cd frontend
npm install
npm run dev