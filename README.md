# 🌾 Agri-Smart Connect

A smart agriculture platform connecting Farmers and Buyers.

---

## 🚀 Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at: http://localhost:5000

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 👤 Roles

| Role    | Registration | How to get access         |
|---------|-------------|---------------------------|
| Farmer  | ✅ Self-register via /signup | Fill farm details |
| Buyer   | ✅ Self-register via /signup | Fill company details |
| Admin   | ❌ No self-registration | Manually set in MongoDB   |

### How to create an Admin user in MongoDB:
1. Register a normal user (Farmer/Buyer) via /signup
2. Open MongoDB Compass or Mongo shell
3. Find the user in the `users` collection
4. Change the `role` field from `"farmer"` to `"admin"`
5. Save — they can now log in as Admin

---

## 📁 Project Structure

```
agri-smart-connect/
├── frontend/               ← React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SignUp.jsx
│   │   │   └── SignIn.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── backend/                ← Node.js + Express + MongoDB
    ├── models/User.js
    ├── routes/auth.js
    ├── middleware/auth.js
    ├── server.js
    └── .env
```

---

## 🔐 API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | /api/auth/signup   | Register Farmer or Buyer |
| POST   | /api/auth/signin   | Login (all roles)        |
| GET    | /api/auth/me       | Get current user (auth)  |
