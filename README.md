# Portfolio App

A modern portfolio management system built with Laravel 12 and Next.js 15.

## Project Structure

- `backend/`: Laravel 12 API
- `frontend/`: Next.js 15 App (React 19)

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- pnpm (or npm/yarn)

### Setup

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   composer install
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate --seed
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   cp .env.example .env
   pnpm install
   ```

### Development

To start both the Laravel backend and the Next.js frontend concurrently:

```bash
cd backend
composer run dev
```

The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

## Features

- [x] Full-stack decoupled architecture
- [x] Unified development workflow
- [x] Authentication with Laravel Sanctum
- [x] User onboarding flow
- [x] Portfolio and Project management
- [x] Responsive design with Tailwind CSS
