<div align="center">
  
# 🚀 Task Manager App

**A Professional Full-Stack Task Management Application**

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-61DAFB?style=flat-square&logo=react)](https://github.com/yourusername/Syntexhub_TaskManager_App)
[![JWT Auth](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens)](https://github.com/yourusername/Syntexhub_TaskManager_App)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://github.com/yourusername/Syntexhub_TaskManager_App)
[![MySQL](https://img.shields.io/badge/MySQL-Logs-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://github.com/yourusername/Syntexhub_TaskManager_App)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---


# 🎯 About The Project

**TaskFlow Pro** is a professional, enterprise-grade task management application built with the MERN stack. It was developed as part of the **SyntexHub Web Development Internship Program** and demonstrates advanced full-stack development skills including secure authentication, RESTful API design, database management, and modern UI/UX.

The application features a **dual-database architecture** — MongoDB for storing users and tasks, and MySQL for logging all user activities for audit purposes. It includes a **professional split-screen login page**, **dark/light theme toggle**, and a **real-time dashboard** with task statistics.

### 🎥 [Watch the Full Demo on YouTube](https://youtu.be/9K6Z4LHcR-Y)

---

# ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Protected API routes
- Token-based session management
- Input validation & sanitization

### 📋 Task Management
- Create, Read, Update, Delete tasks
- Task status tracking (Pending/In Progress/Completed)
- Priority levels (Low/Medium/High)
- Due date management
- Search & filter functionality

</td>
<td width="50%">

### 🎨 Modern UI/UX
- Split-screen professional login
- Dark/Light theme toggle
- Responsive design (mobile-friendly)
- Animated gradient blobs
- Loading spinners & transitions
- Custom SVG icons

### 🗄️ Dual Database
- MongoDB for user/task data
- MySQL for activity logs
- Real-time dashboard statistics
- Persistent data storage

</td>
</tr>
</table>

---

# Screenshots

<strong>🔐 Login Page (Dark Mode)</strong><br>

 <p align="center"> 
  <img src="Login.png" alt="Login Page" width="300">
</p>


  <strong>📊 Dashboard</strong><br>

  <p align="center">
  <img src="Dashboard.png" alt="Dashboard" width="500">
</p>


  <strong>📋 Task List</strong><br>

  <p align="center">
  <img src="Logs.png" alt="Logs" width="500">
</p>

---

# 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js 18** | UI Library |
| **Vite** | Build Tool |
| **React Router DOM 6** | Client-side Routing |
| **Axios** | HTTP Requests |
| **Context API** | State Management |
| **Custom CSS** | Styling & Theming |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **JWT** | Authentication |
| **Bcrypt.js** | Password Hashing |
| **CORS** | Cross-Origin Requests |
| **Dotenv** | Environment Variables |

### Databases
| Technology | Purpose |
|-----------|---------|
| **MongoDB** | User & Task Data |
| **MySQL** | Activity Logs |

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React + Vite)                                     │                                    
│ http://localhost:5173                                       │
│                                                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │   Login  │ │  Signup  │ │Dashboard│  │Task Mgmt │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└──────────────────────────┬──────────────────────────────────┘
│
Axios HTTP Requests
│
▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Node + Express)                                    │
│ http://localhost:5000                                       │
│                                                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ /auth    │ │ /tasks   │ │ JWT      │ │ Bcrypt   │         │
│ │ Routes   │ │ Routes   │ │ Auth     │ │ Hash     │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└──────────────┬───────────────────────────┬──────────────────┘
│ │
▼ ▼
┌──────────────────┐ ┌──────────────────┐
│ MongoDB          │ │ MySQL            │
│ (User & Tasks)   │ │ (Activity Logs)  │
└──────────────────┘ └──────────────────┘

```

---

# 🚀 Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)) — [Download](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** — [Download](https://www.mongodb.com/products/compass)
- **XAMPP** (for MySQL) — [Download](https://www.apachefriends.org/)
- **Git** — [Download](https://git-scm.com/)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Syntexhub_TaskManager_App.git
cd Syntexhub_TaskManager_App
```

2. Setup Backend
```bash
cd backend
npm install
```

Create a .env file in the backend folder:
```
env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=taskflow_logs
```

3. Setup Frontend
```bash
cd ../frontend
npm install
```

4. Setup MySQL Database
```
1. Open XAMPP Control Panel
2. Start Apache and MySQL
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create a new database named taskflow_logs
```
   
5. Setup MongoDB
```
Start MongoDB Compass
Connect to mongodb://localhost:27017
Create a new database named taskflow
```
6. Running the Application
   
A. Terminal 1 — Start MongoDB:
```bash
mongod --dbpath "C:\data\db"
```
B. Terminal 2 — Start MySQL:

```text
Open XAMPP Control Panel → Start MySQL
```
C. Terminal 3 — Start Backend:
```bash
cd backend
npm run dev
```
D. Terminal 4 — Start Frontend:
```bash
cd frontend
npm run dev
```
7. Open your browser:
```text
http://localhost:5173
```
---

# 💻 Usage

### 1. Register a New Account
   
Navigate to /register and create a new account with your name, email, and password.

### 2. Login
   
Use your credentials on /login to sign in. You'll be redirected to the Dashboard.

### 3. Create Tasks
   
. Click "+ New Task" to create a task with:

. Title (required)

. Description

. Status: Pending / In Progress / Completed

. Priority: Low / Medium / High

. Due Date

### 4. Manage Tasks

. View all tasks → Sidebar → "All Tasks"

. Filter tasks → By status (Pending, In Progress, Completed)

. Search tasks → Search bar on the task list page

. Edit task → Click "Edit" on any task

. Delete task → Click "Delete" and confirm

### 5. Toggle Theme

Click the 🌙/☀️ button in the top-right corner to switch between dark and light modes.

---

# 🔌 API Endpoints

```markdown
## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login with credentials | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### Tasks

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for user | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update a task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ |
```
---

## Example Request
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Tasks (with token)
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
---

# 📁 Project Structure

```text
Syntexhub_TaskManager_App/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── mysql.js              # MySQL connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── taskController.js     # Task logic
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── auth.js               # /api/auth routes
│   │   └── tasks.js              # /api/tasks routes
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx         # Split-screen login
│   │   │   ├── Register.jsx      # Registration form
│   │   │   ├── Dashboard.jsx     # Stats dashboard
│   │   │   ├── TaskList.jsx      # Task list view
│   │   │   ├── TaskForm.jsx      # Create/Edit form
│   │   │   ├── Sidebar.jsx       # Navigation
│   │   │   └── ThemeToggle.jsx   # Dark/Light toggle
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state
│   │   ├── styles/
│   │   │   ├── App.css           # Main styles
│   │   │   ├── auth.css          # Auth pages styles
│   │   │   ├── theme.css         # Theme variables
│   │   │   └── dashboard.css     # Dashboard styles
│   │   ├── App.jsx               # Routes
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── init.sql                  # MySQL init script
│
├── .gitignore
├── README.md
└── start-all.bat                 # One-click launcher
```
---
# 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are greatly appreciated.

1. Fork the Project

2. Create your Feature Branch (git checkout -b feature/AmazingFeature)

3. Commit your Changes (git commit -m 'Add some AmazingFeature')

4. Push to the Branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

# 📄 License

Distributed under the MIT License. See LICENSE for more information.

# 📬 Contact

Your Name — https://www.linkedin.com/in/warshia-rubab-3191b039b/

Project Link — https://github.com/warshia-rubab/Syntexhub_TaskManager_App

Demo Video — https://youtu.be/9K6Z4LHcR-Y

---

# 🙏 Acknowledgments

1. SyntexHub — For the internship opportunity

2. React — Frontend library

3. Node.js — Backend runtime

4. MongoDB — Database

5. MongoDB Compass — GUI for MongoDB

6. Shields.io — For the badges

7. Best-README-Template — For the template inspiration

---

<div align="center">
⭐ If you found this project helpful, please give it a star!
  
Built with ❤️ during the SyntexHub Internship Program

</div> 
