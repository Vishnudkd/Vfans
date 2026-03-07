# VFans Media - Product Requirements Document

## Original Problem Statement
Build "VFans Media" - a multi-tenant creator platform where users create organizations, manage creator profiles, and sell digital content via paid links using Stripe.

## Core Architecture
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Integrations**: Resend (email), Stripe (payments)
- **Structure**: User -> Organization -> Creator -> Links

## Implemented Features

### Phase 1: Auth & Onboarding
- JWT auth, email verification, demo user, org/creator creation

### Phase 2: Dashboard & Creator Pages
- Sidebar navigation, multi-creator support

### Phase 3: Link Creation & Payments (Mar 7, 2026)
- Multi-file upload (10 img / 3 vid, max 10), metadata stripping, file renaming
- Blurred preview for images + videos (ffmpeg first-frame extraction)
- Stripe checkout + sandboxed content access (24h expiry tokens)
- Glassmorphism public link page + success page

### Phase 3 - P3: Data-Driven Pages (Mar 7, 2026)
- Dashboard: Real stats (earnings, views, sales, customers, links)
- Analytics: Top links, top customers, conversion rate
- Customers: Searchable table with purchase history
- Transactions: Searchable/filterable table with status badges

## Key API Endpoints
- `POST /api/upload` - Multi-file upload with metadata strip + preview gen
- `POST /api/creators/{id}/links` - Create link with files array + auto-rename
- `GET /api/links/by-slug/{slug}` - Public link with creator info + on-the-fly video preview
- `POST /api/links/{id}/checkout` - Stripe checkout (handles empty description)
- `GET /api/purchases/verify/{session_id}` - Verify + sandbox access creation
- `GET /api/sandbox/{token}/{file_index}` - Serve content (24h expiry)
- `GET /api/creators/{id}/stats` - Dashboard summary stats
- `GET /api/creators/{id}/analytics` - Analytics data
- `GET /api/creators/{id}/customers` - Customer list
- `GET /api/creators/{id}/transactions` - Transaction list

## Pending Tasks
- P2: Wallet withdrawal request flow
- Admin panel for processing withdrawals
- Open Graph meta tags for social sharing

## Credentials
- Demo: demo@vfans.com / demo
- Stripe test keys + Resend API key in backend .env
