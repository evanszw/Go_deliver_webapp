# Go Deliver

Go Deliver — a fast, reliable urban delivery and courier service website. Built as a fresh, independent full-stack application with a red-and-black brand identity.

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router, Lucide React
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Testing:** Vitest + React Testing Library
- **Auth:** JWT (httpOnly cookies), bcrypt password hashing, rate limiting

## Project structure

```
go-deliver/
├── frontend/          # React + Vite + TypeScript + Tailwind
├── backend/           # Node.js + Express + TypeScript + Prisma
├── docs/              # Documentation
├── tests/             # Additional test assets
├── .env.example       # Example environment variables
├── .gitignore
├── README.md
└── BUSINESS_DETAILS_TO_CONFIRM.md
```

## Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL (v14 or later) — required for the backend database

## Backend setup

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Edit `.env` and set:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `JWT_SECRET` — a strong random string (change in production)
   - `WHATSAPP_NUMBER` — business WhatsApp number (with country code, no `+`)
   - `BUSINESS_EMAIL` — business email
   - `FIRST_ADMIN_EMAIL`, `FIRST_ADMIN_PASSWORD`, `FIRST_ADMIN_NAME` — first admin credentials

3. Install dependencies:
   ```bash
   npm install
   ```

4. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npx prisma migrate dev --name init
   ```

5. Seed the database (creates first admin + default services, areas, FAQs, contact info):
   ```bash
   npm run prisma:seed
   ```

6. Start the backend (dev):
   ```bash
   npm run dev
   ```
   The API runs on `http://localhost:4000`.

## Frontend setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file (optional) with:
   ```
   VITE_API_BASE=/api
   VITE_WHATSAPP_NUMBER=
   VITE_BUSINESS_EMAIL=
   ```

3. Start the frontend (dev):
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173` and proxies `/api` to the backend.

## Available scripts

### Backend (`backend/`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with tsx |
| `npm run build` | TypeScript build |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:seed` | Seed default data + first admin |
| `npm test` | Run Vitest tests |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint |

### Frontend (`frontend/`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest tests |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint |

## Database schema

Key models:
- `User` — admin staff accounts (hashed passwords)
- `Service` — delivery service catalogue
- `DeliveryRequest` — customer delivery requests (with reference number)
- `ServiceArea` — supported service areas / branches
- `FAQ` — frequently asked questions
- `ContactInfo` — key/value public contact details

## First admin setup

After running migrations, seed the database:

```bash
cd backend
npm run prisma:seed
```

This creates the first admin user using `FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD` from `.env`.
**Change the default password immediately after first login.**

Login at `/admin/login` (frontend route) to access the dashboard.

## Features

### Public website
- Home page with hero, how-it-works, services, service areas, FAQs, CTA
- Services page with service cards
- How it works page (customer journey)
- Service areas page
- FAQ page
- Contact page with contact form and WhatsApp link
- Privacy and Terms starter pages
- Multi-step delivery request booking form with validation
- WhatsApp enquiry with prefilled message
- Reference number shown after successful submission
- Responsive, mobile-first design (320px–1440px)
- Red-and-black brand palette via Tailwind design tokens

### Admin dashboard (protected)
- Secure staff login (JWT, httpOnly cookies, bcrypt, rate-limited)
- View, search, filter delivery requests
- Open request details, update status, add internal notes
- Manage services (add, edit, enable/disable)
- Manage service areas
- Manage FAQs
- Manage public contact info

### Explicitly excluded (by design)
- No payments or online checkout
- No order tracking or customer-facing tracking status
- No currency symbols or currency codes anywhere
- No unverified pricing or coverage claims
- No fake testimonials, statistics, or awards

## Business details to confirm

See `BUSINESS_DETAILS_TO_CONFIRM.md` for all unverified business information (contact numbers, addresses, prices, service areas, social links) that the business owner must confirm before publication.

## Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Production build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

Set `NODE_ENV=production` and secure `JWT_SECRET`, `DATABASE_URL`, and cookie `secure` flags for production.

## License

Private — internal use.
