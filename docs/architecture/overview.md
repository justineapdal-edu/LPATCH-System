# System Architecture Overview

> **Stack:** Next.js 16 (App Router) | Tailwind CSS 4 | TypeScript 5 Strict | Shadcn UI

---

## 1. System Boundaries

The LPATCH system is a **single-page application** (SPA) built on Next.js App Router with server-side rendering capabilities. It manages physical therapy patient data, session tracking, and clinic operations.

### What This System IS
- A dashboard for viewing clinic KPIs and daily operations
- A patient directory with detailed profile views
- An admin interface for onboarding patients and assigning treatment plans
- A session/progress tracking system for therapists

### What This System IS NOT (Phase 1)
- NOT a billing or insurance claims system
- NOT a telehealth or video conferencing platform
- NOT a mobile app (responsive web only)
- NOT integrated with external EHR/EMR systems
- NOT a multi-tenant SaaS (single clinic deployment)

---

## 2. Directory Structure

```
lpatch-system/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers, theme, shell)
│   ├── page.tsx                  # Root redirect to /dashboard
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard view (Server Component)
│   │   └── loading.tsx           # Suspense fallback
│   ├── patients/
│   │   ├── page.tsx              # Patient directory (Server Component)
│   │   ├── loading.tsx           # Suspense fallback
│   │   ├── [id]/
│   │   │   ├── page.tsx          # Patient profile (Server Component)
│   │   │   └── loading.tsx       # Suspense fallback
│   │   └── new/
│   │       └── page.tsx          # New patient form (Client Component)
│   └── globals.css               # Tailwind base + CSS variables
├── components/
│   ├── ui/                       # Shadcn UI primitives (Button, Input, Dialog, etc.)
│   ├── dashboard/                # Dashboard-specific widgets
│   ├── patients/                 # Patient-specific components
│   └── layout/                   # Shell components (Sidebar, Navbar, etc.)
├── lib/
│   ├── actions/                  # Server Actions (patient CRUD, session management)
│   ├── db/                       # Database client and queries
│   ├── validations/              # Zod schemas for all forms
│   └── utils.ts                  # Shared utility functions (cn, formatDate, etc.)
├── types/
│   ├── patient.ts                # Patient, TherapySession, ProgressNote interfaces
│   ├── dashboard.ts              # Dashboard KPI and widget types
│   └── index.ts                  # Re-exports
├── public/                       # Static assets (logos, icons)
└── docs/                         # This documentation
```

---

## 3. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  React Component │    │  React Component │                   │
│  │  (Server Comp.)  │    │  (Client Comp.)  │                   │
│  │  Renders HTML    │    │  Handles Events  │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                             │
│           │ SSR/SSG               │ Client-side                  │
│           │                       │                             │
└───────────┼───────────────────────┼─────────────────────────────┘
            │                       │
            ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Node.js)                     │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Page Component  │    │  Server Action   │                   │
│  │  (Server Comp.)  │    │  (use server)    │                   │
│  │  Fetches data    │    │  Mutates data    │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                             │
│           │                       │                             │
│           ▼                       ▼                             │
│  ┌──────────────────────────────────────────┐                   │
│  │           Database Layer (lib/db/)       │                   │
│  │           Prisma / Drizzle / Raw SQL     │                   │
│  └──────────────────┬───────────────────────┘                   │
│                     │                                           │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (PostgreSQL)                       │
│                                                                 │
│  patients │ therapy_sessions │ progress_notes │ treatment_plans │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Rendering Strategy

| Route | Rendering | Rationale |
|-------|-----------|-----------|
| `/dashboard` | **Server Component** | KPI data fetched server-side for performance and SEO |
| `/patients` | **Server Component** | Patient list fetched server-side, filtered via URL search params |
| `/patients/[id]` | **Server Component** | Patient profile data fetched server-side |
| `/patients/new` | **Client Component** | Form with real-time validation and interactive state |

### Component Rendering Rules
- **Default to Server Components** - Only add `'use client'` when the component requires browser APIs, event handlers, or React state/effects.
- **Lift Client boundaries down** - Keep `'use client'` as close to the leaves of the component tree as possible.
- **Server Actions for mutations** - Never use `fetch()` to API routes from client components for data mutations. Use Server Actions via `formAction` or `startTransition`.

---

## 5. Phase 1 Scope

### IN-SCOPE
- [ ] Dashboard with KPI widgets (active patients, sessions today, pending appointments)
- [ ] Patient directory with search and filter
- [ ] Individual patient profile view (history, sessions, notes)
- [ ] New patient onboarding form with validation
- [ ] Treatment plan assignment during onboarding
- [ ] Therapy session history per patient
- [ ] Progress notes per session
- [ ] Basic scheduling view (daily/weekly calendar)
- [ ] Responsive layout (desktop-first, mobile-compatible)

### OUT-OF-SCOPE (Future Phases)
- [ ] Authentication / authorization (Phase 2)
- [ ] Role-based access control (therapist vs. admin vs. staff) (Phase 2)
- [ ] Billing and insurance integration (Phase 3)
- [ ] Telehealth/video session integration (Phase 3)
- [ ] Patient portal (patient-facing login) (Phase 3)
- [ ] Reporting and analytics exports (Phase 2)
- [ ] Multi-clinic / multi-tenant support (Phase 4)
- [ ] Mobile app (React Native) (Phase 4)

---

## 6. Technology Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| **Framework** | Next.js 16 App Router | Server Components, Server Actions, file-based routing |
| **Styling** | Tailwind CSS 4 | Utility-first, consistent design tokens |
| **UI Kit** | Shadcn UI | Accessible, copy-paste components, Tailwind-native |
| **Language** | TypeScript 5 Strict | Type safety, IDE support, compile-time error detection |
| **Validation** | Zod | Co-located schemas, runtime + static type inference |
| **Database** | PostgreSQL (TBD ORM) | Relational data, ACID compliance for patient data |
| **State Mgmt** | React Server Components + URL state | Minimize client-side state, use search params for filters |
