# Vivid Tasks - Premium Task Manager

A premium, responsive, full-stack task management application designed with a **FastAPI** backend and a **Next.js 16 (React 19)** frontend, utilizing **SQLAlchemy** for database operations and **Tailwind CSS v4** for clean UI design.

---

## 🚀 Key Features

* **Full CRUD Operations**: Create, view, update status/details, and delete tasks.
* **JWT Authentication**: Secure user registration and login utilizing the OAuth2 Password Bearer flow with password hashing (`passlib/pbkdf2`).
* **Fuzzy Search**: Typo-tolerant fuzzy searching in the dashboard using **Fuse.js**.
* **Task Sorting & Filtering**: Sort tasks by due date, priority, or creation date, and filter by status (All, Pending, In Progress, Completed).
* **Dual Theming (Dark/Light)**: Persisted system/user dark & light theme modes built with CSS variables.
* **Premium UX/UI**: Designed with modern typography (Inter), glassmorphism cards, micro-animations, and timezone-agnostic due-date status indicators (overdue, due today, completed).
* **CI/CD Integrated**: Configured with automated GitHub Actions testing and builds, deploying automatically to **Render** (backend) and **Vercel** (frontend).

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: Next.js 16 (App Router)
* **Styling**: Tailwind CSS v4, Vanilla CSS variables
* **Search**: Fuse.js (Client-side fuzzy matching)
* **Language**: TypeScript

### Backend
* **Framework**: FastAPI (Python)
* **ORM**: SQLAlchemy
* **Database**: PostgreSQL (Production/Supabase) | SQLite (Local development & testing)
* **Auth**: Python-Jose (JWT), Passlib (PBKDF2 hashing)
* **Testing**: Pytest

---

## 📁 Project Structure

```text
task_manager/
├── .github/workflows/   # CI/CD Workflows (GitHub Actions)
├── backend/             # FastAPI Application
│   ├── app/             # Application source (routers, database, models, auth)
│   ├── tests/           # Unit & integration tests
│   └── requirements.txt # Python dependencies
├── frontend/            # Next.js Application
│   ├── app/             # Page routes & layout
│   ├── components/      # Reusable React components
│   ├── context/         # Auth & Theme context providers
│   ├── utils/           # Client-side API wrapper
│   └── package.json     # Node dependencies
└── README.md            # Root Documentation
```

---

## 💻 Local Development Setup

### Prerequisites
* **Python**: 3.11.x
* **Node.js**: 20.x or higher
* **Git**

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   * **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **Mac/Linux**:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the project root:
   ```env
   DATABASE_URL=sqlite:///./dev.db
   JWT_SECRET_KEY=your-super-secret-key
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be running at [http://localhost:8000](http://localhost:8000).

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Running Tests

The project includes unit and API tests for the backend. The tests automatically switch to a temporary in-memory SQLite database to run isolated assertions.

To run the backend test suite:
1. Navigate to the `backend` directory.
2. Run pytest:
   ```bash
   pytest
   ```
