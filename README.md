# Himalayan Arabica Beans

Specialty Himalayan coffee house web application for **Himalayan Arabica Beans** (Saat Ghumti Marg, Thamel, Kathmandu, Nepal — serving 100% organic Nepali Arabica beans, 100+ coffee flavors, and artisan pastries since 2012).

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, React Hook Form + Zod
- **Animations**: Motion (`motion/react`), GSAP + ScrollTrigger, Lenis smooth scroll (`prefers-reduced-motion` compliant)
- **Backend**: Node.js, Express, TypeScript, Zod, Helmet, CORS, Express Rate Limit, JWT auth
- **Database**: PostgreSQL via Prisma (`/server/prisma/schema.prisma`, migrations, seed); Docker Compose ships PostgreSQL 16.

## Features
- Cinematic marketing site: hero parallax, mountain dividers, marquee, animated counters, testimonial carousel, gallery lightbox.
- **Full menu experience**: category tabs, live search, sorting (house favorites / price / name), result counts and saved **Tasting List** in `localStorage`.
- **Live open/closed status** computed against Kathmandu time (`Asia/Kathmandu`), shown in the navbar, hero, contact and footer.
- **Admin portal** (`/admin`): JWT login, dashboard stats, add/edit/delete menu items, sold-out toggle, gallery, testimonials, contact inbox with read/delete, and newsletter subscriber list.
- **Contact**: validated form + hidden honeypot, copy-address, directions, WhatsApp and phone actions.
- **SEO & accessibility**: per-route titles/meta + Open Graph, JSON-LD, sitemap/robots, skip link, focus-trapped lightbox, reduced-motion support.
- **Resilience**: error boundary, 404 route, no-flash theme boot, transactional Prisma writes, and API 404/validation error shapes.
- Security: Helmet, CORS allow-list, global + login-specific rate limits, timing-safe admin credential comparison, constant-time JWT checks.

## Design System
- **Palette (Tailwind v4 `@theme` in `/src/index.css`)**:
  - Espresso Dark `#1C110A` (`bg-espresso`)
  - Roasted Brown `#3B2314` (`bg-roasted`)
  - Mocha `#6F4E37` (`text-mocha`)
  - Caramel Gold `#C8872E` (`bg-caramel`, `text-caramel`)
  - Crema Cream `#F5E9D8` (`bg-crema`)
  - Himalayan Green `#2F5D50` (`bg-himalayan`)
  - Snow White `#FFFAF3` (`text-snow`)
- **Typography**: `Playfair Display` (headings) + `Poppins` (body) with tabular numerals (`tabular-nums`) for NPR prices and counters.
- **Theme Mode**: Defaults to Espresso Dark (`.dark` on `<html>`), toggleable in the top bar, persisted, with a pre-paint script that prevents theme flash.

## Project Structure
```
/
├── index.html                 # SEO meta tags, Open Graph, CafeOrCoffeeShop JSON-LD, no-flash theme boot
├── server.ts                  # Unified Express API + Vite server on port 3000
├── Dockerfile                 # Production image used by docker-compose
├── docker-compose.yml         # PostgreSQL 16 + App container orchestration
├── public/                    # sitemap.xml & robots.txt
├── server/
│   ├── app.ts                 # Helmet, CORS, rate limits, API router, JSON 404s
│   ├── controllers/           # Public & JWT Admin controllers
│   ├── middleware/            # Zod validation, JWT auth, error handler
│   ├── routes/                # /api & /api/admin route definitions
│   ├── services/              # Prisma-backed data access + image uploads
│   ├── data/                  # Seed data + legacy store snapshot used for first seed
│   └── prisma/                # PostgreSQL schema, migrations & seed.ts
└── src/
    ├── main.tsx               # React mount + Maps quota listener
    ├── index.css              # Tailwind v4 design tokens & dark variant
    └── client/
        ├── App.tsx            # Router, providers, ErrorBoundary, ScrollToTop
        ├── components/        # Navbar, Footer, MenuCard, OpenStatusBadge, TastingList,
        │                      # Preloader, ThamelMap, Reveal, ErrorBoundary, BackToTop…
        ├── hooks/             # useLenis, useCafeStatus, usePageMeta
        ├── lib/               # Typed API client, theme, tasting list
        └── pages/             # Home, About, Menu, Gallery, Contact, Admin, NotFound
```

## Setup & Running Locally

### Option 1: Local Development (PostgreSQL)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables and set `DATABASE_URL` to your PostgreSQL instance:
   ```bash
   cp .env.example .env
   ```
3. Apply migrations and seed the database (seed runs only when the database is empty):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. Start development server on port 3000:
   ```bash
   npm run dev
   ```
5. Build & run production server:
   ```bash
   npm run build
   npm start
   ```

### Option 2: Docker Compose with PostgreSQL
1. Set `POSTGRES_PASSWORD`, `JWT_SECRET`, and `VITE_GOOGLE_MAPS_API_KEY` in `.env`.
2. Start PostgreSQL and the app:
   ```bash
   docker compose up --build -d
   ```
   The app container applies Prisma migrations and seeds an empty database automatically before starting.

## Environment Variables
| Variable | Purpose |
| --- | --- |
| `PORT` | Server port (default `3000`). |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma (required). |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | Connection parts used to compose `DATABASE_URL` for local setups. |
| `APP_URL` / `CORS_ALLOWED_ORIGINS` | Allowed browser origins. In production only these are accepted. |
| `JWT_SECRET` | Signing secret for admin tokens — set a long random value in production. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Admin access-token lifetime in minutes (default `720`). |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Reserved for refresh-token support (not yet implemented). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin portal credentials. |
| `VITE_GOOGLE_MAPS_API_KEY` | Enables the interactive Thamel map; falls back to a styled map card when absent. |
| `GEMINI_API_KEY` | Optional Gemini API key for AI Studio deployments. |

## API Overview
- `GET /api/health` — health + uptime.
- `GET /api/menu`, `GET /api/menu/featured` — public menu (available items only).
- `GET /api/gallery`, `GET /api/testimonials`.
- `POST /api/contact`, `POST /api/newsletter`.
- `POST /api/admin/login` (rate-limited).
- Authenticated: `GET /api/admin/dashboard`, CRUD for menu, gallery and testimonials, and message read/delete.

## Quality Checks
```bash
npm run lint        # TypeScript typecheck (tsc --noEmit)
npm run build       # generate Prisma client + production client build
npm run db:migrate  # apply Prisma migrations
npm run db:seed     # seed an empty database
```

## Editing Content
- **Seed Data**: Edit `/server/data/seedData.ts` (or use the live `/admin` portal at runtime). The seed runs only when the database has no categories, so it never overwrites live edits.
- **Gallery Uploads**: Photos dragged into the admin gallery are saved to `/server/uploads` and served from `/uploads`; persist this folder in production (the Compose file mounts it).
- **Default Admin Login**: `admin@himalayanarabicabeans.com` / `ThamelArabica2012!` (configurable via `ADMIN_EMAIL` and `ADMIN_PASSWORD`). Change these before deploying.
