# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/37d8e500-a454-4aaa-89bb-4442de33bf6e

## Local development (Bun + Turborepo)

This project is now a Bun-based Turborepo monorepo with two apps:

- `apps/web` – Vite/React frontend (current Gym UI)
- `apps/server` – Node/Express + TypeScript backend using Neon + Drizzle ORM

### Prerequisites

- Bun installed (v1.2.x): https://bun.sh
- Node.js installed (for running Express/nodemon)

### Install dependencies

```sh
bun install
```

### Configure environment variables

Backend (`apps/server/.env` – copy from `.env.example`):

```sh
cd apps/server
cp .env.example .env   # or create manually
```

Set at least:

- `DATABASE_URL` – Neon PostgreSQL URL
- `WEB_ORIGIN` – e.g. `http://localhost:8080`
- Optional Twilio WhatsApp settings for automated messages:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_FROM` (e.g. `whatsapp:+1415xxxxxxx`)

Frontend (`apps/web/.env` – copy from `.env.example`):

```sh
cd apps/web
cp .env.example .env
```

Adjust `VITE_API_BASE_URL` if your API runs on a different port.

### Run all apps in dev mode

From the repo root:

```sh
bun run dev
```

This runs both:

- Web: http://localhost:8080
- API: http://localhost:3001

You can also run them individually:

```sh
# Only web
bun run dev:web

# Only server
bun run dev:server
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Turborepo (monorepo orchestration)
- Bun (package manager)
- Vite, TypeScript, React, shadcn-ui, Tailwind CSS (frontend)
- Node, Express, TypeScript, Neon, Drizzle ORM (backend)
- Twilio WhatsApp + cron-based notifier for automated WhatsApp messages

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/37d8e500-a454-4aaa-89bb-4442de33bf6e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
