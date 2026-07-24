# Component Architecture

> Rules for Next.js App Router layout, Server vs Client components, Shadcn/Tailwind v4 conventions, assessment form components, and session scheduler UI.

---

## 1. App Router Layout Rules

### Root Layout (`app/layout.tsx`)

```typescript
// Server Component (default)
// Configures HTML document, Google Fonts, and wraps ALL pages with AppShell

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

### Height Chain (Full-Viewport Sidebar)

The layout uses a strict `h-full` chain to keep the sidebar at viewport height:

```
html[h-full]
  └─ body[h-full flex flex-col]
       └─ AppShell div[h-full flex]
            ├─ aside[h-full]         ← desktop sidebar (fixed width w-64)
            └─ main content div[flex-1 overflow-hidden]
                 ├─ header[h-16]
                 └─ main[flex-1 overflow-auto]  ← scrollable page content
```

**Rule:** Never use `min-h-full` on `body` — it allows the layout to grow past the viewport, breaking the sidebar's full-height behavior.

### AppShell Component

```typescript
// components/layout/app-shell.tsx
// Client Component — handles sidebar state, mobile menu, responsive layout

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LayoutDashboard, Users, Calendar, Menu, Activity, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/schedule", label: "Schedule", icon: Calendar },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r">
        <SidebarNav />
      </aside>

      {/* Mobile sidebar — Sheet drawer from left */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNav onLinkClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 lg:px-6">
          {/* Mobile menu trigger */}
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {/* User avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            A
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
```

### SidebarNav (Internal Component)

```typescript
// Rendered inside both desktop <aside> and mobile <Sheet>
// Uses bg-card for sidebar background, flex h-full flex-col for full height

function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo header — h-16, border-b */}
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">LPATCH</span>
      </div>

      {/* Nav links — flex-1 pushes user section to bottom */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section — pinned to bottom via parent flex-col */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            A
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Admin</p>
            <p className="text-xs">Therapist</p>
          </div>
          <LogOut className="h-4 w-4" />
        </div>
      </div>
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
├── layout.tsx                    Root layout (AppShell + Google Fonts)
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

## 4. Theme & Design System

This project uses **Tailwind CSS v4** with a **CSS-based configuration** (no `tailwind.config.js`). All theme tokens are defined as CSS custom properties in `app/globals.css`.

### Color System (oklch)

All colors use the oklch color space for perceptual uniformity. The theme defines light and dark mode via `:root` and `.dark` selectors.

```css
/* Light mode — :root */
--background: oklch(0.985 0.002 240);    /* Near-white with slight blue tint */
--foreground: oklch(0.17 0.04 250);      /* Dark navy text */
--primary: oklch(0.52 0.14 180);         /* Teal/cyan primary accent */
--card: oklch(1 0 0);                     /* Pure white cards */
--muted: oklch(0.96 0.008 240);          /* Light gray backgrounds */
--accent: oklch(0.93 0.02 180);          /* Light teal for hover states */
--destructive: oklch(0.577 0.245 27.325); /* Red for errors/destructive */
--border: oklch(0.91 0.01 240);          /* Subtle light borders */

/* Dark mode — .dark */
--background: oklch(0.16 0.03 250);      /* Dark navy background */
--foreground: oklch(0.96 0.008 240);     /* Near-white text */
--primary: oklch(0.60 0.14 180);         /* Brighter teal for dark mode */
--card: oklch(0.20 0.03 250);            /* Dark card surfaces */
--border: oklch(1 0 0 / 10%);            /* White with 10% opacity */
```

### Sidebar-Specific Tokens

The sidebar has its own set of theme tokens for independent styling:

```css
:root {
  --sidebar: oklch(0.985 0.002 240);
  --sidebar-foreground: oklch(0.17 0.04 250);
  --sidebar-primary: oklch(0.52 0.14 180);
  --sidebar-primary-foreground: oklch(0.99 0 0);
  --sidebar-accent: oklch(0.93 0.02 180);
  --sidebar-accent-foreground: oklch(0.30 0.06 250);
  --sidebar-border: oklch(0.91 0.01 240);
  --sidebar-ring: oklch(0.52 0.14 180);
}
```

### CSS Variable → Tailwind Mapping

In Tailwind v4, theme tokens are mapped via `@theme inline` in `globals.css`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  /* ... etc */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}
```

### Base Layer Styles

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

### Theme Rules

| Rule | Detail |
|------|--------|
| **Use theme tokens only** | `bg-primary`, `text-muted-foreground` — NEVER `bg-blue-500` or hardcoded oklch values |
| **Light/dark via CSS vars** | All colors defined as CSS variables; dark mode toggled via `.dark` class on `<html>` |
| **Sidebar tokens** | Use `--sidebar-*` tokens for sidebar-specific styling, not general `--primary` |
| **Border radius** | Base radius is `0.625rem`; use `rounded-lg` (maps to `--radius-lg`) for standard rounding |
| **Font stack** | Geist Sans (`--font-geist-sans`) as primary, Geist Mono (`--font-geist-mono`) for code |

---

## 5. UI Primitives (Shadcn + @base-ui/react)

This project uses **Shadcn v4** components built on **@base-ui/react** (NOT Radix UI).

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

### Installed UI Components (`components/ui/`)

| Component | File | Primitives Used |
|-----------|------|-----------------|
| Button | `button.tsx` | `@base-ui/react/button` + `cva` |
| Badge | `badge.tsx` | `@base-ui/react/merge-props` + `@base-ui/react/use-render` + `cva` |
| Card | `card.tsx` | React.forwardRef (standard) |
| Sheet | `sheet.tsx` | `@base-ui/react/dialog` (NOT Radix Sheet) |
| Input | `input.tsx` | Standard `<input>` |
| Textarea | `textarea.tsx` | Standard `<textarea>` |
| Select | `select.tsx` | `@base-ui/react/select` |
| Dialog | `dialog.tsx` | `@base-ui/react/dialog` |
| Tabs | `tabs.tsx` | `@base-ui/react/tabs` |
| Checkbox | `checkbox.tsx` | `@base-ui/react/checkbox` |
| Radio Group | `radio-group.tsx` | `@base-ui/react/radio` |
| Slider | `slider.tsx` | `@base-ui/react/slider` |
| Calendar | `calendar.tsx` | `react-day-picker` |
| Popover | `popover.tsx` | `@base-ui/react/popover` |
| Dropdown Menu | `dropdown-menu.tsx` | `@base-ui/react/menu` |
| Label | `label.tsx` | `@base-ui/react/field` |
| Separator | `separator.tsx` | Standard `<div>` with border |
| Skeleton | `skeleton.tsx` | Standard `<div>` with animation |

### Additional NPM Packages

```bash
npm install signature_pad    # Canvas-based signature capture
npm install date-fns         # Date utilities
npm install zod              # Schema validation (v4)
```

### Button Variants Reference

```typescript
// From components/ui/button.tsx — cva-based variants
const buttonVariants = {
  variant: {
    default:    "bg-primary text-primary-foreground hover:bg-primary/80",
    outline:    "border-border bg-background hover:bg-muted hover:text-foreground",
    secondary:  "bg-secondary text-secondary-foreground hover:bg-secondary/...",
    ghost:      "hover:bg-muted hover:text-foreground",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    link:       "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-8 gap-1.5 px-2.5",
    xs:      "h-6 gap-1 ...",
    sm:      "h-7 gap-1 ...",
    lg:      "h-9 gap-1.5 px-2.5",
    icon:    "size-8",
    // ... icon-xs, icon-sm, icon-lg
  },
};
```

### Card API

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>...</CardAction>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>
```

### Tailwind Rules

| Rule | Example |
|------|---------|
| **Use theme tokens only** | `bg-primary`, `text-muted-foreground` — NEVER `bg-blue-500` |
| **Use `cn()` for merging** | `cn("base-class", conditional && "conditional-class", className)` |
| **Consistent spacing** | Use Tailwind spacing scale: `p-4`, `gap-6`, `space-y-4` |
| **Responsive prefixes** | `md:grid-cols-2`, `lg:grid-cols-4` |
| **Card spacing CSS var** | Cards use `--card-spacing` for internal padding consistency |

---

## 6. Assessment Form Component Tree

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

## 7. Session Scheduler Component

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

  const weekMap = new Map<number, typeof sessions>();
  sessions.forEach((s) => {
    const weekNum = Math.ceil(s.sessionNumber / 3);
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

## 8. TypeScript Prop Typing Standards

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

## 9. File Naming Conventions

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

## 10. Component Size Guidelines

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

---

## 11. Icon System

This project uses **lucide-react** for all icons.

```typescript
import { LayoutDashboard, Users, Calendar, Activity, LogOut } from "lucide-react";

// Standard icon size in components: h-4 w-4 (16px)
<Activity className="h-4 w-4" />

// Larger icons for page headers: h-5 w-5 (20px)
<Menu className="h-5 w-5" />
```

### Icon Usage Patterns

| Context | Size | Example |
|---------|------|---------|
| Sidebar nav links | `h-4 w-4` | `<Icon className="h-4 w-4" />` |
| Page header icons | `h-5 w-5` | `<Menu className="h-5 w-5" />` |
| KPI card icons | `h-4 w-4` (in container) | Wrapped in `h-8 w-8` or `h-10 w-10` div |
| Schedule day icons | `h-3 w-3` | `<Clock className="h-3 w-3" />` |
| Avatar fallback | N/A | Letter in `h-8 w-8` circle |

---

## 12. Component Directory Structure

```
components/
├── ui/                          Shadcn UI primitives (DO NOT modify directly)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── sheet.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── select.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── slider.tsx
│   ├── calendar.tsx
│   ├── popover.tsx
│   ├── dropdown-menu.tsx
│   ├── label.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   └── table.tsx
├── layout/                      App shell and navigation
│   └── app-shell.tsx            Sidebar + main content layout
├── dashboard/                   Dashboard page components
│   ├── kpi-card.tsx
│   ├── daily-schedule.tsx
│   └── activity-feed.tsx
├── patients/                    Patient-related components
│   ├── patient-table.tsx
│   └── patient-header.tsx
├── assessments/                 Assessment wizard and steps
│   ├── assessment-wizard.tsx
│   ├── assessment-view.tsx
│   ├── signature-pad.tsx
│   └── steps/
│       ├── patient-info-step.tsx
│       ├── medical-history-step.tsx
│       ├── physical-exam-step.tsx
│       ├── presenting-complaint-step.tsx
│       ├── functional-assessment-step.tsx
│       ├── assessment-summary-step.tsx
│       ├── treatment-plan-step.tsx
│       └── therapist-notes-step.tsx
└── schedule/                    Scheduling components
    ├── session-scheduler.tsx
    └── session-preview.tsx
```
