 








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
- Add your unit/e2e tests in `__tests__` or `tests/`.

## Deployment
- Vercel ready. See `vercel.json` for config.

## License
MIT
	<img alt="NextJS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/NextJS.svg">

	<img alt="Tailwind" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
