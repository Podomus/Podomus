 








# Podomus

Podomus is a modern web platform built with Next.js, React 19, TypeScript, TailwindCSS, Prisma, and PostgreSQL. It features authentication, a responsive UI, and a robust backend.

## Features
- Next.js 15 App Router
- React 19
- TypeScript
- TailwindCSS & NextUI
- Prisma ORM with PostgreSQL
- Authentication with better-auth
- Email notifications (Nodemailer)
- Dockerized Postgres for local development

## Setup
1. Copy `.env.example` to `.env` and fill in secrets.
2. Run `npm install`.
3. Start Postgres: `docker-compose up -d`.
4. Run migrations: `npx prisma migrate dev`.
5. Start dev server: `npm run dev`.

## Testing

E2E tests use Playwright. To run them:

```bash
# 1. Start the database
docker compose up -d

# 2. Build the app for production (faster than dev mode)
npm run build

# 3. Start the production server
BETTER_AUTH_SECRET=$(openssl rand -base64 32) \
  BETTER_AUTH_BASE_URL=http://localhost:3099 \
  npx next start --port 3099

# 4. In another terminal, run the tests
npm run test:e2e
```

For headed mode (watch tests in browser): `npm run test:e2e:ui`

### Test structure
- `e2e/` — Test specs and page objects
- `e2e/pages/` — Page Object Model classes
- `playwright.config.ts` — Playwright configuration

## Deployment
- Vercel ready. See `vercel.json` for config.

## License
MIT
	<img alt="NextJS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/NextJS.svg">

	<img alt="Tailwind" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
