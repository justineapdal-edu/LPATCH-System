# LPATCH System — Documentation Index

> **Stack:** Next.js 16 (App Router) | Tailwind CSS 4 | TypeScript 5 (Strict) | Shadcn UI | Prisma | PostgreSQL
> **Phase:** 1 — Foundation

---

## Visual Map — Find What You Need

```
START HERE
    │
    ├── "How is the system designed?"
    │       └── architecture/overview.md
    │
    ├── "What does the database look like?"
    │   "How do I query patients or sessions?"
    │   "What are the table schemas?"
    │       └── architecture/database.md
    │
    ├── "What fields does the assessment form have?"
    │   "How do I validate patient data?"
    │   "How does frequency/duration become calendar sessions?"
    │   "Can existing patients get re-assessed?"
    │       └── features/patient-management.md
    │
    ├── "What widgets are on the dashboard?"
    │   "How does the weekly calendar auto-populate?"
    │   "How are unassigned sessions displayed?"
    │       └── features/dashboard.md
    │
    ├── "Should this be a Server or Client Component?"
    │   "How do I build the assessment wizard?"
    │   "How does the session scheduler UI work?"
    │   "How is the therapist signature captured?"
    │       └── frontend/component-architecture.md
    │
    └── "What must I never do as an AI assistant?"
        "How do I handle HIPAA-sensitive data?"
        "How should Server Actions be structured?"
        "How do I write tests?"
            └── guidelines/ai-rules.md
```

---

## All Files — One-Line Summaries

| # | File | Summary |
|---|------|---------|
| 1 | [`architecture/overview.md`](./architecture/overview.md) | System boundaries, directory tree with Prisma, ASCII data flow diagram, rendering strategy per route, and Phase 1 in/out scope list. |
| 2 | [`architecture/database.md`](./architecture/database.md) | Prisma schema with 5 tables (Therapist, Patient, Assessment, TherapySession, ProgressNote), JSONB column strategy, indexes, session conflict detection, patient status transitions, signature storage, seeding, and `.env.example`. |
| 3 | [`features/patient-management.md`](./features/patient-management.md) | Complete PT assessment form field map (2 pages, 9 sections, 50+ fields including email/emergency/insurance), TypeScript interfaces (Therapist, Patient, Assessment), Zod schemas, dual assessment flows (new + re-assessment), session auto-generation with completed `getPreferredDayIndices`, conflict detection, and status transition rules. |
| 4 | [`features/dashboard.md`](./features/dashboard.md) | Dashboard layout wireframe, 4 KPI card specs, daily schedule widget with unassigned session handling, weekly calendar with auto-populated sessions, activity feed with 8 activity types, and "Assign Therapist" quick action. |
| 5 | [`frontend/component-architecture.md`](./frontend/component-architecture.md) | Server vs Client decision tree, assessment wizard component hierarchy with signature_pad, SessionScheduler/SessionPreview with nullable therapistId, Shadcn install list + signature_pad package, routing map, prop typing standards, and component size limits. |
| 6 | [`guidelines/ai-rules.md`](./guidelines/ai-rules.md) | 11 sections of hard constraints: no `any`, no inline hex colors, no `localStorage` for PII, HIPAA data handling table, Prisma patterns (singleton, transactions, therapist resolution), Server Action with Prisma + nullable therapist, assessment form validation rules, session scheduler rules, and Vitest + RTL testing conventions. |

---

## Topic Index — Search by Keyword

| Topic | Where to Look |
|-------|---------------|
| **Prisma schema** (tables, columns, relations) | `database.md` §2 |
| **Prisma client singleton** (`lib/db.ts`) | `ai-rules.md` §6 |
| **JSONB columns** (assessment sections) | `database.md` §3 |
| **Session conflict detection** (therapist overlap query) | `database.md` §5, `patient-management.md` §7 |
| **Patient status transitions** (valid state changes) | `database.md` §6, `patient-management.md` §9 |
| **Signature storage** (base64 PNG in JSONB) | `database.md` §7 |
| **Seeding** (sample therapists) | `database.md` §9 |
| **`.env.example`** (DATABASE_URL, Supabase, Vercel) | `database.md` §10, `.env.example` |
| **Therapist interface** (id, name, license, specialization) | `patient-management.md` §2 (`Therapist` interface) |
| **Patient fields** (name, address, DOB, gender, contact, email, occupation, hobbies, emergency contact, insurance) | `patient-management.md` §1, §2 |
| **Medical history** (checkboxes: hypertension, diabetes, etc.) | `patient-management.md` §1, §2 (`MedicalHistory` interface) |
| **Physical examination** (posture, gait, ROM, muscle strength, joint integrity, neuro, special tests) | `patient-management.md` §1, §2 (`PhysicalExamination` interface) |
| **Presenting complaint** (symptoms, onset, aggravating factors, pain scale 0-10, functional limitations) | `patient-management.md` §1, §2 (`PresentingComplaint` interface) |
| **Functional assessment** (ADLs, mobility, balance, assistive devices, work limitations) | `patient-management.md` §1, §2 (`FunctionalAssessment` interface) |
| **Assessment summary** (clinical impression, PT diagnosis, prognosis, goals) | `patient-management.md` §1, §2 (`AssessmentSummary` interface) |
| **Treatment plan** (frequency, duration, modalities, exercises, manual therapy, HEP, education) | `patient-management.md` §1, §2 (`TreatmentPlan` interface) |
| **Therapist notes** (initial response, recommendations, follow-up date) | `patient-management.md` §1, §2 (`TherapistNotes` interface) |
| **Therapist on duty** (name, license #, date, signature base64) | `patient-management.md` §1, §2 (`TherapistOnDuty` interface) |
| **Zod validation schemas** | `patient-management.md` §3 (`assessmentSchema`, `page1Schema`, `page2Schema`) |
| **Session frequency/duration input** (fixed dropdown: 30/45/60/90 min) | `patient-management.md` §7 (`FrequencyDuration`, `generateSessions()`) |
| **Session auto-generation** (frequency → calendar dates) | `patient-management.md` §7, `dashboard.md` §4, §8 |
| **`getPreferredDayIndices`** (day spreading logic) | `patient-management.md` §7 |
| **Multi-step wizard** (8 steps, per-step validation) | `patient-management.md` §6, `component-architecture.md` §4 |
| **Dual assessment flows** (new patient + re-assessment) | `patient-management.md` §6 |
| **assessmentNumber** (increments per patient) | `patient-management.md` §2, §6 |
| **Nullable therapistId** (unassigned sessions allowed) | `patient-management.md` §2, `database.md` §2 |
| **Dashboard KPIs** (active patients, sessions today, pending, retention) | `dashboard.md` §2 |
| **Daily schedule widget** (session progress "5/24", unassigned handling) | `dashboard.md` §3 |
| **Weekly calendar** (auto-populated, drag-reschedule) | `dashboard.md` §4 |
| **Activity feed** (8 activity types, description templates) | `dashboard.md` §5 |
| **Assign Therapist** action | `dashboard.md` §6 |
| **Server vs Client Components** | `component-architecture.md` §2 (decision tree) |
| **SessionScheduler component** (frequency select, duration select, preview) | `component-architecture.md` §5 |
| **SessionPreview component** (shows therapist assignment status) | `component-architecture.md` §5 |
| **TherapistSignatureBlock** (signature_pad canvas) | `component-architecture.md` §4 |
| **`signature_pad`** npm package | `component-architecture.md` §6 |
| **Shadcn components** (full install list) | `component-architecture.md` §6 |
| **Routing map** (7 routes, rendering types) | `component-architecture.md` §3 |
| **Component size limits** (max lines per type) | `component-architecture.md` §9 |
| **TypeScript rules** (no `any`, no `enum`, no `React.FC`) | `ai-rules.md` §1 |
| **Tailwind rules** (tokens only, no hex, `cn()` for merging) | `ai-rules.md` §2 |
| **Server Action pattern** (validate → mutate → revalidate) | `ai-rules.md` §4 |
| **Prisma patterns** (singleton, transactions, therapist resolution) | `ai-rules.md` §6 |
| **HIPAA guardrails** (no PII in logs, localStorage, URLs) | `ai-rules.md` §5 |
| **Assessment form rules** (step validation, state preservation) | `ai-rules.md` §7 |
| **Session scheduler rules** (no past dates, 52-week cap, no overlaps) | `ai-rules.md` §10 |
| **Testing** (Vitest + RTL, co-located `__tests__/` dirs) | `ai-rules.md` §11 |

---

## Quick Reference

### Directory Structure
```
lpatch-system/
├── prisma/                        # Prisma schema + migrations + seed
├── app/                           # Next.js App Router
│   ├── dashboard/                 # KPIs + schedule + calendar
│   ├── patients/                  # Directory, profiles, assessments
│   │   ├── [id]/assessment/       # Assessment wizard (Client)
│   │   ├── [id]/sessions/         # Patient sessions (Server)
│   │   └── new/                   # New patient intake (Client)
│   └── schedule/                  # Full clinic calendar
├── components/
│   ├── assessments/               # Wizard + step components
│   ├── dashboard/                 # KPI cards, schedule, activity
│   ├── patients/                  # Cards, filters, profile views
│   ├── schedule/                  # Scheduler, calendar, preview
│   └── ui/                        # Shadcn primitives
├── hooks/                         # Custom React hooks
├── lib/
│   ├── actions/                   # Server Actions
│   ├── db.ts                      # Prisma client singleton
│   ├── scheduler/                 # Session generation logic
│   ├── validations/               # Zod schemas
│   └── utils.ts                   # cn(), formatDate(), etc.
├── types/                         # Shared TypeScript interfaces
├── docs/                          # This documentation
├── .env.example                   # Environment variable template
└── .cursorrules                   # AI tool entry point
```

### Core Data Flow
```
Assessment Form → Zod Validation → Server Action → Prisma → Database
                                                                │
                                                    $transaction
                                            ┌──────────┼──────────┐
                                            ▼          ▼          ▼
                                        Patient   Assessment  Sessions
                                                   (JSONB)   (unassigned)
                                                                │
                                                                ▼
                                                      generateSessions()
                                                                │
                                                                ▼
                                            therapy_sessions rows created
                                                    (therapistId = null)
                                                                │
                                            ┌───────────┼───────────┐
                                            ▼           ▼           ▼
                                      Dashboard     Calendar    Patient Profile
                                      Daily Schedule Weekly View  Sessions Tab
```
