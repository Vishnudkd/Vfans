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
- Organization creation flow
- Creator profile creation

### Phase 2: Dashboard & Creator Pages
- Creator dashboard with sidebar navigation
- Links, Analytics, Customers, Transactions pages (placeholder data)
- Wallet page with real data from backend
- Multi-creator sidebar with expand/collapse

### Phase 3: Link Creation & Payments (Completed Mar 7, 2026)
- **Multi-File Upload**: Up to 10 images / 3 videos, total max 10 files per link
- **Blurred Preview**: Backend generates blurred previews for images, served at /api/uploads/
- **Link CRUD**: Create, list, update, delete, toggle active status
- **Create Link Form**: Multi-file drag-and-drop upload, title, description, price (min $5.99), blur level, short link, fee settings
- **Stripe Integration**: Checkout session creation, webhook handling, purchase verification
- **Public Link Page** (/l/{slug}): SeeIt.co-style design with blurred hero, lock overlay, creator info, file tags, email input, "Unlock for $X.XX" button, trust badges
- **Payment Success Page**: Verifies purchase via session_id, shows download button
- **Links Page**: List view with Copy link (toast), View, Toggle, Delete actions
- **Static File Serving**: Files served via /api/uploads/ for proper ingress routing

## Key Routes
- `/l/:shortLink` - Public link purchase page
- `/purchase/success` - Payment success/download page
- `/creator/:creatorId/links` - Creator's links list
- `/creator/:creatorId/links/create` - Create new link form
- `/wallet` - Organization wallet

## Pending Tasks

### P2: Wallet & Withdrawal
- Build "Request Withdrawal" UI with admin notification flow
- Payout method setup

### P3: Data-Driven Pages
- Connect Analytics page to real backend data
- Connect Customers page to real purchases data
- Connect Transactions page to real transactions data
- Dashboard stats from real data

### Future
- Admin panel for withdrawal processing
- Enhanced analytics with charts
- Member management
- Content provider agreement flow
- Open Graph meta tags for link sharing previews

## Credentials
- Demo: demo@vfans.com / demo
- Stripe test keys configured in backend .env
- Resend API key configured in backend .env
