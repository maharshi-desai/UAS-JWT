# User Authentication API

An Express API for user signup, login, and JWT-protected profile routes. PostgreSQL access is handled with Prisma; passwords are hashed with bcrypt.

## Requirements

- Node.js 20.19 or newer
- PostgreSQL

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. Set `JWTSECRET` to a private, random value. Keep `.env` out of version control.

3. Create the database schema and Prisma client:

   ```sh
   npm run db:generate
   npm run db:migrate
   ```

4. Start the API:

   ```sh
   npm run dev
   ```

   The server listens on port `3000` by default; set `PORT` to change it.

## Endpoints

All request and response bodies use JSON. Successful signup and login responses include a `user` object without the password and a `token`. Tokens expire after one hour.

### `POST /signup`

```json
{ "email": "person@example.com", "password": "at-least-6-chars", "name": "Person" }
```

Returns `201` with `{ "user": { "id", "email", "name", "createdAt" }, "token" }`. Invalid input returns `400`; an existing email returns `409`.

### `POST /login`

```json
{ "email": "person@example.com", "password": "at-least-6-chars" }
```

Returns `200` with the same response shape as signup. Missing or invalid fields return `400`; an unknown email or wrong password returns the same `401` error.

### Protected routes

Send the token in the request header:

```text
Authorization: Bearer <token>
```

- `GET /me` returns `{ "user": { "id", "email", "name", "createdAt" } }`.
- `GET /dashboard` returns a welcome message using the user's name, or email when no name is set.
- Missing, invalid, or expired tokens return `401`. If the user was deleted, either route returns `404`.

## Project layout

- `prisma/schema.prisma` — PostgreSQL User model
- `prisma.config.js` — Prisma CLI database connection configuration
- `src/generated/prisma/` — generated Prisma Client (created by `npm run db:generate`)
- `src/routes/authRoutes.js` — signup and login
- `src/middleware/requireAuth.js` — bearer token verification
- `src/routes/userRoutes.js` — protected profile and dashboard
- `src/server.js` — server startup and graceful shutdown
