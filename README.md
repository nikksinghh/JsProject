# 🚀 CRUD-APP — Modern User Management System

A sleek, responsive, and full-stack User Management Application built with **Vanilla JavaScript**, **Modern CSS (Glassmorphism)**, and a **REST API** backend.

---

## ✨ Features

- **⚡ Full CRUD Operations**: Seamlessly **Create**, **Read**, **Update**, and **Delete** user profiles in real-time.
- **🔍 Instant Live Search**: Filter users dynamically by name or email without extra API calls or page reload latency.
- **🔒 Privacy & Security First**: Password fields are masked by default (`••••••••`) with one-click reveal/hide toggles.
- **🎨 Modern Glassmorphic Design**: Clean UI with Google Fonts (*Plus Jakarta Sans*), micro-interactions, responsive navigation, hover effects, and animated loading skeletons.
- **💬 Toast & Confirmation System**: Beautiful non-blocking toast notifications and modal dialogs for critical actions.
- **🌐 Dual Backend Support**: Ready to connect to hosted cloud APIs (Render) and zero-config local JSON Server (`localhost:5000`).

---

## 📁 Project Structure

```
js project/
├── backend/
│   ├── db.json              # Mock database with user records
│   ├── package.json         # Node.js dependencies (json-server, cors, dotenv)
│   └── server.js            # Express & JSON-Server REST API
├── frontend/
│   ├── index.html           # Dashboard & Landing Page
│   ├── index.css            # Centralized CSS design system & utilities
│   ├── pages/
│   │   ├── AllUsers.html    # User directory with live search
│   │   ├── CreateUser.html  # Register new user form
│   │   └── EditUser.html    # Update user details form
│   └── script/
│       ├── api.js           # Shared API client, toasts & modal helpers
│       ├── AllUsers.js      # Directory rendering, filtering & actions
│       ├── CreateUser.js    # Create user logic & client validation
│       └── EditUser.js      # Edit user logic & data hydration
├── .gitignore               # Ignored dependencies & build artifacts
└── README.md                # Project documentation
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- A modern web browser (Chrome, Edge, Firefox, Safari)

### 2. Start the Backend Server

```bash
cd backend
npm install
npm start
```
The REST API server will run on: `http://localhost:5000`

### 3. Open the Frontend

You can open `frontend/index.html` directly in your browser, or use VS Code's **Live Server** extension.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | Retrieve all registered users |
| `GET` | `/users/:id` | Retrieve a specific user by ID |
| `POST` | `/users` | Create a new user record |
| `PUT` | `/users/:id` | Update an existing user record |
| `DELETE` | `/users/:id` | Remove a user record |

---

## 💻 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+)
- **Backend**: Node.js, JSON-Server, CORS, Dotenv
- **Typography**: Google Fonts (*Plus Jakarta Sans*)

---

## 📄 License

This project is licensed under the MIT License.
