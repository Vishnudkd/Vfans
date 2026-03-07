# VFans Media - Product Requirements Document

## Original Problem Statement
Build the "VFans Media" application - a multi-tenant creator platform where users create organizations, manage creator profiles, and sell digital content via paid links using Stripe.

## Core Architecture
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Integrations**: Resend (email), Stripe (payments)
- **Structure**: User -> Organization -> Creator -> Links

## What's Been Implemented

### Phase 1: Authentication & Onboarding
- User signup/login with JWT tokens
- Email verification via Resend API
- Demo user (demo@vfans.com/demo) with auto-reset
- Organization creation flow, Creator profile creation

### Phase 2: Dashboard & Creator Pages
- Creator dashboard with sidebar navigation
- Links, Analytics, Customers, Transactions pages (placeholder data)
- Wallet page, Multi-creator sidebar

### Phase 3: Link Creation & Payments (Completed Mar 7, 2026)
- **Multi-File Upload**: Up to 10 images / 3 videos, total max 10 files
- **Blurred Preview**: Backend generates blurred previews, served at /api/uploads/
- **Create Link Form**: Multi-file drag-and-drop, min price $5.99, blur level, short link
- **Stripe Integration**: Checkout session → payment → success page
- **Public Link Page** (/l/{slug}): SeeIt.co-style design with blurred hero, lock overlay, creator info, file tags, email input, "Unlock" button, trust badges
- **Sandboxed Content Access**: After purchase, content shown inline via temporary sandbox tokens
  - `/api/sandbox/{token}/{file_index}` serves files via FileResponse
  - Original file paths NEVER exposed to buyers
  - Tokens auto-expire after 24 hours
  - Background cleanup task removes expired records hourly
- **Links Page**: Copy link (toast), View, Toggle, Delete actions

## Key API Endpoints
- `POST /api/upload` - File upload with Form() params
- `POST /api/creators/{id}/links` - Create link with files array
- `GET /api/links/by-slug/{slug}` - Public link with creator info
- `POST /api/links/{id}/checkout` - Create Stripe checkout session
- `GET /api/purchases/verify/{session_id}` - Verify purchase, create sandbox access
- `GET /api/sandbox/{token}/{file_index}` - Serve purchased content (24h expiry)

## Pending Tasks

### P2: Wallet & Withdrawal
- Build "Request Withdrawal" UI with admin notification flow

### P3: Data-Driven Pages
- Connect Analytics, Customers, Transactions pages to real backend data
- Dashboard stats from real data

### Future
- Admin panel for withdrawal processing
- Enhanced analytics with charts
- Open Graph meta tags for social sharing

## Credentials
- Demo: demo@vfans.com / demo
- Stripe test keys in backend .env
- Resend API key in backend .env
