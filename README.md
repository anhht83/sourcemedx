# SourceMedX

## About the product

**SourceMedX** is a global B2B medical device sourcing platform—positioned as *accessible, simple, and transparent*. It connects verified suppliers and active buyers through a secure, discrete matchmaking experience.

The platform is described as a next-generation sourcing hub: it aggregates information from multiple data sources to support supplier and buyer profiles, and matches participants based on natural-language (prompt) requests—not only static keyword searches.

**What buyers use it for**

- Prompt-based search across supplier websites, industry directories, and regulatory databases (for example FDA and EUDAMED) in one workflow.
- Actionable reports that combine supplier intelligence with regulatory and audit due diligence so teams can shorten sourcing cycles from weeks to hours.
- Access to a verified network of registered, pre-vetted suppliers and reporting that supports informed procurement decisions.

Compared with generic sourcing listings or general-purpose AI chatbots, SourceMedX is purpose-built for medical devices: specialized regulatory data, supplier-focused intelligence, and compliance-oriented reporting in a single platform. Public messaging also previews future supplier-side visibility and advertising tools; see the marketing site for the current roadmap.

## Repository layout


| Directory                     | Description                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [smx-frontend](smx-frontend/) | Main product UI — **Next.js 15** (App Router, React 19, Tailwind).                                              |
| [smx-api](smx-api/)           | Backend API — **Express**, **TypeORM**, **PostgreSQL**, **Redis**, **Socket.IO**, AI/email/Stripe integrations. |
| [smx-admin](smx-admin/)       | Internal admin dashboard — **NestJS** backend and **React** (CRA) frontend.                                     |
| [smx-site](smx-site/)         | Marketing / static site assets — **Tailwind CSS** CLI build.                                                    |


Package-specific setup, scripts, and API docs live in each folder’s own README (for example `smx-api/README.md`, `smx-admin/README.md`).

## Prerequisites

- **Node.js** 20.x or newer (see `smx-api/package.json` and subprojects for exact expectations).
- **PostgreSQL** — shared by `smx-api` and `smx-admin` backends (separate DBs/schemas possible; configure per app).
- **Redis** — required for `smx-api` (queues/caching as configured).
- Optional: **Docker** — `smx-api` includes Docker Compose for Postgres and Redis (see `smx-api/docker-compose.yml`).

## Environment configuration

Do not commit real secrets. Copy the example env files and adjust for your machine:

- `smx-api`: copy `.env.example` to `.env.development` (or the env file your scripts load — see `smx-api` README).
- `smx-frontend`: copy `.env.example` to `.env.local`.
- `smx-admin/backend`: copy `.env.example` to `.env`.

Align JWT and API URLs between **smx-api** and **smx-frontend** where documented in those examples (for example matching `JWT_SECRET` / `NEXT_PUBLIC_JWT_SECRET`).

## Local development (typical)

Commands are run **inside each project directory** after `npm install`.

1. **Start infrastructure** (if you use Docker for DB/Redis):
  ```bash
   cd smx-api
   docker compose up -d
  ```
2. **Run the main API** (default port in dev is often `3001`; confirm in your `smx-api` env file):
  ```bash
   cd smx-api
   npm install
   npm run dev
  ```
3. **Run the main web app** (Next.js defaults to `http://localhost:3000`):
  ```bash
   cd smx-frontend
   npm install
   npm run dev
  ```
4. **Admin** (ports are defined in `smx-admin` env; see [smx-admin/README.md](smx-admin/)):
  ```bash
   cd smx-admin/backend && npm install && npm run start:dev
   cd smx-admin/frontend && npm install && npm start
  ```
5. **Marketing site** (CSS build watch):
  ```bash
   cd smx-site
   npm install
   npm run dev
  ```

## License

Proprietary; see individual packages for details.