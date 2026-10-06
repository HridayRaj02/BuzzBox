# BuzzBox API

Express API for account creation and sign-in, backed by PostgreSQL.

## Configure PostgreSQL

1. Create a PostgreSQL database named `buzzbox` (or use the name in your connection URL).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your database connection string.
3. Replace `SESSION_SECRET` with a random value of at least 32 characters. For example, generate one with `openssl rand -hex 32`.
4. Install dependencies with `npm install`.
5. Run `npm run db:migrate` to create the `users` table and Prisma migration history.
6. Start the API with `npm run dev` while developing or `npm start` to run it normally. It listens on port 2222 by default.

Apply the Prisma migration before starting account sign-up. The API checks for a working PostgreSQL connection and the `users` table at startup; it does not modify the database schema itself.

## Endpoints

- `GET /api/health` reports whether PostgreSQL is reachable.
- `POST /api/auth/signup` accepts `{ "name", "email", "phone?", "password" }` and creates an account.
- `POST /api/auth/login` accepts `{ "email", "password" }`.
- `GET /api/auth/me` returns the currently signed-in user.
- `POST /api/auth/logout` clears the session cookie.

Passwords are stored as salted scrypt hashes. Sessions use a signed, HTTP-only, same-site cookie. The Vite dev server proxies `/api` requests to this Express server.

Phone OTP, Google, and Apple sign-in require their respective SMS or OAuth provider credentials and are marked as coming soon in the UI.
