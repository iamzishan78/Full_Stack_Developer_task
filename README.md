# Full Stack Developer Demo

A monorepo showcasing 5 full-stack development tasks demonstrating proficiency in modern web technologies, mobile development, containerization, internationalization, and payment integration.

## Tasks Overview

| Task | Project | Technologies | Description |
|------|---------|--------------|-------------|
| 1 | nextjs-dashboard | Next.js 16, React 19, Tailwind CSS | Live dashboard with real-time stats polling |
| 2 | task2-message-approval | Expo, React Native | Mobile app with approve/reject workflow |
| 3 | task3-docker-stack | Docker Compose, Express, PostgreSQL | Multi-container microservices stack |
| 4 | nextjs-dashboard | next-intl, RTL support | Multi-language support (EN/AR/ES) with RTL |
| 5 | nextjs-dashboard | Stripe API | Payment gateway integration |

## Task Details

### Task 1: Live Dashboard
**Location:** `nextjs-dashboard/`

Real-time dashboard displaying live statistics with automatic polling.

**Features:**
- Live stats display with 10-second auto-refresh
- RESTful API endpoint (`/api/stats`)
- Responsive design with Tailwind CSS
- Server and client component architecture

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

---

### Task 2: Mobile Approve/Reject App
**Location:** `task2-message-approval/`

Cross-platform mobile application for message approval workflows.

**Features:**
- Pending messages queue with approve/reject actions
- Handled messages history
- Clean card-based UI
- State management for workflow transitions

**Tech Stack:** Expo 55, React Native 0.83, TypeScript

---

### Task 3: Docker Compose Stack
**Location:** `task3-docker-stack/`

Containerized microservices architecture with three interconnected services.

**Services:**
- **nextjs-app** (Port 3000) - Frontend application
- **express-api** (Port 4000) - TypeScript REST API with auto-schema initialization
- **postgres** (Port 5432) - PostgreSQL 16 database with healthchecks

**Features:**
- Service health checks and dependency ordering
- Persistent data volumes
- Bridge networking between containers
- Environment-based configuration

**Tech Stack:** Docker Compose, Next.js, Express, PostgreSQL 16, TypeScript

---

### Task 4: Multi-Language Support with RTL
**Location:** `nextjs-dashboard/`

Internationalization implementation with right-to-left (RTL) language support.

**Features:**
- Three languages: English, Arabic (RTL), Spanish
- Locale-based routing (`/en`, `/ar`, `/es`)
- Language preference persistence
- Automatic RTL layout switching for Arabic
- Middleware-based locale detection

**Tech Stack:** next-intl, Next.js Middleware

---

### Task 5: Stripe Payment Integration
**Location:** `nextjs-dashboard/`

Complete billing system with Stripe payment processing.

**Features:**
- Real-time billing dashboard
- Stripe Checkout integration
- Plan selection and payment flow
- API routes for payment processing (`/api/billing/*`)

**Tech Stack:** Stripe API, @stripe/stripe-js

---

## Quick Start

### Task 1, 4, 5 - Next.js Dashboard
```bash
cd nextjs-dashboard
npm install
npm run dev
# Open http://localhost:3000
```

### Task 2 - Mobile App
```bash
cd task2-message-approval
npm install
npm run start
# Press 'w' for web, 'i' for iOS, 'a' for Android
```

### Task 3 - Docker Stack
```bash
cd task3-docker-stack
docker compose up --build
# Frontend: http://localhost:3000
# API: http://localhost:4000
```

## Project Structure

```
Full_Stack_Developer_task/
├── nextjs-dashboard/          # Tasks 1, 4, 5
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes
│   │   ├── api/               # API routes (stats, billing)
│   │   └── components/        # React components
│   ├── i18n/                  # i18n configuration
│   └── messages/              # Translation files (en, ar, es)
│
├── task2-message-approval/    # Task 2
│   ├── App.tsx                # Main app entry
│   ├── components/            # UI components
│   ├── services/              # API services
│   └── types/                 # TypeScript types
│
└── task3-docker-stack/        # Task 3
    ├── docker-compose.yml     # Service orchestration
    ├── nextjs-app/            # Frontend container
    ├── express-api/           # Backend container
    └── .env                   # Environment config
```

## Environment Variables

### nextjs-dashboard
Stripe keys required for Task 5 billing features:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### task3-docker-stack
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskdb
API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```
