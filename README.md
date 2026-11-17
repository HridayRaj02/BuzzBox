<div align="center">
  <img src="./BUZZ%20BOX%20LOGO.png" alt="BuzzBox logo" width="180" />

  # BUZZBOX

  ### Find the scene. Book the experience.

  <p>
    <img src="https://img.shields.io/badge/BUZZBOX-Underground%20culture-D2F000?style=for-the-badge&labelColor=131317" alt="BuzzBox" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=131317" alt="React 19" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=131317" alt="Node.js and Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=131317" alt="PostgreSQL and Prisma" />
  </p>
</div>

<br />

BuzzBox is a discovery and ticketing experience for India's underground nightlife and culture: warehouse raves, intimate listening rooms, comedy, festivals, clubs, and curated live events. It pairs a neon-on-dark React interface with an Express + PostgreSQL backend built around a rich event, venue, ticket, booking, and waitlist data model.

> **Status:** The UI currently uses local demo event data for its discovery and booking preview. The backend independently exposes a database-backed events-listing API and has data-access functions ready for bookings, saved events, related events, and waitlists.

## ✦ Highlights

| Discovery | Event experience | Platform foundation |
| :-- | :-- | :-- |
| City, date, category, and keyword filtering | Ticket-tier selection with availability limits | PostgreSQL schema for events, venues, artists, users, tickets, bookings, and waitlists |
| Curated vibes and city circuits | Save events, share links, map directions, and calendar downloads | Prisma-powered event search, pagination cursor support, and transaction-safe booking logic |
| Radar and weekend event views | Related events and event rules at a glance | Typed server-side data access with tests |

## 🎨 Product surface

- **Explore** — cultural circuits, city selection, featured radar, and organizer CTA.
- **Experience** — browse by vibe and discover BuzzBox Originals.
- **Radar** — filter live events by city, date, category, and keywords.
- **Events** — curated weekend plans.
- **Event details** — lineups, venue information, directions, ticket tiers, save/share controls, and an `.ics` calendar export.
- **Profile & auth views** — protected profile routes and public profile URLs.

## 🧱 Tech stack

| Layer | Tools |
| :-- | :-- |
| Client | React 19, React Router 7, Vite 8, Tailwind CSS 4 |
| Server | Node.js, Express 5, TypeScript (via `tsx`) |
| Data | PostgreSQL, Prisma 7, `pg` adapter |
| Quality | Node test runner, ESLint |

## 🚀 Run locally

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

### 1. Set up the database

```bash
cd Server
cp .env.example .env
```

Update `DATABASE_URL` in `Server/.env` to point at your local PostgreSQL database, then run:

```bash
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

### 2. Start the API

```bash
cd Server
npm run dev
```

The API starts at `http://localhost:2222`.

### 3. Start the client

In another terminal:

```bash
cd Client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). During development, Vite proxies `/api` requests to port `2222`.

## 🔌 API

### `GET /api/events`

Returns publicly visible, published events from PostgreSQL, ordered by upcoming start time.

| Query parameter | Description |
| :-- | :-- |
| `search` | Searches titles, descriptions, cities, venues, tags, and matching category names |
| `cityId` | Filters by a city ID |
| `category` | One of `MUSIC`, `RAVE`, `CLUBS`, `COMEDY`, `FESTIVALS`, `LIVE_SHOWS`, `ART_CULTURE`, `EXPERIENCES`, or `AFTER_HOURS` |
| `when` | `tonight`, `weekend`, or `all` |
| `cursor` | Event ID to use as the next-page cursor |
| `limit` | Page size from `1` to `100` (default `20`) |

```bash
curl "http://localhost:2222/api/events?when=weekend&category=MUSIC&limit=8"
```

## 🗂️ Repository layout

```text
BuzzBox/
├── BUZZ BOX LOGO.png
├── Client/
│   ├── src/
│   │   ├── components/     # Reusable UI and discovery components
│   │   ├── data/           # Demo events, cities, and demo credentials
│   │   ├── hooks/          # Auth and navigation hooks
│   │   ├── pages/          # Explore, radar, event, checkout, profile, auth views
│   │   └── utils/          # Event calculations and tests
│   └── vite.config.js      # Vite config and API proxy
└── Server/
    ├── lib/                # Prisma client and event/booking data access
    ├── prisma/             # Schema, migrations, and seed data
    ├── index.js            # Express entry point and HTTP routes
    └── prisma7.config.ts   # Prisma configuration
```

## 🧪 Checks

```bash
# Client
cd Client
npm run lint
npm test
npm run build

# Server
cd ../Server
npm test
npm run db:validate
```

## 🧭 Development notes

- The frontend presently imports event listings from `Client/src/data/mockEvents.js`; connecting those screens to `GET /api/events` is the next integration step.
- The server includes reusable functions for detailed events, related events, saved events, waitlists, and transactional ticket reservations, even though only the events-listing route is registered in `Server/index.js` today.
- Organizer onboarding and several organizer-console controls are intentionally marked as preview/coming soon in the UI.

## 📜 License

No license has been added to this repository yet. Add one before distributing or accepting external contributions.

<div align="center">
  <sub>Built for the scenes worth finding.</sub>
</div>
