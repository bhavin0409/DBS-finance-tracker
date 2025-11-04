# DBS finance tracker

DBS finance tracker is a modern personal finance web app built with Next.js, Clerk for authentication, Prisma/Postgres for storage, and Tailwind CSS for UI. It provides transaction tracking, budgets, recurring transactions, AI-powered receipt scanning, and automated alerts.

---

## Key Features

- User authentication with Clerk
- Transaction CRUD with categories and accounts
- Recurring transaction processor (Inngest)
- Budget tracking and alerts (email notifications)
- AI receipt scanning (Google Generative AI / Gemini)
- Clean UI with Tailwind, Radix primitives and Lucide icons
- Server actions and API routes for secure server-side work

---

## Quick Start (Windows)

1. Clone repo
   ```powershell
   git clone https://github.com/your-username/welth.git
   cd "d:\2delta\Projects Section\welth"
   ```

2. Install dependencies
   ```powershell
   npm install
   ```

3. Copy environment variables
   ```powershell
   copy .env.example .env
   ```
   Edit `.env` with your keys (see Required env section).

4. Generate Prisma client and run migrations
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Run dev server
   ```powershell
   npm run dev
   ```
   Open http://localhost:3000

---

## Required Environment Variables

Add these to `.env` (replace placeholders):

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
- CLERK_SECRET_KEY=
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
- DATABASE_URL=postgresql://...
- DIRECT_URL=postgresql://...
- INNGEST_SIGNING_KEY=
- RESEND_API_KEY=          (optional — Resend email)
- MAILERSEND_API_KEY=      (optional — MailerSend email)
- NEXT_PUBLIC_EMAIL_FROM=  (verified sender)
- ARCJET_KEY=              (optional — ArcJet)
- GEMINI_API_KEY=          (optional — Google Generative AI)

Note: For MailerSend trial accounts you can only send to the admin/verified email. Use Resend for quick testing without a custom domain.

---

## Project Structure (high level)

- `/app` — Next.js app routes, pages, and server actions
- `/components` — shared UI components and forms
- `/actions` — server-side business logic (transactions, budgets, email)
- `/lib` — utilities (prisma client, arcjet, checkUser)
- `/emails` — email templates (JSX)
- `/prisma` — schema.prisma and migrations
- `/app/api/inngest` — scheduled/triggered background functions

---

## Deployment Notes

- Ensure all production environment variables are configured (Vercel, AWS, etc.).
- Run `npx prisma migrate deploy` in production.
- Verify sender/email provider configuration (MailerSend, Resend, SendGrid).
- If using Google Generative AI, confirm your key has access to the model and region.

---

## Common Troubleshooting

- `.map is not a function` — ensure backend returns arrays, not objects.
- MailerSend 422 (trial) — trial accounts restrict recipients; verify or upgrade.
- Prisma `Unknown field` — schema relation names must match includes.
- Decimal values — Prisma Decimal objects may appear as strings in serverless; handle with type checks before calling `.toNumber()`.
- Gemini model errors — list available models and use supported model names or implement retries for 503.

---

## Testing & Utilities

- Seed data: `npm run seed` (if a seed route/script exists)
- Run linters/tests: `npm run lint`, `npm test` (if configured)

---

## Contributing

- Fork the repo, create feature branch, open a PR with description and tests.
- Keep UI and server logic separated; add server tests for actions when possible.

---

## License

MIT © 2025 DBS finance tracker