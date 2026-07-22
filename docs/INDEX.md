# LPATCH System — Documentation Index

> **Stack:** Next.js 16 (App Router) | Tailwind CSS 4 | TypeScript 5 (Strict) | Shadcn UI
> **Phase:** 1 — Foundation

---

## Visual Map — Find What You Need

```
START HERE
    │
    ├── "How is the system designed?"
    │       └── architecture/overview.md
    │
    ├── "What fields does the assessment form have?"
    │   "How do I validate patient data?"
    │   "How does frequency/duration become calendar sessions?"
    │       └── features/patient-management.md
    │
    ├── "What widgets are on the dashboard?"
    │   "How does the weekly calendar auto-populate?"
    │       └── features/dashboard.md
    │
    ├── "Should this be a Server or Client Component?"
    │   "How do I build the assessment wizard?"
    │   "How does the session scheduler UI work?"
    │       └── frontend/component-architecture.md
    │
    └── "What must I never do as an AI assistant?"
        "How do I handle HIPAA-sensitive data?"
        "How should Server Actions be structured?"
            └── guidelines/ai-rules.md
```

---

## All Files — One-Line Summaries

| # | File | Summary |
|---|------|---------|
| 1 | [`architecture/overview.md`](./architecture/overview.md) | System boundaries, directory tree, ASCII data flow diagram, rendering strategy per route, and Phase 1 in/out scope list. |
| 2 | [`features/patient-management.md`](./features/patient-management.md) | Complete PT assessment form field map (2 pages, 9 sections, 50+ fields), TypeScript interfaces, Zod schemas, multi-page wizard flow, and session auto-generation from frequency/duration input. |
| 3 | [`features/dashboard.md`](./features/dashboard.md) | Dashboard layout wireframe, 4 KPI card specs, daily schedule widget with session progress, weekly calendar with auto-populated sessions, activity feed types, and data fetching strategy. |
| 4 | [`frontend/component-architecture.md`](./frontend/component-architecture.md) | Server vs Client decision tree, assessment wizard component hierarchy, SessionScheduler/SessionPreview interfaces, Shadcn install list, routing map, prop typing standards, and component size limits. |
| 5 | [`guidelines/ai-rules.md`](./guidelines/ai-rules.md) | 10 sections of hard constraints: no `any`, no inline hex colors, no `localStorage` for PII, HIPAA data handling table, Server Action pattern, assessment form validation rules, and session scheduler do/don't. |

---

## Topic Index — Search by Keyword

| Topic | Where to Look |
|-------|---------------|
| **Patient fields** (full name, address, DOB, gender, contact, occupation, hobbies, referring doctor) | `patient-management.md` §1, §2 |
| **Medical history** (checkboxes: hypertension, diabetes, etc.) | `patient-management.md` §1, §2 (`MedicalHistory` interface) |
| **Physical examination** (posture, gait, ROM, muscle strength, joint integrity, neuro, special tests) | `patient-management.md` §1, §2 (`PhysicalExamination` interface) |
| **Presenting complaint** (symptoms, onset, aggravating factors, pain scale 0-10, functional limitations) | `patient-management.md` §1, §2 (`PresentingComplaint` interface) |
| **Functional assessment** (ADLs, mobility, balance, assistive devices, work limitations) | `patient-management.md` §1, §2 (`FunctionalAssessment` interface) |
| **Assessment summary** (clinical impression, PT diagnosis, prognosis, goals) | `patient-management.md` §1, §2 (`AssessmentSummary` interface) |
| **Treatment plan** (frequency, duration, modalities, exercises, manual therapy, HEP, education) | `patient-management.md` §1, §2 (`TreatmentPlan` interface) |
| **Therapist notes** (initial response, recommendations, follow-up date) | `patient-management.md` §1, §2 (`TherapistNotes` interface) |
| **Therapist on duty** (name, license #, date) | `patient-management.md` §1, §2 (`TherapistOnDuty` interface) |
| **Zod validation schemas** | `patient-management.md` §3 (`assessmentSchema`, `page1Schema`, `page2Schema`) |
| **Session frequency/duration input** | `patient-management.md` §7 (`FrequencyDuration`, `generateSessions()`) |
| **Session auto-generation** (frequency → calendar dates) | `patient-management.md` §7, `dashboard.md` §4, §8 |
| **Multi-step wizard** (8 steps, per-step validation) | `patient-management.md` §6, `component-architecture.md` §4 |
| **Dashboard KPIs** (active patients, sessions today, pending, retention) | `dashboard.md` §2 |
| **Daily schedule widget** (session progress "5/24", status colors) | `dashboard.md` §3 |
| **Weekly calendar** (auto-populated, drag-reschedule) | `dashboard.md` §4 |
| **Activity feed** (7 activity types, description templates) | `dashboard.md` §5 |
| **Server vs Client Components** | `component-architecture.md` §2 (decision tree) |
| **SessionScheduler component** (frequency select, duration select, preview) | `component-architecture.md` §5 |
| **Shadcn components** (full install list) | `component-architecture.md` §6 |
| **Routing map** (7 routes, rendering types) | `component-architecture.md` §3 |
| **TypeScript rules** (no `any`, no `enum`, no `React.FC`) | `ai-rules.md` §1 |
| **Tailwind rules** (tokens only, no hex, `cn()` for merging) | `ai-rules.md` §2 |
| **Server Action pattern** (validate → mutate → revalidate) | `ai-rules.md` §4 |
| **HIPAA guardrails** (no PII in logs, localStorage, URLs) | `ai-rules.md` §5 |
| **Assessment form rules** (step validation, state preservation) | `ai-rules.md` §6 |
| **Session scheduler rules** (no past dates, 52-week cap, no overlaps) | `ai-rules.md` §10 |

---

## Quick Reference

### Directory Structure
```
lpatch-system/
├── app/                         # Next.js App Router
│   ├── dashboard/               # KPIs + schedule + calendar
│   ├── patients/                # Directory, profiles, assessments
│   └── schedule/                # Full clinic calendar
├── components/
│   ├── assessments/             # Wizard + step components
│   ├── dashboard/               # KPI cards, schedule, activity
│   ├── patients/                # Cards, filters, profile views
│   ├── schedule/                # Scheduler, calendar, preview
│   └── ui/                      # Shadcn primitives
├── hooks/                       # Custom React hooks
├── lib/
│   ├── actions/                 # Server Actions
│   ├── scheduler/               # Session generation logic
│   ├── validations/             # Zod schemas
│   └── utils.ts                 # cn(), formatDate(), etc.
├── types/                       # Shared TypeScript interfaces
└── docs/                        # This documentation
```

### Core Data Flow
```
Assessment Form → Zod Validation → Server Action → Database
                                                        │
                                                        ▼
                                          generateSessions()
                                                        │
                                                        ▼
                                    therapy_sessions rows created
                                        ┌───────────────┼───────────────┐
                                        ▼               ▼               ▼
                                  Dashboard       Calendar        Patient Profile
                                  Daily Schedule  Weekly View     Sessions Tab
```
