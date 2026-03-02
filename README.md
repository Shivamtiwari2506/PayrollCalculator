# Full Stack App

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack
- Frontend: Vite, React, Tailwind CSS, Material UI
- Backend: Node.js, Express, JWT Auth
- Database: Prisma, PostgreSQL
