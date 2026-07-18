# 💊 MedSync – AI Powered Medication Management System


[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-success?style=for-the-badge)](https://medsync-pink.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge)](https://github.com/devannshi-24/medsync)


MedSync is a full-stack MERN application designed to simplify medication management through intelligent reminders, adherence tracking, and an AI-powered healthcare assistant.

The platform enables users to manage medicines, schedules, dose history, and symptoms while receiving timely medication reminders and personalized assistance through an AI chatbot with persistent conversation memory.

---

# Highlights

- 💊 Medication Management & Scheduling
- 🔔 Smart Medication Reminders using Firebase Cloud Messaging
- 🤖 AI Healthcare Assistant powered by LangGraph & Groq
- 🧠 Persistent AI Conversation Memory
- 📊 Medication Adherence Analytics
- 🔐 Secure Authentication with JWT & Google OAuth
- 📱 Responsive Modern UI with GSAP Animations
- 📈 Interactive Dashboard & Health Insights

---

# Features

## Authentication & Security

- JWT Authentication
- Google OAuth Login
- Email OTP Verification
- Forgot Password via OTP
- Change Password
- Protected Routes
- Secure Password Hashing (bcrypt)
- JWT Bearer Authentication
- Environment-based Configuration

---

## User Profile

- View Profile
- Update Personal Information
- Store:
  - Age
  - Gender
  - Height
  - Weight
  - Allergies
  - Chronic Conditions
- Account Verification Status
- Password / Google Login Detection

---

## Medicine Management

- Add Medicines
- Edit Medicines
- Soft Delete Medicines
- Medicine History
- Active Medicine Tracking

---

## Medication Scheduling

- Multiple Reminder Times
- Daily Schedules
- Weekly Schedules
- Alternate Day Schedules
- Custom Dosage
- Start & End Date Management
- Active / Inactive Schedules

---

## Smart Medication Reminders

- Firebase Cloud Messaging (FCM)
- Browser Push Notifications
- Background Notifications
- Notification Click Support
- Cron-based Reminder Scheduler
- Reminder Snooze
- Automatic Reminder Tracking

---

## Dose Logging

- Mark Dose as:
  - ✅ Taken
  - ❌ Missed
- Complete Dose History
- Automatic Adherence Calculation

---

## Dashboard Analytics

- Total Medicines
- Active Schedules
- Total Doses
- Taken Doses
- Missed Doses
- Medication Adherence Percentage
- Recent Activity
- Personalized Dashboard Overview

---

## Symptom Tracking

- Log Symptoms
- Severity Levels
- Personal Symptom History
- Health Monitoring

---

## AI Health Assistant

Built using **LangGraph**, **LangChain**, and **Groq LLM**.

### Features

- Persistent Conversation Memory
- Thread-based Conversations
- Context-aware Responses
- Healthcare-focused System Prompt
- Safe Medical Guidance
- New Chat Support
- MongoDB Memory Checkpointing
- Tool-ready Architecture

---

## Modern Frontend

- Responsive Design
- GSAP Animations
- Smooth Page Transitions
- Interactive Dashboard
- Card-based UI
- Modern Navigation
- Toast Notifications
- Protected Routing
- Google Sign-In Integration
- Firebase Notification Support

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- GSAP
- React Hot Toast
- React Icons
- Firebase Cloud Messaging
- Google OAuth

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

## Authentication

- JWT
- Google OAuth
- bcrypt
- Brevo Email API
- OTP Verification

---

## AI

- LangGraph
- LangChain
- Groq LLM
- MongoDB Checkpointer
- Thread-scoped Memory

---

## Notifications

- Firebase Cloud Messaging
- Node Cron

---

# 📂 Project Structure

```text
MedSync
│
├── frontend
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   ├── public
│   ├── services
│   ├── utils
│   ├── firebase.js
│   └── App.jsx
│
├── backend
│   ├── ai
│   ├── config
│   ├── controllers
│   ├── jobs
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── index.js
│
└── README.md
```

---

# AI Workflow

```text
User
   │
   ▼
React Chat Interface
   │
   ▼
Express API
   │
   ▼
LangGraph Agent
   │
   ▼
Groq LLM
   │
   ▼
MongoDB Checkpointer
   │
   ▼
Context-Aware Response
```

---

# Reminder Workflow

```text
Medicine Schedule
        │
        ▼
Node Cron
        │
        ▼
Find Due Medicines
        │
        ▼
Firebase Cloud Messaging
        │
        ▼
Browser Notification
        │
        ▼
User Opens MedSync
        │
        ▼
Today's Medicines
        │
        ▼
Taken ✔   Missed ✖   Snooze ⏰
        │
        ▼
DoseLog Updated
        │
        ▼
Dashboard Analytics Updated
```

---

# Database Collections

- Users
- Profiles
- Medicines
- Schedules
- DoseLogs
- Symptoms
- Devices
- OTPs

---

# Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected APIs
- Secure Cookies
- OTP Verification
- OTP Expiration
- Environment Variables
- Google OAuth Authentication
- Role-ready Architecture

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/medsync.git
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Deployment

Frontend
- Vercel

Backend
- Render

Database
- MongoDB Atlas

# Environment Variables

## Backend (.env)

```env
PORT=

MONGO_URI=

JWT_SECRET=

GROQ_API_KEY=
GROQ_MODEL=

GOOGLE_CLIENT_ID=

EMAIL_USER=
EMAIL_PASS=

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

CORS_ORIGIN=
```

---

## Frontend (.env)

```env
VITE_GOOGLE_CLIENT_ID=

VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=

VITE_FIREBASE_VAPID_KEY=
```

---

# 🔮 Future Improvements

- AI Tool Calling for Personalized Healthcare
- Medicine Interaction Detection
- Prescription Upload
- OCR-based Medicine Recognition
- Voice-enabled AI Assistant
- Doctor Dashboard
- Family Medication Management
- Multi-language Support
- Wearable Device Integration

---

# 👩‍💻 Authors

### **Devannshi Jha**

- Backend Development
- Database Design
- Authentication
- AI Integration
- Notification System
- System Architecture

### **Anushka Bhadauria**

- Frontend Development
- UI/UX Design
- React Components
- Dashboard Development
- Responsive Design
- User Experience

---
