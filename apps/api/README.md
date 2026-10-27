# FixNear API

Express + TypeScript backend for the FixNear local services marketplace.

> **Monorepo location:** `apps/api`  
> **Port (default):** `4000`

---

## Prerequisites

- Node.js ≥ 20
- A PostgreSQL database (Neon serverless or local)
- npm ≥ 9

---

## 1. Environment configuration

Copy the example and fill in your values:

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```env
PORT=4000
WEB_ORIGIN=http://localhost:3000
NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

> **Never commit `.env` to version control.** It is listed in `.gitignore`.  
> Keep `DATABASE_URL` in the backend only — it must not be exposed to the Next.js frontend.

---

## 2. Install dependencies

```bash
# From monorepo root
npm install

# Or from the api directory directly
npm --prefix apps/api install
```

---

## 3. Run migrations

Check the current migration state first:

```bash
npm --prefix apps/api run prisma:migrate:status
```

Apply any pending migrations (development only):

```bash
# From apps/api directory:
cd apps/api
npx prisma migrate dev --name <migration-name>
```

> **Never use `migrate reset` or `db push --force-reset` on a shared or production database.**

---

## 4. Generate Prisma Client

The client is generated to `src/generated/prisma/`. Regenerate after schema changes:

```bash
npm run prisma:generate
# or from monorepo root:
npm --prefix apps/api run prisma:generate
```

---

## 5. Run the seed script

> ⚠️ **Development only.** The seed script inserts fictional demo records.  
> **Do not run in production.**

```bash
# From monorepo root:
npm run db:seed

# Or from apps/api:
npm --prefix apps/api run db:seed
```

The seed is **safe to rerun**. It uses `upsert` keyed on stable slugs/emails, so running it again will not create duplicates.

### Seed records created

| Table | Records |
|---|---|
| ServiceCategory | 5 (electrician, plumber, ac-technician, computer-repair, appliance-repair) |
| User (PROFESSIONAL role) | 5 fictional accounts |
| ProfessionalProfile | 5 |
| ProfessionalService | 10 (2 per professional) |

All seed user emails end in `@fixnear.invalid` and names include `(Dev Seed)` to clearly identify them as test data.

---

## 6. Start the API

**Development (with hot reload):**

```bash
# From monorepo root:
npm run dev:api

# Or directly:
npm --prefix apps/api run dev
```

**Production:**

```bash
npm run build:api
npm run start:api
```

---

## 7. Test the endpoints locally

The API runs on `http://localhost:4000` by default.

### Health check

```bash
curl http://localhost:4000/api/health
# Expected: {"status":"ok","message":"FixNear API is running"}
```

### List service categories

```bash
curl http://localhost:4000/api/categories
```

### List professionals (with optional filters)

```bash
# All professionals (paginated)
curl "http://localhost:4000/api/professionals?limit=10&offset=0"

# Filter by city
curl "http://localhost:4000/api/professionals?city=Karachi"
```

### Get a single professional profile

```bash
curl http://localhost:4000/api/professionals/<professionalProfileId>
```

### Create a booking (development only — no auth yet)

```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "<userId>",
    "professionalServiceId": "<serviceId>",
    "address": "123 Test Street",
    "scheduledAt": "2026-11-01T10:00:00Z",
    "description": "Need wiring checked"
  }'
```

### List bookings for a customer

```bash
curl http://localhost:4000/api/bookings/customer/<customerId>
```

---

## 8. Project structure

```
apps/api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Applied SQL migrations
├── src/
│   ├── config/env.ts          # Environment variable parsing (Zod)
│   ├── generated/prisma/      # Auto-generated Prisma Client (do not edit)
│   ├── lib/prisma.ts          # Prisma singleton
│   ├── routes/
│   │   ├── health.ts
│   │   ├── categories.ts
│   │   ├── professionals.ts
│   │   ├── bookings.ts
│   │   └── index.ts
│   ├── app.ts                 # Express app (middleware + routes)
│   ├── index.ts               # Server entrypoint
│   └── seed.ts                # Dev seed script ⚠️ not for production
├── prisma7.config.ts          # Prisma 7 config (schema + datasource)
├── .env.example               # Template — copy to .env and fill in values
└── tsconfig.json
```

---

## 9. Available npm scripts (apps/api)

| Script | Description |
|---|---|
| `npm run dev` | Start with tsx hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled output |
| `npm run db:seed` | Run dev seed script |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run prisma:validate` | Validate schema |
| `npm run prisma:migrate:status` | Check migration state |

---

## 10. Security notes

- `passwordHash` is **never** returned in list or public profile responses.
- Booking endpoints are **open** in development (no authentication). Authentication will be added in Module 5.
- `DATABASE_URL` and other secrets must stay in `apps/api/.env` — never the frontend.
