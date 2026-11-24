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

BuzzBox is a full-stack discovery and ticket-reservation platform for India's underground nightlife and culture: warehouse raves, intimate listening rooms, comedy, festivals, clubs, and curated live events. It pairs a neon-on-dark React interface with an Express + PostgreSQL backend built around events, venues, ticket tiers, bookings, saved events, and waitlists.

> **Status:** The client is connected to the Express API and local PostgreSQL database. The local seed creates 15 upcoming events. Account sessions, saved events, waitlists, profile preferences, and reservations persist in the database.

## ✦ Highlights

| Discovery | Event experience | Platform foundation |
| :-- | :-- | :-- |
| City, date, category, and keyword filtering | Ticket-tier selection with availability limits | PostgreSQL schema for events, venues, artists, users, tickets, bookings, and waitlists |
| Experiences is the default landing page, with curated vibes and city circuits | Save events, share links, map directions, and calendar downloads | Prisma-powered event search, pagination cursor support, and transaction-safe booking logic |
| Radar and weekend event views | Related events and event rules at a glance | Typed server-side data access with tests |

## 🎨 Product surface

- **Explore** — cultural circuits, city selection, featured radar, and organizer CTA.
- **Experience** — the default landing page after a successful email or Google login; browse by vibe and discover BuzzBox Originals.
- **Radar** — filter live events by city, date, category, and keywords.
- **Events** — curated weekend plans.
- **Event details** — lineups, venue information, directions, ticket tiers, save/share controls, and an `.ics` calendar export.
- **Profile & auth views** — protected profile routes, email/password sessions, and Google OAuth sign-in.

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

### 1. Configure the server and database

```bash
cd Server
```

Create `Server/.env` and set the required values:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/buzzbox"
PORT=2222
CLIENT_URL="http://localhost:5173"
OAUTH_SESSION_SECRET="replace-this-with-a-long-random-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:2222/api/auth/google/callback"
```

Leave the three `GOOGLE_*` values empty if you only want email/password authentication. Then run:

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

### Main endpoint groups

| Group | Endpoints | Access |
| :-- | :-- | :-- |
| System | `GET /api/health`, `GET /api/cities` | Public |
| Auth | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Public/session |
| Google OAuth | `GET /api/auth/google`, `GET /api/auth/google/callback` | Public |
| Events | `GET /api/events`, `GET /api/events/featured`, `GET /api/events/:slug` | Public |
| Bookings | save/unsave, waitlist, ticket reservation endpoints | Signed in |
| Profile | `PATCH /api/me`, saved events, waitlist, bookings | Signed in |

## 🗂️ Repository layout

```text
BuzzBox/
├── BUZZ BOX LOGO.png
├── Client/
│   ├── src/
│   │   ├── components/     # Reusable UI and discovery components
│   │   ├── data/           # UI-only city, profile, and editorial-vibe configuration
│   │   ├── hooks/          # Auth and navigation hooks
│   │   ├── lib/            # API client and server-data mappers
│   │   ├── pages/          # Explore, radar, event, checkout, profile, auth views
│   │   └── utils/          # Event calculations and tests
│   └── vite.config.js      # Vite config and API proxy
└── Server/
    ├── controllers/        # HTTP request/response handling
    ├── routes/             # URL-to-controller mappings
    ├── lib/                # Prisma client plus auth/event domain logic
    ├── prisma/             # Schema, migrations, and seed data
    ├── index.js            # Express app setup and route mounting
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

## 🔐 Google sign-in

Google authentication is implemented with Passport and OAuth 2.0. The flow uses a random, short-lived OAuth `state` value stored in the Express session to protect the callback request.

1. In Google Cloud Console, create an OAuth 2.0 **Web application** client.
2. Add this exact authorised redirect URI for local development:

   ```text
   http://localhost:2222/api/auth/google/callback
   ```

3. Put the client ID, client secret, and callback URL in `Server/.env`.
4. Restart the API. Successful Google sign-in redirects the user to `/experience`.

If Google returns `redirect_uri_mismatch`, the URL registered in Google Cloud Console does not exactly match `GOOGLE_CALLBACK_URL`.

## 🗄️ Check saved user data

The app saves accounts, login sessions, saved events, waitlist entries, and bookings in the local `buzzbox` PostgreSQL database. After starting PostgreSQL and the API, use either pgAdmin or the terminal to inspect it.

### pgAdmin connection

Register a server with these local-development values:

| Field | Value |
| :-- | :-- |
| Host name/address | `127.0.0.1` |
| Port | `5432` |
| Maintenance database | `postgres` |
| Username | The username from your `DATABASE_URL` |
| Database to browse | `buzzbox` |

The PostgreSQL server and port must match the `DATABASE_URL` in `Server/.env`. In pgAdmin's **Query Tool**, run the following to confirm that it is connected to the same database as BuzzBox:

```sql
SELECT current_database(), current_user, inet_server_port();
```

It should return `buzzbox` as `current_database`. Then view registered users without exposing password hashes:

```sql
SELECT id, name, email, phone, role, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;
```

### Terminal alternative

```bash
cd Server
psql "$DATABASE_URL"
```

Then run the same SQL query above. Passwords are intentionally never readable: only salted password hashes are stored.

## 🧭 Development notes

- Live event data comes from `/api/events`; files under `Client/src/data/` contain only presentation configuration.
- Server routes are grouped by system, auth, events, profile, and booking actions. Controllers call reusable domain logic in `Server/lib/`.
- `Server/.env` contains local secrets and must stay uncommitted. Use the configuration block above as the safe template.
- Organizer onboarding and several organizer-console controls are intentionally marked as preview/coming soon in the UI.
- Reservations are stored safely in the database, but a real payment provider has not been integrated yet.

## 📜 License

No license has been added to this repository yet. Add one before distributing or accepting external contributions.

<div align="center">
  <sub>Built for the scenes worth finding.</sub>
</div>
