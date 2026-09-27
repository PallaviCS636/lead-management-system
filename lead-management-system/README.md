# LeadFlow — Lead Management System

A full-stack Lead Management System for a software/digital marketing company, built with the **MERN stack** (MongoDB, Express, React, Node.js).

Built for the Swan Digital Solutions Full Stack Developer technical assignment.

## 🚀 Live Demo - **Frontend:** https://lead-management-system-umber.vercel.app - **Backend API:** https://lead-management-system-pprt.onrender.com - **Demo Login:** admin@demo.com / Demo@1234

---

## ✨ Features

- **Authentication** — JWT-based register/login/logout, hashed passwords (bcrypt), protected API routes and protected frontend routes.
- **Lead Management (CRUD)** — Create, view, edit, delete leads with fields: Name, Email, Phone, Company, Service Interested, Status, Follow-up Date, Notes, Created Date.
- **Dashboard** — Total / New / Contacted / Qualified / Converted / Lost lead counts, a 14-day new-leads bar chart, and a status-breakdown pie chart (Recharts).
- **Search & Filtering** — Search by name/email/phone, filter by status and date range, server-side pagination.
- **Bonus features included** — Admin/Sales roles, CSV export of all leads, lead change history tracking, upcoming follow-up counter.

---

## 🧱 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 (Vite), React Router, Tailwind CSS, Recharts, Axios |
| Backend    | Node.js, Express, express-validator |
| Database   | MongoDB (Mongoose ODM) |
| Auth       | JSON Web Tokens (JWT), bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (database) |

---

## 📁 Project Structure

```
lead-management-system/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── models/                # User, Lead schemas
│   │   ├── middleware/             # auth, validation, error handling
│   │   ├── controllers/            # auth, lead, dashboard logic
│   │   ├── routes/                 # API route definitions
│   │   └── app.js                  # Express app setup
│   ├── server.js                  # entry point
│   ├── seed.js                    # demo data seeder
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axios.js           # configured API client
│   │   ├── context/AuthContext.jsx
│   │   ├── components/             # Sidebar, Layout, LeadFormModal, etc.
│   │   ├── pages/                  # Login, Register, Dashboard, Leads
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works well)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, CLIENT_URL
npm run seed     # optional: creates a demo admin user + 45 sample leads
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env and set VITE_API_URL if different from default
npm run dev      # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | Port the API runs on (default 5000) |
| `CLIENT_URL` | Comma-separated allowed CORS origin(s) |
| `NODE_ENV` | `development` or `production` |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

> No secrets, `.env` files, or credentials are committed to this repository — both `.env.example` files show the required variable names only.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/auth/me` | Private | Get current user |
| POST | `/api/auth/logout` | Private | Logout (client discards token) |

### Leads
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/leads` | Private | List leads — supports `search`, `status`, `dateFrom`, `dateTo`, `page`, `limit` |
| GET | `/api/leads/:id` | Private | Get single lead |
| POST | `/api/leads` | Private | Create lead |
| PUT | `/api/leads/:id` | Private | Update lead |
| DELETE | `/api/leads/:id` | Private | Delete lead |
| GET | `/api/leads/export/csv` | Private | Export all leads as CSV |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Private | Status counts, 14-day trend, upcoming follow-ups |

All private routes require an `Authorization: Bearer <token>` header. Validation errors return `400` with a field-level error list; auth failures return `401`; missing resources `404`; duplicate emails `409`; server errors `500`.

---

## 🗄️ Database Design

**User**: `name, email (unique), password (hashed, select:false), role [admin|sales], timestamps`

**Lead**: `name, email, phone, company, serviceInterested, status [New|Contacted|Qualified|Converted|Lost], followUpDate, notes, owner (ref User), history[] (field/oldValue/newValue/changedAt), createdDate, updatedAt`

A text index on `name/email/phone` supports the search feature; `status` and `createdDate` are used directly in filter queries.

---

## ☁️ Deployment Guide

### 1. Database — MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from anywhere (`0.0.0.0/0`) for simplicity, or Render's IPs.
3. Copy the connection string into `MONGO_URI`.

### 2. Backend — Render
1. Push this repo to GitHub.
2. On [render.com](https://render.com), create a **New Web Service**, connect the repo, set root directory to `backend`.
3. Build command: `npm install` — Start command: `npm start`.
4. Add environment variables from `backend/.env.example` (with real values) in Render's dashboard.
5. Deploy. Note the live URL (e.g. `https://your-app.onrender.com`).

### 3. Frontend — Vercel
1. On [vercel.com](https://vercel.com), import the repo, set root directory to `frontend`.
2. Framework preset: **Vite**.
3. Add environment variable `VITE_API_URL` = `https://your-app.onrender.com/api`.
4. Deploy. Update `CLIENT_URL` on Render to the resulting Vercel URL and redeploy the backend so CORS allows it.

### 4. Seed demo data (optional, run once against production DB)
```bash
MONGO_URI="<your atlas uri>" node backend/seed.js
```

---

## 🔐 Demo Credentials

After running `npm run seed`:

```
Email:    admin@demo.com
Password: Demo@1234
```

---

## 🐳 Optional: Docker

A `docker-compose.yml` is included for running MongoDB + backend + frontend locally with one command:

```bash
docker compose up --build
```

---

## ✅ Design Decisions

- **JWT over sessions** — stateless, simple to scale across a separate frontend/backend deployment.
- **Mongoose over raw driver** — schema validation, hooks (password hashing), and cleaner query building for the aggregation-heavy dashboard stats.
- **Server-side search/filter/pagination** — keeps the frontend fast regardless of dataset size, matches how a production lead table would behave.
- **Lead history array** — a lightweight built-in audit trail (bonus: "lead activity/history") without a separate collection.
- **Tailwind CSS** — fast to build a polished, responsive, consistently-themed UI without a heavy component library.

---

## 🙋 Author Notes

This project was scaffolded with AI assistance (as explicitly permitted by the assignment) but every architectural decision, schema design, and code path was reviewed and can be explained/defended by the candidate during evaluation.
