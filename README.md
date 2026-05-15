# Insighta Labs+ Web Portal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**The official web interface for Insighta Labs+**  
A secure, role-aware portal for analysts and admins to explore demographic intelligence data.

[Live App](https://insighta-labs-web-portal-adeneey-devs-projects.vercel.app) · [Backend API](https://insighta-labs-api-adeneey-dev178-dlpfhyah.leapcell.dev) · [CLI Tool](https://github.com/adeneey-dev/insighta-labs-cli)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Pages & Features](#pages--features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Role-Based UI](#role-based-ui)
- [How It Connects to the Backend](#how-it-connects-to-the-backend)
- [Security](#security)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## Overview

Insighta Labs+ Web Portal is the browser-based interface for the Insighta Labs+ platform. It gives non-technical users — analysts, product teams, and internal stakeholders — a clean, accessible way to log in, explore demographic profile data, run searches, and export results, without needing to touch an API or a CLI.

The portal is one of three interfaces in the Insighta Labs+ ecosystem, and it shares the same backend as the CLI tool. Every piece of data you see in the portal comes from the same API, the same database, and enforces the same access rules.

```
Web Portal (Vercel)  ──►  NestJS API (Leapcell)  ──►  PostgreSQL (Supabase)
                                                   ──►  Redis Cache (Leapcell)
```

---

## Pages & Features

### 🔐 Login Page
- One-click **"Continue with GitHub"** button
- GitHub OAuth 2.0 flow handled entirely in the browser
- No password, no form — just GitHub
- Redirects to the dashboard automatically after successful login

### 📊 Dashboard
- Overview metrics: total profiles, breakdown by gender, age group distribution
- Quick-access links to the most common analyst workflows
- Shows the currently logged-in user's name, avatar, and role

### 👥 Profiles List
- Paginated table of all profiles
- **Live filters** — filter by gender, age group, country, and age range without reloading the page
- **Sorting** — click any column header to sort ascending or descending
- Navigation links for next/previous page
- Each row links to the full profile detail view

### 🔍 Search Page
- Plain English search bar: type `"young females from Kenya"` and get results
- Powered by the backend's rule-based NLP parser
- Same pagination and filter controls as the profiles list
- Clear error messaging when a query cannot be interpreted

### 👤 Profile Detail View
- Full profile card: name, gender, age, age group, country, probability scores
- Shows the UUID and creation timestamp

### 📤 Export (Admin)
- Export the current filtered result set as a CSV file
- Downloads directly to the browser with the filename `profiles_<timestamp>.csv`

### ➕ Create Profile (Admin)
- Form to create a new profile by entering a name
- The backend calls Genderize, Agify, and Nationalize to enrich the data automatically
- New profile appears in the list immediately

### 📥 Import CSV (Admin)
- Upload a CSV file containing up to 500,000 profile rows
- Progress feedback while the upload processes
- Summary response: how many rows were inserted, skipped, and why

### 👤 Account Page
- Displays current user: username, email, avatar, role
- Logout button — clears the session and redirects to login

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | GitHub OAuth via backend (HTTP-only cookies) |
| HTTP Client | fetch / axios |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- The [Insighta Labs+ API](https://github.com/adeneey-dev/insighta-labs-api) running locally or deployed

### Installation

```bash
# Clone the repository
git clone https://github.com/adeneey-dev/insighta-labs-web-portal.git
cd insighta-labs-web-portal

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env.local
# Fill in your values (see Environment Variables section)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
# The URL of your running Insighta Labs+ API
NEXT_PUBLIC_API_URL=https://insighta-labs-api-adeneey-dev178-dlpfhyah.leapcell.dev
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL of the Insighta Labs+ backend API |

> The portal has no database of its own. All data comes from the API. The only
> environment variable it needs is where to find that API.

---

## Authentication

Authentication is handled entirely by the backend. The portal never touches
tokens directly — it cannot, because they are stored in HTTP-only cookies.

### Login Flow

```
1. User clicks "Continue with GitHub"
         ↓
2. Browser navigates to GET /api/auth/github
         ↓
3. Backend redirects to GitHub OAuth consent page
         ↓
4. User approves the app on GitHub
         ↓
5. GitHub redirects to /api/auth/github/callback (on the backend)
         ↓
6. Backend creates/updates the user record
7. Backend issues access token + refresh token as HTTP-only cookies
8. Backend redirects browser to /dashboard on the portal
         ↓
9. Portal reads /api/auth/me to confirm who is logged in
         ↓
10. User lands on the dashboard, fully authenticated
```

### Why HTTP-only Cookies?

Tokens stored in `localStorage` or `sessionStorage` can be read by any
JavaScript running on the page — including injected scripts from XSS attacks.
HTTP-only cookies are invisible to JavaScript entirely. The browser sends them
automatically with every request, but no script can ever read or steal them.

### Session Management

- **Access token:** expires in 3 minutes. The portal handles renewal automatically.
- **Refresh token:** expires in 5 minutes. If the refresh fails, the user is
  redirected to the login page.
- **Logout:** calls `POST /api/auth/logout`, which invalidates the refresh token
  server-side, then clears both cookies.

### CSRF Protection

All state-changing requests (POST, PUT, DELETE) include a CSRF token in the
`X-CSRF-Token` header. The backend sets this token as a readable cookie
(`XSRF-TOKEN`) on every response. The portal reads that cookie and includes it
as a header on every mutating request. Requests without a valid CSRF token are
rejected by the backend.

---

## Role-Based UI

The portal renders different UI elements based on the logged-in user's role,
which it reads from `GET /api/auth/me`.

| Feature | `analyst` | `admin` |
|---|---|---|
| View profiles list | ✅ | ✅ |
| Search profiles | ✅ | ✅ |
| View profile detail | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Create profile | ❌ Hidden | ✅ Visible |
| Import CSV | ❌ Hidden | ✅ Visible |

Admin-only actions are not just visually hidden — the backend enforces the same
role check on every request independently. A user cannot bypass the UI to call
a restricted endpoint.

---

## How It Connects to the Backend

The portal is a pure client of the Insighta Labs+ REST API. It does not have
its own database, its own auth logic, or its own business rules. Everything
goes through the API.

### API Versioning

Every request to `/api/*` includes the required header:
```
X-API-Version: 1
```
Requests without this header are rejected by the backend with a 400 error.

### Making Authenticated Requests

Because tokens are in HTTP-only cookies, the browser sends them automatically.
The portal just needs to use `credentials: 'include'` (or `withCredentials: true`
with axios) on every request:

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`, {
  credentials: 'include',
  headers: {
    'X-API-Version': '1',
    'X-CSRF-Token': getCsrfToken(), // read from XSRF-TOKEN cookie
  },
});
```

### Token Refresh

When the API returns a `401 Unauthorized`, the portal automatically calls
`POST /api/auth/refresh` to get a new token pair, then retries the original
request. If the refresh also fails (both tokens expired), the user is
redirected to the login page.

---

## Security

| Measure | Implementation |
|---|---|
| Tokens invisible to JS | HTTP-only cookies — no `localStorage`, no `sessionStorage` |
| CSRF protection | `XSRF-TOKEN` cookie read by portal, sent as `X-CSRF-Token` header |
| Role enforcement | Backend enforces RBAC independently of what the UI shows |
| HTTPS only | Vercel enforces HTTPS on all deployments |
| No secrets in frontend | The only env variable is the public API URL — no secrets exposed |
| Short token lifetime | Access tokens expire in 3 minutes, limiting the window for token theft |

---

## Project Structure

```
insighta-labs-web-portal/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx        # Login page — GitHub OAuth button
│   │   ├── (portal)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Dashboard with metrics
│   │   │   ├── profiles/
│   │   │   │   ├── page.tsx        # Profiles list with filters
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Profile detail view
│   │   │   ├── search/
│   │   │   │   └── page.tsx        # Natural language search
│   │   │   └── account/
│   │   │       └── page.tsx        # Account info + logout
│   │   └── layout.tsx              # Root layout
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ProfileTable.tsx        # Sortable, paginated profile table
│   │   ├── FilterPanel.tsx         # Gender, age, country filters
│   │   ├── SearchBar.tsx           # NLP search input
│   │   ├── Pagination.tsx          # Page navigation
│   │   └── Navbar.tsx              # Top navigation bar
│   │
│   ├── lib/
│   │   ├── api.ts                  # Centralised API client (fetch wrapper)
│   │   └── auth.ts                 # Auth helpers (CSRF token, me check)
│   │
│   └── types/
│       └── index.ts                # Shared TypeScript types (Profile, User)
│
├── public/                         # Static assets
├── .env.local                      # Local environment variables (not committed)
├── .env.example                    # Template for environment variables
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

---

## Deployment

The portal is deployed on **Vercel** and connects to the Insighta Labs+ API
on **Leapcell**.

### Deploy to Vercel

```bash
# Install the Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set the environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-api-domain.leapcell.dev
```

Or connect your GitHub repository to Vercel for automatic deployments on
every push to `main`.

### Important: CORS & Cookie Settings

For cookies to work cross-origin between Vercel and Leapcell, the backend must
be configured with:
- `credentials: true` in the CORS config
- `sameSite: 'none'` and `secure: true` on the token cookies

These are already configured in the Insighta Labs+ API. You just need to make
sure `FRONTEND_URL` on the backend matches your exact Vercel deployment URL.

---

<div align="center">

Part of the **Insighta Labs+** platform · Built during the Backend Engineering Track

[API Repository](https://github.com/adeneey-dev/insighta-labs-api) · [CLI Repository](https://github.com/adeneey-dev/insighta-labs-cli) · [Web Portal Repository](https://github.com/adeneey-dev/insighta-labs-web-portal)

</div>
