# CollegeFinder – College Search & Comparison Portal

A full-stack web application designed to help students search, filter, compare colleges, view courses, fees, placement statistics, submit reviews, and save favorites. It also provides an admin dashboard to manage colleges, courses, placements, and reviews.

---

## 📁 Directory Structure & Responsibilities

```text
CollegeFinder/
│
├── frontend/             # React + Vite Client Application
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar, Footer, Cards, Modal, Filters)
│   │   ├── pages/        # Top-level page views (Home, CollegeDetails, Compare, Login, AdminDashboard)
│   │   ├── services/     # API integration modules (Axios/fetch calls to backend endpoints)
│   │   ├── context/      # React Context providers (AuthContext, FavoritesContext, ThemeContext)
│   │   ├── hooks/        # Custom React hooks (useAuth, useFetch, useDebounce)
│   │   ├── assets/       # Static assets (images, icons, global styles, logos)
│   │   ├── App.jsx       # Main application layout and route declarations
│   │   ├── index.css     # Global styling & CSS variable definitions
│   │   └── main.jsx      # Entry point mounting React DOM root
│   ├── package.json      # Frontend npm dependencies and scripts
│   └── vite.config.js    # Vite bundling and development proxy configuration
│
├── backend/              # Python Flask REST API Service
│   ├── app/              # Application core code
│   │   ├── routes/       # API Blueprint endpoints (auth, colleges, courses, reviews, admin)
│   │   ├── models/       # Database models and query interfaces
│   │   ├── services/     # Business logic layer isolating database queries from controllers
│   │   ├── utils/        # Utility helpers (validators, JWT tokens, response formatters)
│   │   └── __init__.py   # Flask application factory setup (CORS, extensions, blueprints)
│   ├── config/           # Application configuration classes (Dev, Prod, Database settings)
│   ├── run.py            # Entry point script to launch Flask development server
│   ├── requirements.txt  # Python packages and dependency requirements
│   └── .env              # Environment variable configurations (DB credentials, Secret Keys)
│
├── database/
│   └── schema.sql        # MySQL database creation script and relational table definitions
│
├── README.md             # Project documentation and directory guide
└── .gitignore            # Git exclusion rules for node_modules, venvs, and secrets
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ and npm
- **Python**: 3.9+
- **MySQL Server**: 8.0+

---

## 🏃 Running the Application Independently

### 1. Frontend Setup (React + Vite)
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend development server will start at `http://localhost:3000`.

### 2. Backend Setup (Flask REST API)
Navigate to the `backend` directory:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
The backend API server will start at `http://localhost:5000`.

---

## 🗄️ Database Setup (MySQL)
Import the schema into your MySQL server:
```bash
mysql -u root -p < database/schema.sql
```
Make sure to configure your database credentials in `backend/.env`.
