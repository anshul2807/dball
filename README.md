# 🏀 D-BALL LEAGUE 2026 — MERN Stack Event Management Platform

> **"Where Passion Meets Power"**  
> *"Play With Pride. Rise With Purpose."*

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** web application built for the **D-BALL League 2026**, India's fastest-growing collegiate basketball revolution originating from Delhi University. All content, slogans, sponsorship tiers, and executive details are faithfully structured from the official D-BALL 2026 presentation deck.

---

## 🌟 Key Features

### 1. Authentication & Role-Based Access Control (RBAC)
- **Email & Password Authentication** using salted `bcryptjs` hashing and `jsonwebtoken` (JWT).
- Two dedicated roles:
  - `NormalUser` (Players, Team Captains, Collegiate Athletes, Fans)
  - `Admin` (League Directors, Committee Officials, Coordinators)
- Persistent authentication state with auto token attachment via Axios interceptors.
- **1-Click Demo Login** shortcuts provided on the login page for rapid testing.

### 2. Normal User (Player / Team Captain) Experience
- **Upcoming Tournaments Catalog**: Browse season schedules, category filters (Pan-City League, Slam Dunk Contest, 3-Point Battle, Inter-College Championship, Grassroots Camp).
- **Direct Event Registration**:
  - Modal with real-time slot checking (prevents overbooking).
  - Register as a 5v5 / 3v3 collegiate squad or solo skill participant.
  - Squad Roster builder with player names, jersey numbers, and positions (PG, SG, SF, PF, C).
  - Instant generation of an official **E-Ticket Pass** with unique code (e.g. `DBALL-2026-HWK01-1024`), QR pattern, and confetti celebration.
- **Player Dashboard**:
  - View all active registrations and e-passes.
  - Option to cancel registration (automatically restores available capacity on the tournament).
  - Update personal profile, contact number, and college/institution affiliation.

### 3. Admin User Experience
- **Tournament Operations**:
  - Create new tournament events with full details (title, subtitle, rules, prize pool, date, venue, capacity, banner image, status).
  - Edit existing tournaments in real-time.
  - Delete tournaments (with cascading cleanup of registrations).
- **Registered Teams & Players Management**:
  - Searchable and filterable master table of all registered participants.
  - Inspect complete team rosters (names, jersey numbers, positions, contact info).
  - Update registration status (`Confirmed`, `Waitlisted`, `Cancelled`).
  - **1-Click CSV Export**: Download attendance & roster spreadsheet formatted for courtside check-in.
- **Analytics & Key Metrics**: Real-time counter of total events, active registrations, user counts, and colleges represented.

### 4. Website Content (Derived from the Official 20-Slide Deck)
- **The Legacy** (Slide 3): 3 Successful Seasons, 40+ Teams, 25,000+ Live Spectators, 10M+ Digital Reach.
- **The Journey So Far** (Slide 6): Interactive season-by-season timeline (Season 1 2023 DU to Season 5 2027 Pan-India).
- **The Vision & Core Values** (Slide 4): Discipline & Sportsmanship, Teamwork & Integrity, Energy, Entertainment & Inclusivity.
- **The Opportunity** (Slide 5): Fast-paced Gen Z sports adoption, 20M+ urban youth basketball audience.
- **D-BALL 2027 Evolution** (Slide 7): Multi-college knockout + All-Star Weekend, Live commentary, Fan zones & Dunk contests, UGC Creator Zone.
- **For Sponsors & Partnership Tiers** (Slides 8, 15): Title Partner (₹50L), Powered By Partner (₹30L), Associate Partner (₹10L), Digital Partner (₹5L), Team Ownership (₹2L).
- **Basketball For All CSR** (Slide 14): Free basketball coaching sessions and kits for underprivileged kids.
- **Testimonials** (Slide 16): Quotes from Sports Federation, Season 3 Sponsor, and Season 2 Coach.
- **The Team Behind D-Ball** (Slide 17):
  - **Proprietor**: Sunita Sarvaria (Visionary Leader & Sports Promoter)
  - **Founders**: Nitin Verma, Sachin Sharma, Shamshul, Rishab Sarvaria, Pravin Dovan (DU International Basketball Players)
- **Official Contact Details** (Slide 20):
  - Rishab Sarvaria: `9810001399`
  - Shamshul: `9999192193`
  - Emails: `schooldball@gmail.com` | `dballleague@gmail.com`

---

## 🔐 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `schooldball@gmail.com` | `admin123` | Full Admin Console, Event CRUD, Registrations & CSV Export |
| **Admin (Secondary)** | `dballleague@gmail.com` | `admin123` | Full Admin Console |
| **Normal User (Player)** | `player@dball.com` | `player123` | Player Dashboard, Tournament Registration, E-Tickets |

---

## 🛠️ Project Structure

```
DBall/
├── package.json                 # Root script runner (concurrently)
├── server/                      # Backend (Node.js + Express + Mongoose)
│   ├── .env                     # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── server.js                # Express app entry point
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection
│   ├── models/
│   │   ├── User.js              # User schema with roles ['NormalUser', 'Admin']
│   │   ├── Event.js             # Tournament schema with capacity, rules, prize pool
│   │   └── Registration.js      # Registration schema with roster and unique ticket code
│   ├── controllers/
│   │   ├── authController.js    # Register, login, getMe, updateProfile
│   │   ├── eventController.js   # Tournament CRUD & event-specific queries
│   │   ├── registrationController.js # Event registration, player passes, admin status update
│   │   └── statsController.js   # Public and admin dashboard analytics
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification and RBAC guards
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── statsRoutes.js
│   └── scripts/
│       └── seed.js              # Database seed script for initial admin, users, and events
└── client/                      # Frontend (React 18 + Vite + Tailwind CSS)
    ├── index.html
    ├── vite.config.js           # Dev server config with proxy to backend
    ├── tailwind.config.js       # D-BALL brand colors, typography
    └── src/
        ├── App.jsx              # Routes configuration
        ├── main.jsx             # React entry with AuthProvider & BrowserRouter
        ├── index.css            # Tailwind directives & athletic styling
        ├── context/
        │   └── AuthContext.jsx  # Authentication state, login, register, logout
        ├── services/
        │   └── api.js           # Axios instance with JWT interceptors
        ├── components/
        │   ├── Navbar.jsx       # Header navigation with role badges & mobile drawer
        │   ├── Footer.jsx       # Official contacts, founders, slogans, and links
        │   ├── EventCard.jsx    # Tournament card with progress bar and registration CTA
        │   ├── RegistrationModal.jsx # Squad roster builder, form, and e-ticket pass
        │   └── ProtectedRoute.jsx   # Role-based route guardian
        └── pages/
            ├── Home.jsx         # Full 20-slide landing page
            ├── EventsPage.jsx   # Searchable & filterable tournaments list
            ├── EventDetailPage.jsx # Comprehensive event breakdown, rules & registration
            ├── LoginPage.jsx    # Login page with 1-click quick demo buttons
            ├── RegisterPage.jsx # Account creation with role selection
            ├── UserDashboard.jsx # Player passes, ticket codes, roster view, profile settings
            └── AdminDashboard.jsx# Admin Console: Event CRUD, Registrations table, CSV export
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI (already configured in `server/.env`)

### Quick Start
```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install
cd .. && npm install

# 2. Seed database (creates Admin, sample players, and Season 4 events)
npm run seed

# 3. Start development servers (Backend on Port 5001, Frontend on Port 5174/5173)
npm run dev
```

Open your browser at: **`http://localhost:5174`** (or `http://localhost:5173`).
