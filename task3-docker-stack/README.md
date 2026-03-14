# Task 3: Docker Compose Multi-Service Stack

A containerized multi-service application with Next.js frontend, Express API backend, and PostgreSQL database.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │  Next.js    │    │  Express    │    │   PostgreSQL    │ │
│  │  Frontend   │───▶│    API      │───▶│    Database     │ │
│  │  :3000      │    │   :4000     │    │     :5432       │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Services

| Service      | Port | Description                          |
|--------------|------|--------------------------------------|
| nextjs-app   | 3000 | Next.js frontend with live dashboard |
| express-api  | 4000 | Express TypeScript API server        |
| postgres     | 5432 | PostgreSQL 16 database               |

## Quick Start

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Build and start all services**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:4000/health
   - API Stats: http://localhost:4000/api/stats

## API Endpoints

| Method | Endpoint     | Description                    |
|--------|--------------|--------------------------------|
| GET    | /health      | Health check                   |
| GET    | /api/stats   | Get live statistics            |
| GET    | /api/data    | Get all data from database     |
| POST   | /api/data    | Insert new data record         |

## Environment Variables

| Variable            | Default    | Description                    |
|---------------------|------------|--------------------------------|
| POSTGRES_USER       | postgres   | PostgreSQL username            |
| POSTGRES_PASSWORD   | postgres   | PostgreSQL password            |
| POSTGRES_DB         | taskdb     | PostgreSQL database name       |
| API_PORT            | 4000       | Express API port               |
| NEXT_PUBLIC_API_URL | http://localhost:4000 | API URL for frontend |

## Commands

```bash
# Start all services
docker compose up

# Start in detached mode
docker compose up -d

# Rebuild and start
docker compose up --build

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f express-api
```

## Project Structure

```
task3-docker-stack/
├── docker-compose.yml          # Main orchestration file
├── .env.example                # Environment template
├── README.md                   # This file
├── nextjs-app/
│   ├── Dockerfile             # Multi-stage Next.js build
│   ├── .dockerignore
│   ├── app/                   # Next.js app directory
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   └── CounterCard.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── package.json
└── express-api/
    ├── Dockerfile             # Multi-stage Express build
    ├── src/
    │   └── index.ts           # API server with PostgreSQL
    ├── package.json
    └── tsconfig.json
```

## Health Checks

- **PostgreSQL**: Uses `pg_isready` to verify database readiness
- **Express API**: `/health` endpoint returns `{ status: "ok" }`
- **Service Dependencies**: Express waits for PostgreSQL health, Next.js waits for Express

## Troubleshooting

**Database connection issues**
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Verify database is ready
docker compose exec postgres pg_isready -U postgres
```

**API not responding**
```bash
# Check API logs
docker compose logs express-api

# Test health endpoint
curl http://localhost:4000/health
```

**Frontend not loading**
```bash
# Check Next.js logs
docker compose logs nextjs-app

# Verify API URL is correct
echo $NEXT_PUBLIC_API_URL
```
