# Component Architecture

> Rules for Next.js App Router layout, Server vs Client components, Shadcn/Tailwind conventions, assessment form components, and session scheduler UI.

---

## 1. App Router Layout Rules

### Root Layout (`app/layout.tsx`)

```typescript
// Server Component (default)
// Wraps ALL pages with shared providers and shell

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

### AppShell Component

```typescript
// components/layout/app-shell.tsx
// Client Component — handles sidebar state, mobile menu

'use client';

import { useState } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

---

## 2. Server vs Client Components

### Decision Tree

```
Does the component need:
  ├─ useState / useEffect / useRef?         → CLIENT ('use client')
  ├─ Event handlers (onClick, onChange)?    → CLIENT ('use client')
  ├─ Browser APIs (window, document)?      → CLIENT ('use client')
  ├─ Web APIs (localStorage, fetch)?       → CLIENT ('use client')
  ├─ React context (useContext)?           → CLIENT ('use client')
  ├─ Third-party client library?           → CLIENT ('use client')
  └─ None of the above?                    → SERVER (default)
```

### Rules

| Rule | Detail |
|------|--------|
| **Default to Server** | Every component starts as a Server Component unless explicitly marked `'use client'` |
| **Push `'use client'` down** | Never add `'use client'` at the page level if only a child needs it |
| **Server Actions for mutations** | Client Components call Server Actions, never `fetch()` to API routes |
| **Server Components can import Client** | A Server Component can render a Client Component as a child |
| **Client Components cannot import Server** | A Client Component cannot import a Server Component directly |
| **Data flows down** | Pass fetched data as props from Server → Client, never the reverse |

### Example: Assessment Page with Interactive Children

```typescript
// app/patients/[id]/page.tsx — SERVER COMPONENT
import { AssessmentView } from '@/components/assessments/assessment-view';
import { SessionCalendar } from '@/components/schedule/session-calendar';

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatientById(id);
  const assessment = await getLatestAssessment(id);
  const sessions = await getPatientSessions(id);

  return (
    <div>
      {/* Server-rendered header */}
      <PatientHeader patient={patient} />

      {/* Client Component — tab switching + interactive calendar */}
      <AssessmentView assessment={assessment} />
      <SessionCalendar sessions={sessions} patientId={id} />
    </div>
  );
}
```

---

## 3. Routing Map

```
/app
├── layout.tsx                    Root layout (AppShell)
├── page.tsx                      Redirect → /dashboard
│
├── dashboard/
│   ├── page.tsx                  Dashboard (Server Component)
│   └── loading.tsx               Dashboard skeleton
│
├── patients/
│   ├── page.tsx                  Patient directory (Server Component)
│   ├── loading.tsx               Directory skeleton
│   ├── [id]/
│   │   ├── page.tsx              Patient profile (Server Component)
│   │   ├── loading.tsx           Profile skeleton
│   │   ├── assessment/
│   │   │   └── page.tsx          Assessment form wizard (Client Component)
│   │   └── sessions/
│   │       └── page.tsx          Patient sessions calendar (Server Component)
│   └── new/
│       └── page.tsx              New patient intake wizard (Client Component)
│
├── schedule/
│   ├── page.tsx                  Full clinic calendar (Server Component)
│   └── loading.tsx               Calendar skeleton
│
└── not-found.tsx                 Global 404 page
```

### Route Conventions

| Pattern | Purpose | Rendering |
|---------|---------|-----------|
| `/dashboard` | Main dashboard | Server Component |
| `/patients` | Patient directory | Server Component |
| `/patients/[id]` | Patient profile | Server Component |
| `/patients/[id]/assessment` | Assessment form wizard | Client Component |
| `/patients/[id]/sessions` | Patient session calendar | Server Component |
| `/patients/new` | New patient intake | Client Component |
| `/schedule` | Full clinic calendar | Server Component |

---

## 4. Assessment Form Component Tree

The assessment form is a **multi-step wizard** with Client Component state management.

### Component Hierarchy

```
AssessmentWizard (Client Component — manages step state)
├── StepIndicator (Client Component — shows current step)
├── Step 1: PatientInfoStep
│   ├── TextField (Shadcn Input)
│   ├── DatePicker (Shadcn Calendar)
│   └── Select (Shadcn Select — gender)
├── Step 2: MedicalHistoryStep
│   ├── CheckboxGroup (6 medical condition checkboxes)
│   └── TextareaGroup (4 text fields)
├── Step 3: PhysicalExamStep
│   └── TextField × 7 (posture, gait, ROM, etc.)
├── Step 4: PresentingComplaintStep
│   ├── Textarea × 2
│   ├── TextField × 2
│   └── PainScaleSlider (Client Component — 0-10 range input)
├── Step 5: FunctionalAssessmentStep
│   ├── Textarea × 2
│   └── TextField × 3
├── Step 6: AssessmentSummaryStep
│   └── Textarea × 4
├── Step 7: TreatmentPlanStep
│   ├── SessionScheduler (Client Component — frequency/duration picker)
│   │   ├── FrequencySelect
│   │   ├── DurationSelect
│   │   ├── WeekCounter
│   │   ├── TimeOfDaySelect
│   │   ├── DatePicker (start date)
│   │   └── SessionPreview (computed session list)
│   └── Textarea × 5
├── Step 8: TherapistNotesStep
│   ├── Textarea × 2
│   ├── DatePicker (follow-up)
│   └── TherapistSignatureBlock
│       ├── TextField (name — auto-fill from logged-in therapist, Phase 2)
│       ├── TextField (license # — validated against Therapist table)
│       ├── DatePicker (date)
│       └── SignaturePad (canvas drawing, 300x150px, base64 PNG output)
└── StepNavigation (Client Component — Previous/Next/Submit)
```

### Wizard State Management

```typescript
// components/assessments/assessment-wizard.tsx
'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { createAssessment } from '@/lib/actions/create-assessment';
import { page1Schema, page2Schema, assessmentSchema } from '@/lib/validations/assessment';
import type { Page1Input, Page2Input, AssessmentInput } from '@/types/patient';

const TOTAL_STEPS = 8;

export function AssessmentWizard({ patientId }: { patientId?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AssessmentInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, formAction, isPending] = useActionState(createAssessment, null);

  function validateCurrentStep(): boolean {
    // Steps 1-5 validated against page1Schema (partial)
    // Steps 6-8 validated against page2Schema (partial)
    // ...
  }

  function handleNext() {
    if (validateCurrentStep()) {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  }

  function handlePrevious() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    // Full schema validation before submission
    const result = assessmentSchema.safeParse(formData);
    if (!result.success) {
      // Map Zod errors to field-level errors
      return;
    }
    formAction(result.data);
  }

  return (
    <form action={formAction}>
      <StepIndicator current={currentStep} total={TOTAL_STEPS} />
      <StepContent step={currentStep} data={formData} errors={errors} />
      <StepNavigation
        current={currentStep}
        total={TOTAL_STEPS}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </form>
  );
}
```

---

## 5. Session Scheduler Component

### Component Tree

```
SessionScheduler (Client Component)
├── FrequencySelect (Shadcn Select — 1x/week, 2x/week, etc.)
├── DurationSelect (Shadcn Select — 30, 45, 60, 90 min)
├── WeekCounter (NumberInput — 1-52 weeks)
├── TimeOfDaySelect (Shadcn Select — morning, afternoon, evening, any)
├── DatePicker (Shadcn Calendar — start date)
└── SessionPreview (Client Component — computed list)
    ├── TotalSessionCount ("24 sessions")
    ├── TotalDuration ("18 hours")
    └── WeekBreakdown (list of computed dates)
```

### SessionScheduler Interface

```typescript
// components/schedule/session-scheduler.tsx
'use client';

import { useState, useMemo } from 'react';
import { generateSessions } from '@/lib/scheduler/generate-sessions';
import type { FrequencyDuration, SessionFrequency, SessionDuration } from '@/types/patient';

interface SessionSchedulerProps {
  value: FrequencyDuration;
  onChange: (value: FrequencyDuration) => void;
  errors?: Record<string, string>;
  /** null = unassigned (default for new assessments) */
  assignedTherapistId?: string | null;
}

export function SessionScheduler({ value, onChange, errors, assignedTherapistId }: SessionSchedulerProps) {
  const preview = useMemo(() => generateSessions(value), [value]);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Session Schedule</h3>

      <div className="grid grid-cols-2 gap-4">
        <FrequencySelect
          value={value.frequency}
          onChange={(frequency) => onChange({ ...value, frequency })}
          error={errors?.["frequencyDuration.frequency"]}
        />
        <DurationSelect
          value={value.durationMinutes}
          onChange={(durationMinutes) => onChange({ ...value, durationMinutes })}
          error={errors?.["frequencyDuration.durationMinutes"]}
        />
        <WeekCounter
          value={value.totalWeeks}
          onChange={(totalWeeks) => onChange({ ...value, totalWeeks })}
          error={errors?.["frequencyDuration.totalWeeks"]}
        />
        <TimeOfDaySelect
          value={value.preferredTimeOfDay}
          onChange={(preferredTimeOfDay) => onChange({ ...value, preferredTimeOfDay })}
          error={errors?.["frequencyDuration.preferredTimeOfDay"]}
        />
      </div>

      <DatePicker
        value={value.startDate}
        onChange={(startDate) => onChange({ ...value, startDate })}
        error={errors?.["frequencyDuration.startDate"]}
      />

      <SessionPreview
        sessions={preview}
        assignedTherapistId={assignedTherapistId}
      />
    </div>
  );
}
```

### SessionPreview Component

```typescript
// components/schedule/session-preview.tsx

interface SessionPreviewProps {
  sessions: Array<{ scheduledAt: Date; durationMinutes: number; sessionNumber: number }>;
  assignedTherapistId?: string | null;
}

export function SessionPreview({ sessions, assignedTherapistId }: SessionPreviewProps) {
  const totalMinutes = sessions.length * (sessions[0]?.durationMinutes ?? 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMin = totalMinutes % 60;

  // Group sessions by week
  const weekMap = new Map<number, typeof sessions>();
  sessions.forEach((s) => {
    const weekNum = Math.ceil(s.sessionNumber / 3); // Adjust based on frequency
    const weekSessions = weekMap.get(weekNum) ?? [];
    weekSessions.push(s);
    weekMap.set(weekNum, weekSessions);
  });

  return (
    <div className="rounded-md bg-muted p-3 text-sm">
      <p className="font-medium">
        PREVIEW: {sessions.length} sessions scheduled
      </p>
      <p className="text-muted-foreground">
        Therapist: {assignedTherapistId ? "Assigned" : "Unassigned (assign later)"}
      </p>
      <div className="mt-2 max-h-40 overflow-y-auto">
        {Array.from(weekMap.entries()).map(([week, weekSessions]) => (
          <div key={week}>
            Week {week}: {weekSessions.map((s) =>
              new Date(s.scheduledAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", weekday: "short"
              })
            ).join(" · ")}
          </div>
        ))}
      </div>
      <p className="mt-2 text-muted-foreground">
        Total: {sessions.length} sessions × {sessions[0]?.durationMinutes} min = {totalHours}h {remainingMin}m
      </p>
    </div>
  );
}
```

---

## 6. Shadcn UI / Tailwind Design System

### Shadcn Component Installation

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add skeleton
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add slider
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add textarea
```

### Additional NPM Packages
```bash
npm install signature_pad    # Canvas-based signature capture
```

### Tailwind Rules

| Rule | Example |
|------|---------|
| **Use theme tokens only** | `bg-primary`, `text-muted-foreground` — NEVER `bg-blue-500` |
| **Use `cn()` for merging** | `cn("base-class", conditional && "conditional-class", className)` |
| **Consistent spacing** | Use Tailwind spacing scale: `p-4`, `gap-6`, `space-y-4` |
| **Responsive prefixes** | `md:grid-cols-2`, `lg:grid-cols-4` |
| **Dark mode via CSS vars** | All colors defined as CSS variables in `globals.css` |

---

## 7. TypeScript Prop Typing Standards

### Component Props Convention

```typescript
// Always use interface for component props
// Always prefix with component name

interface PatientCardProps {
  patient: Patient;
  onSelect?: (patientId: string) => void;
  className?: string;
}

export function PatientCard({ patient, onSelect, className }: PatientCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      {/* ... */}
    </div>
  );
}
```

### Prop Rules

| Rule | Detail |
|------|--------|
| **Always type props** | Never use `any` for props |
| **Optional with `?`** | `onSelect?: (id: string) => void` |
| **Children as `React.ReactNode`** | `{ children: React.ReactNode }` |
| **Never use `React.FC`** | Use `function` declaration instead |
| **Event handlers** | Type with specific signatures: `(id: string) => void` |
| **Classname passthrough** | Accept `className?: string` on all presentational components |

### Custom Hook Convention

```typescript
// hooks/ directory
// Prefix with "use"

// hooks/use-session-preview.ts
export function useSessionPreview(fd: FrequencyDuration) {
  const sessions = useMemo(() => generateSessions(fd), [fd]);
  const totalMinutes = sessions.length * fd.durationMinutes;

  return {
    sessions,
    totalSessions: sessions.length,
    totalMinutes,
    totalHours: Math.floor(totalMinutes / 60),
    weekBreakdown: groupSessionsByWeek(sessions),
  };
}
```

---

## 8. File Naming Conventions

| Pattern | Example |
|---------|---------|
| **Components** | `kebab-case.tsx` → `patient-card.tsx` |
| **Hooks** | `kebab-case.ts` → `use-session-preview.ts` |
| **Utilities** | `kebab-case.ts` → `generate-sessions.ts` |
| **Types** | `kebab-case.ts` → `patient.ts` |
| **Server Actions** | `kebab-case.ts` → `create-assessment.ts` |
| **Zod Schemas** | `kebab-case.ts` → `assessment.ts` (in `lib/validations/`) |
| **Directories** | `kebab-case/` → `components/assessments/` |

### Export Convention

```typescript
// Named exports only — no default exports for utilities, hooks, or types
// Default exports ONLY for page.tsx and layout.tsx (required by Next.js)

// GOOD
export function formatDate(date: string): string { /* ... */ }
export type PatientStatus = "active" | "inactive";

// BAD
export default function formatDate(date: string): string { /* ... */ }
```

---

## 9. Component Size Guidelines

| Component Type | Max Lines | Rationale |
|----------------|-----------|-----------|
| Page component (`page.tsx`) | 50 | Delegate to child components |
| Layout component (`layout.tsx`) | 30 | Shell + `{children}` |
| Feature component | 150 | Single responsibility |
| UI primitive (Shadcn) | 80 | Composable building block |
| Custom hook | 60 | Extracted logic |
| Server Action | 40 | Single mutation + validation |

### When to Split
- Component renders > 3 distinct visual sections → split into children
- Component manages > 3 pieces of state → extract custom hook
- Component has > 3 conditional renders → extract sub-components
- Form has > 10 fields → extract field groups into sub-components
