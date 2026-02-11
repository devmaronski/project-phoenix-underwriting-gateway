# Project Phoenix Frontend (Phase 0)

## Overview
Bootstrap frontend for Project Phoenix using React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

## Requirements
- Node.js 18+
- npm 9+

## Setup
```bash
cd frontend
npm install
```

## Scripts
- `npm run dev` – Start the Vite dev server
- `npm run build` – Type-check and build for production
- `npm run lint` – Run ESLint
- `npm run format:check` – Check formatting with Prettier
- `npm run test` – Run unit tests with Vitest
- `npm run test:coverage` – Run tests with coverage

## Environment Variables
Copy [.env.example](.env.example) to `.env` and adjust values as needed.

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui (base `Button`)
- ESLint + Prettier
- Vitest + React Testing Library
