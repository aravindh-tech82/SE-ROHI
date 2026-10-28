# STUDENTX — Smart Student Management System

> **Smart Student Management with Intelligent Academic Insights**

STUDENTX is a modern, production-style Student Management SaaS platform engineered with a dark Royal Violet aesthetic, glassmorphism, responsive data telemetries, and an interactive 3D WebGL academic hologram.

---

## 🌟 Key Highlights & Unique Features

1. **Student 360° Profile Dossier**: Comprehensive multi-tab profile integrating personal records, enrolled subjects, real-time attendance, continuous assessment grades, assignment audits, and attendance trend graphs.
2. **Early Warning System (EWS)**: Algorithmic detection of students requiring immediate faculty intervention based on attendance deficits (<75%), downward grade trajectories, and overdue assignment backlog.
3. **Smart Student Risk Score (0–100)**:
   - **0–30 (Stable)**: Optimal academic and attendance performance.
   - **31–60 (Needs Attention)**: Borderline turnout or deteriorating test trends.
   - **61–100 (At Risk)**: Automatic priority flag for faculty mentor intervention.
4. **StudentAI Academic Assistant**: Dedicated intelligent query assistant providing instant analytical answers for low attendance, declining marks, and assignment deadlines.
5. **Interactive 3D Academic Hologram**: Lightweight Three.js procedural graduation cap & knowledge crystal hologram with royal violet illumination, gentle floating animation, and mouse reactivity.
6. **Production-Ready Google OAuth 2.0 & JWT Authentication**: Prepared for official Google Cloud OAuth credentials and secure JWT session tokens with role-based access control (Admin, Faculty, Student).
7. **Modular Database Architecture**: Initially powered by `db.json` with an atomic service layer, ready to be hot-swapped for MongoDB or MySQL without altering frontend code.
8. **Nodemailer Integration**: Password reset workflow with email dispatch and local development preview logging.

---

## 🎨 Design Philosophy & Royal Violet Palette

Inspired by the **Royal Violet Gradient** reference:
- **Background Base**: Deep Navy / Black (`#02060E`)
- **Primary Accent**: Royal Violet (`#9303C5`) & Purple (`#A855F7`, `#6B21A8`)
- **Glassmorphism**: Subtle `backdrop-blur-xl`, `rgba(255, 255, 255, 0.03)` surfaces, fine violet borders (`rgba(147, 3, 197, 0.2)`), soft shadows.
- **Visual Restraint**: High visual hierarchy, generous breathing room, clean typography with Inter font, and zero cluttered or congested dashboards.

---

## 🛠 Technology Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Custom Royal Violet theme & Glassmorphism utilities)
- **React Router 7** (Protected role-based routing)
- **Three.js** (Interactive 3D WebGL Hologram)
- **Recharts** (Clean Attendance and Academic trajectory visualizations)
- **Lucide React** (Consistent UI iconography)
- **Axios** (API requests with automatic Bearer token injection)
- **Canvas Confetti** (Delightful assignment completion feedback)

### Backend
- **Node.js** + **Express.js** (ES Modules)
- **JSON Database Engine (`db.json`)**: Modular abstraction service layer
- **JWT (`jsonwebtoken`)**: Stateless secure authentication
- **Bcrypt.js**: Cryptographic password hashing
- **Nodemailer**: Transactional email dispatch for password recovery
- **Google Auth Library**: Real Google OAuth 2.0 and ID token verification

---

## 📁 Project Directory Structure

```text
ROHINI MICRO PROJ/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets (logo.svg, etc.)
│   ├── src/
│   │   ├── assets/             # Gradient backgrounds and reference art
│   │   ├── components/         # Reusable UI & 3D WebGL Canvas
│   │   │   ├── 3d/             # StudentHologramCanvas (Three.js)
│   │   │   └── common/         # Logo, GlassCard, StatusBadge, Modal
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── layouts/            # DashboardLayout, PublicLayout
│   │   ├── pages/              # 11 Dedicated Pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── StudentProfilePage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── AcademicsPage.jsx
│   │   │   ├── AssignmentsPage.jsx
│   │   │   ├── TimetablePage.jsx
│   │   │   ├── AnnouncementsPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── StudentAiPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── routes/             # AppRoutes.jsx with ProtectedRoute
│   │   ├── services/           # api.js (Axios configuration)
│   │   ├── App.jsx             # Main App Component
│   │   ├── index.css           # Tailwind directives & glass classes
│   │   └── main.jsx
│   ├── tailwind.config.js      # Royal Violet theme definition
│   └── vite.config.js          # Vite config with proxy & chunking
│
├── server/                     # Backend Application
│   ├── config/                 # config.js (Environment loader)
│   ├── controllers/            # 10 Controller modules
│   ├── data/                   # db.json & seedData.js (18 Indian students)
│   ├── middleware/             # authMiddleware.js & errorHandler.js
│   ├── routes/                 # Express API routes
│   ├── services/               # dbService, emailService, googleAuthService, mockAiService
│   ├── utils/                  # riskCalculator.js
│   ├── .env.example            # Detailed environment variable template
│   ├── package.json
│   └── server.js               # Main Express entry point
│
└── package.json                # Root package for workspace orchestration
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 1. Clone or Open Project Directory
```bash
cd "c:\Desktop\ROHINI MICRO PROJ"
```

### 2. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

---

## 🚀 Running the Application

### Option A: Running Backend and Frontend in Separate Terminals

#### Terminal 1 (Start Backend Server):
```bash
cd server
npm start
```
*Backend starts on `http://localhost:5000` and automatically populates `server/data/db.json` with 18 realistic student records.*

#### Terminal 2 (Start Frontend Client):
```bash
cd client
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 🔑 Demo Login Accounts

Quick one-click login buttons are provided on the login page for instant testing across all three roles:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@studentx.edu` | `Admin@123` | Full access: Add/Edit/Delete students, log attendance, publish marks, post notices |
| **Faculty** | `faculty.rajesh@studentx.edu` | `Faculty@123` | Log class attendance, input internal assessment scores, create assignments |
| **Student** | `student.arun@studentx.edu` | `Student@123` | Student 360° profile, view attendance, submit assignments, consult StudentAI |

---

## ⚙️ Environment Configuration

Backend environment configuration is stored in `server/.env`. A complete template is provided in `server/.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=studentx_super_secret_jwt_key_2026_royal_violet_9303c5
JWT_EXPIRES_IN=7d

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Nodemailer Credentials
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="STUDENTX" <noreply@studentx.edu>

# Optional Gemini / LLM Key
GEMINI_API_KEY=
```

### How to configure Google OAuth:
1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project called **STUDENTX**.
3. Go to **APIs & Services** > **Credentials**.
4. Create an **OAuth 2.0 Client ID** (Application type: *Web application*).
5. Authorized JavaScript origins: `http://localhost:5173`.
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`.
7. Copy the Client ID and Client Secret into `server/.env`.

### How to configure Nodemailer for Gmail:
1. Go to Google Account > **Security** > **2-Step Verification**.
2. Scroll to **App passwords**.
3. Generate a password for "STUDENTX Mailer".
4. Copy your email and 16-character App Password into `server/.env`.
*(Note: If email credentials are not set, the server runs in safe development mode and outputs the password reset link directly to the server terminal).*

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Email/Password login | No |
| `GET` | `/api/auth/google` | Google OAuth redirection | No |
| `GET` | `/api/auth/google/callback` | Google OAuth callback handler | No |
| `POST` | `/api/auth/forgot-password` | Request password reset token | No |
| `POST` | `/api/auth/reset-password` | Reset password using valid token | No |
| `GET` | `/api/admin/overview` | Admin 3D command map data, KPIs & audit trail | Admin |
| `GET` | `/api/admin/departments` | List all 8 department zones & statistics | Admin / Faculty |
| `GET` | `/api/admin/departments/:id` | Department detailed telemetry & student cohort | Admin |
| `PUT` | `/api/admin/departments/:id` | Update department details & faculty leads | Admin |
| `POST` | `/api/admin/departments` | Create new department zone | Admin |
| `GET` | `/api/admin/faculty` | Institutional faculty staff directory | Admin / Faculty |
| `POST` | `/api/admin/faculty` | Onboard new faculty member | Admin |
| `GET` | `/api/admin/audit-logs` | Immutable institutional audit records | Admin |
| `GET` | `/api/faculty/dashboard` | Faculty teaching workspace, LIVE NOW lecture & tasks | Faculty / Admin |
| `GET` | `/api/faculty/classes` | Faculty assigned courses and cohorts | Faculty |
| `GET` | `/api/student/dashboard` | Student personal academic space, CGPA & metrics | Student / Admin |
| `GET` | `/api/student/performance` | Student trajectory across assessment cycles | Student |
| `GET` | `/api/student/risk-score` | Calculated student risk index (0–100) | Student |
| `GET` | `/api/students` | Get all students with search & filters | Bearer JWT |
| `GET` | `/api/students/:id` | Student 360° profile with full telemetry | Bearer JWT |
| `POST` | `/api/students` | Add new student profile | Admin |
| `PUT` | `/api/students/:id` | Update student profile & recalculate risk | Admin / Faculty |
| `DELETE` | `/api/students/:id` | Remove student record | Admin |
| `GET` | `/api/students/alerts/early-warning` | Fetch active Early Warning alerts | Bearer JWT |
| `GET` | `/api/attendance` | Fetch attendance sheet by date and class | Bearer JWT |
| `POST` | `/api/attendance` | Submit daily attendance & sync risk scores | Admin / Faculty |
| `GET` | `/api/marks` | Academic marks & subject averages | Bearer JWT |
| `POST` | `/api/marks` | Record continuous assessment marks | Admin / Faculty |
| `GET` | `/api/assignments` | List all assignments with due countdowns | Bearer JWT |
| `POST` | `/api/assignments` | Publish new assignment | Admin / Faculty |
| `PATCH` | `/api/assignments/:id/status` | Submit or update assignment status | Bearer JWT |
| `GET` | `/api/announcements` | Institutional circulars by priority | Bearer JWT |
| `POST` | `/api/announcements` | Publish circular & trigger notifications | Admin / Faculty |
| `GET` | `/api/timetable` | Weekly schedule & current class highlight | Bearer JWT |
| `POST` | `/api/ai/query` | StudentAI analytical query processor | Bearer JWT |
| `GET` | `/api/notifications` | User notifications and unread badges | Bearer JWT |
| `GET` | `/api/analytics/dashboard` | Main KPI values and attendance trend | Bearer JWT |
| `GET` | `/api/analytics/detailed` | Grade distribution and department stats | Bearer JWT |

---

## 🎭 Role-Specific Experiences & 3D Command Center

```text
STUDENTX
│
├── ADMIN   → Institutional Command Center (3D Command Map, 8 Department Zones, Live Audit Logs)
├── FACULTY → Teaching Workspace (LIVE NOW Class, Next Lecture, Fast Attendance/Grading, Cohort Mentoring)
└── STUDENT → Personal Academic Space (Student Dossier, CGPA, MY PERFORMANCE Chart, Deadlines & StudentAI)
```

### 1. 🏛️ ADMIN — Institutional Command Center
- **Interactive 3D Institutional Command Map**: Real-time WebGL visualization rendered with Three.js. 8 department nodes (CSE, Cyber Security, AI & DS, IT, ECE, EEE, Mechanical, Civil) orbiting a central Institutional Core with pulsing energy links.
- **Dynamic Raycasting HUD**: Hovering shows department student count, faculty, attendance %, average performance, and at-risk students.
- **Department Detail Slide-In Panel**: Clicking a department displays comprehensive metrics, performance trends, and action buttons (`View Students`, `View Faculty`, `View Analytics`, `Manage Department`).
- **Institutional Telemetry & KPIs**: 6 summary cards (Total Students, Active Faculty, Department Zones, Attendance, Institutional Score, At-Risk Students).
- **Fast Operations Bar**: One-click shortcuts for adding students, onboarding faculty, posting circulars, and managing departments.
- **Benchmark Trajectory**: Recharts comparative analysis across Unit Tests and Model Exams vs institutional benchmarks.
- **Immutable Audit Trail**: Live system events, login attempts, and privileged changes.

### 2. 👨‍🏫 FACULTY — Teaching Workspace
- **Zero 3D Clutter**: Engineered purely as a clean, high-efficiency teaching dashboard.
- **Today's Teaching Banner**: Displays the currently active lecture with a pulsating **LIVE NOW** indicator, time, room, enrolled count, and "Mark Live Attendance" button, plus upcoming lab session.
- **Quick Teaching Actions Strip**: Direct actions for `Take Attendance`, `Enter Marks`, `New Assignment`, `View Schedule`, and `Post Class Notice`.
- **My Classes Cards**: Individual class statistics (semester, section, room, attendance rate, average score, schedule).
- **Cohort Performance & Pending Evaluations**: Urgent tasks list (assignments to evaluate, students needing attention, upcoming exams).
- **Assigned Students Table**: Quick search and direct 360° profile inspection.

### 3. 🎓 STUDENT — Personal Academic Space
- **Student Hero Dossier**: Personal profile banner with student avatar, register number, department, semester, live CGPA badge, and academic standing status.
- **4 Personal Metric Cards**: Personal Attendance (with 75% target threshold), Assignment Completion %, Academic Average, and Calculated Risk Score (0–100).
- **"MY PERFORMANCE" Assessment Trajectory**: Line chart mapping the student's individual scores across Unit Tests and Model Exams alongside the class average.
- **Subject Mastery Cards**: Individual grades, internal marks, and exam score breakdown per registered course.
- **Today's Schedule & Deadlines**: Next lecture info, room, faculty, upcoming assignment countdowns, and exam notifications.
- **StudentAI Floating Assistant**: Slide-out intelligent academic advisor for study advice and grade improvement.

---

## 🏆 Presentation Readiness Checklist

- [x] Complete Royal Violet theme matching `#02060E` base and `#9303C5` highlights.
- [x] Generous breathing space and clean glassmorphic cards.
- [x] Dedicated 3D WebGL floating academic hologram model on Landing Page hero.
- [x] Dedicated 3D WebGL Institutional Command Map on Admin Dashboard.
- [x] 3 Distinct Role Dashboards: Admin Command Center, Faculty Workspace, Student Academic Space.
- [x] Live Role Perspective Switcher for rapid viva & project presentation demo.
- [x] Realistic Indian student data (Rahul Kumar, Priya S, Arun K, Aravindh S, etc.).
- [x] Dedicated Faculty Directory (`/faculty`) and Department Management (`/departments`).
- [x] Immutable Institutional Audit Logs (`/audit-logs`).
- [x] Functional Early Warning System with interactive alerts.
- [x] 8-Tab Student 360° Profile page with rich telemetries.
- [x] Daily attendance register with "Mark All Present" and confirmation modal.
- [x] Continuous assessment marks and Recharts trends.
- [x] Weekly timetable with glowing "Current Class" indicator.
- [x] Interactive StudentAI with structured analytical query engine.
- [x] Fast, zero-error production build (`npm run build` passing cleanly).

