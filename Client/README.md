# BuzzBox Client

React + Vite frontend for browsing events, creating an account, saving events, and making ticket reservations.

## Folder guide

```text
src/
├── components/  Reusable UI pieces such as forms, header, and event cards
├── data/        UI-only configuration; never the source of live event data
├── hooks/       Shared React state for auth, profile data, and navigation
├── lib/         API client and server-data mappers
├── pages/       Route-level screens
├── styles/      Reusable Tailwind class strings
└── utils/       Small pure helpers with unit tests
```

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm test
npm run build
```

During development, Vite forwards `/api` requests to `http://localhost:2222`.
