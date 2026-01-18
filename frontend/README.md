# Portfolio App - Frontend

This is the Next.js frontend for the Portfolio App. It communicates with a Laravel API backend.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Ensure `NEXT_PUBLIC_API_URL` points to your Laravel API (e.g., `http://localhost:8000/api/v1`).

### Development

For the best experience, start the development server from the **root** or **backend** directory using:

```bash
composer run dev
```

This will start both the frontend and the backend concurrently.

If you want to run only the frontend:

```bash
pnpm dev
```

## Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS, Framer Motion, Lucide React
- **Data Fetching**: Axios, TanStack Query (React Query)
- **Forms**: React Hook Form, Zod
- **State Management**: React Query
