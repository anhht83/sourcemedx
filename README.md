# SourceMedX

## About the product

**SourceMedX** is an **AI-powered** global B2B medical device sourcing platform—*accessible, simple, and transparent*. Instead of static catalogs and manual triage, the product treats **natural language as the primary interface**: buyers describe what they need in their own words, and the system maps that intent to retrieval, comparison, and narrative reporting across the medical-device domain.

**How the AI-powered tooling is used**

- **Intent over keywords** — Prompts are interpreted in context so teams are not limited to exact product codes or boolean search strings.
- **Grounded, multi-source intelligence** — AI-assisted workflows pull together supplier surfaces, industry directories, and regulatory references (for example FDA and EUDAMED) so answers reflect **structured compliance and audit signals**, not generic web blurbs.
- **Synthesis, not just links** — The platform is built to produce **actionable reports**: condensed supplier intelligence and due-diligence-oriented views that shorten cycles from weeks to hours.
- **Built for this domain** — Unlike general-purpose chatbots, the stack is aimed at **medical device sourcing**: regulatory nuance, verified supplier networks, and procurement-grade outputs in one secure workflow.

**What buyers use it for**

- **AI-assisted, prompt-driven search** across websites, directories, and regulatory databases in one place.
- **AI-generated reports** that combine supplier intelligence with regulatory and audit due diligence for faster, better-informed decisions.
- Access to a **verified** supplier network and reporting that supports serious procurement—not anonymous listings.

Public messaging also previews future **supplier-side** visibility and advertising tools; see the marketing site for the current roadmap.

## Repository layout


| Directory                     | Description                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [smx-frontend](smx-frontend/) | Main product UI — **Next.js 15** (App Router, React 19, Tailwind).                                                                                         |
| [smx-api](smx-api/)           | Backend API — **Express**, **TypeORM**, **PostgreSQL**, **Redis**, **Socket.IO**; **LangChain** / LLM integrations for AI workflows; email and **Stripe**. |
| [smx-admin](smx-admin/)       | Internal admin dashboard — **NestJS** backend and **React** (CRA) frontend.                                                                                |
| [smx-site](smx-site/)         | Marketing / static site assets — **Tailwind CSS** CLI build.                                                                                               |


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