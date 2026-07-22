# AI Coding Rules

> Explicit constraints for AI assistants (Cursor, Claude Code, Copilot) working on this project.

---

## 1. TypeScript Strictness

### DO's
- **DO** use `strict: true` in `tsconfig.json` — never relax it
- **DO** type every function parameter and return value explicitly
- **DO** use `interface` for component props and object shapes
- **DO** use `type` for unions, intersections, and aliases
- **DO** use `as const` for literal type assertions
- **DO** use `satisfies` for type narrowing where appropriate
- **DO** use `NonNullable<T>`, `Pick<T, K>`, `Omit<T, K>` utility types
- **DO** co-locate Zod schemas with TypeScript types for inference

### DON'Ts
- **DON'T** use `any` — ever, for any reason
- **DON'T** use `@ts-ignore` or `@ts-expect-error` without a linked issue
- **DON'T** use `as` type assertions unless absolutely necessary (prefer type guards)
- **DON'T** use `enum` — use union types with `as const` objects instead
- **DON'T** use `React.FC` or `React.FunctionComponent`
- **DON'T** use `Object.keys()` without `as const` or type narrowing
- **DON'T** use `!` non-null assertion — handle null/undefined explicitly

### Pattern: Replace enums with const objects

```typescript
// BAD
enum PatientStatus {
  Active = "active",
  Inactive = "inactive",
  Discharged = "discharged",
}

// GOOD
const PatientStatus = {
  Active: "active",
  Inactive: "inactive",
  Discharged: "discharged",
} as const;

type PatientStatus = (typeof PatientStatus)[keyof typeof PatientStatus];
```

---

## 2. Tailwind CSS Rules

### DO's
- **DO** use only CSS variable-based tokens (`bg-primary`, `text-muted-foreground`)
- **DO** use the `cn()` utility for all conditional class merging
- **DO** use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **DO** define custom styles in `globals.css` using CSS variables
- **DO** use Shadcn's theme tokens as the single source of truth

### DON'Ts
- **DON'T** use arbitrary hex colors (`bg-[#FF5733]`) — use theme tokens
- **DON'T** use arbitrary RGB/HSL values (`bg-[rgb(255,0,0)]`)
- **DON'T** use Tailwind's `!important` modifier (`!p-4`) — restructure instead
- **DON'T** use inline `style={{ }}` props — use Tailwind classes
- **DON'T** use `@apply` in component files — use utility classes directly
- **DON'T** create component-specific CSS files — use Tailwind utilities
- **DON'T** use color names from Tailwind's palette (`blue-500`, `red-600`) directly

### Pattern: Consistent component styling

```typescript
// BAD
<div style={{ padding: '16px', backgroundColor: '#f3f4f6' }}>

// BAD
<div className="bg-gray-100 p-4">

// GOOD
<div className="bg-muted p-4">
```

---

## 3. Next.js App Router Rules

### DO's
- **DO** default to Server Components — only add `'use client'` when required
- **DO** use Server Actions for all data mutations (not API routes for form submissions)
- **DO** use `loading.tsx` for every route segment with async data
- **DO** use `not-found.tsx` for 404 handling
- **DO** use `error.tsx` for route-level error boundaries
- **DO** use `generateMetadata()` for dynamic page titles
- **DO** validate search params with Zod before using them in queries
- **DO** use `revalidatePath()` or `revalidateTag()` after mutations

### DON'Ts
- **DON'T** add `'use client'` at the page level (`page.tsx`)
- **DON'T** use `getServerSideProps` or `getStaticProps` (use App Router patterns)
- **DON'T** use `useEffect` for data fetching that could be server-rendered
- **DON'T** fetch data in both Server Component and Client Component for same route
- **DON'T** use `router.push()` for data fetching — use it only for navigation
- **DON'T** create API routes (`app/api/`) for form submissions — use Server Actions
- **DON'T** use `cookies()` or `headers()` in Client Components

---

## 4. Server Action Security

### DO's
- **DO** validate ALL inputs with Zod inside every Server Action
- **DO** use `'use server'` directive at the top of action files
- **DO** revalidate data after successful mutations (`revalidatePath`)
- **DO** return structured errors (`{ success: false, errors: {...} }`)
- **DO** check authorization before mutations (Phase 2: add auth middleware)

### DON'Ts
- **DON'T** trust client-side validation alone — always re-validate server-side
- **DON'T** expose database IDs or internal state in error messages
- **DON'T** use `console.log` with patient data in production
- **DON'T** return raw database errors to the client
- **DON'T** allow Server Actions to be called from untrusted sources (check `Origin` header)

### Pattern: Server Action structure

```typescript
// lib/actions/create-assessment.ts
'use server';

import { revalidatePath } from 'next/cache';
import { assessmentSchema, type AssessmentInput } from '@/lib/validations/assessment';
import { generateSessions } from '@/lib/scheduler/generate-sessions';

export async function createAssessment(
  formData: AssessmentInput
): Promise<{ success: boolean; patientId?: string; errors?: Record<string, string> }> {
  // 1. Validate (server-side)
  const parsed = assessmentSchema.safeParse(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      errors[field] = issue.message;
    });
    return { success: false, errors };
  }

  // 2. Create patient + assessment
  try {
    const patient = await db.patient.create({ data: parsed.data.patientInformation });
    const assessment = await db.assessment.create({
      data: { ...parsed.data, patientId: patient.id },
    });

    // 3. Auto-generate sessions from frequencyDuration
    const sessions = generateSessions(parsed.data.treatmentPlan.frequencyDuration);
    await db.therapySession.createMany({
      data: sessions.map((s) => ({
        patientId: patient.id,
        assessmentId: assessment.id,
        therapistId: parsed.data.therapistOnDuty.name, // Resolve to actual therapist ID
        scheduledAt: s.scheduledAt,
        durationMinutes: s.durationMinutes,
        status: "scheduled" as const,
        sessionType: "treatment" as const,
      })),
    });

    revalidatePath('/patients');
    revalidatePath('/dashboard');
    return { success: true, patientId: patient.id };
  } catch (error) {
    return { success: false, errors: { form: "Failed to create assessment" } };
  }
}
```

---

## 5. HIPAA & Privacy Guardrails

### CRITICAL — Never Violate These

- **NEVER** log patient PII (names, emails, phone numbers, DOB, medical info) to console
- **NEVER** store patient data in `localStorage`, `sessionStorage`, or browser cookies
- **NEVER** include patient data in URL parameters (use IDs only)
- **NEVER** commit patient data to git repositories
- **NEVER** send patient data to third-party analytics services
- **NEVER** display full medical history in table/list views (summary only)
- **NEVER** use patient names in error messages or logs
- **NEVER** hardcode patient data in test files — use fixtures with fake data

### Data Handling Rules

| Data Type | Display Rule | Storage Rule |
|-----------|-------------|--------------|
| Full name | Profile page only | Encrypted at rest |
| Contact number | Profile page only | Encrypted at rest |
| DOB | Profile page only | Encrypted at rest |
| Address | Profile page only | Encrypted at rest |
| Medical history | Assessment tab only | JSONB, encrypted at rest |
| Physical examination | Assessment tab only | JSONB, encrypted at rest |
| Presenting complaint | Assessment tab only | JSONB, encrypted at rest |
| Functional assessment | Assessment tab only | JSONB, encrypted at rest |
| Progress notes | Session detail only | Encrypted at rest |
| Treatment plan | Treatment plan tab only | JSONB, encrypted at rest |
| Pain scale values | Assessment + session views | Encrypted at rest |
| Patient ID | URL params allowed | Never in client storage |

### Assessment Data Specific Rules
- **NEVER** render assessment medical history in search results or list views
- **NEVER** include diagnosis text in URL params or browser history state
- **NEVER** store assessment form draft in `localStorage` — use server state or session
- **NEVER** transmit assessment data over unencrypted connections
- **NEVER** display therapist license numbers in client-side rendered views without access control
- **ALWAYS** audit-log when assessment data is viewed or modified

---

## 6. Assessment Form Rules

### DO's
- **DO** validate each wizard step before allowing "Next" navigation
- **DO** preserve form state across step navigation (no data loss)
- **DO** show field-level validation errors inline (not in alerts)
- **DO** disable "Submit" button while Server Action is pending
- **DO** show session preview before final submission
- **DO** auto-generate sessions only after successful assessment save
- **DO** use `useActionState` for form submission state in React 19

### DON'Ts
- **DON'T** skip validation steps in the wizard
- **DON'T** allow navigation away from unsaved form data (confirm dialog)
- **DON'T** store partial assessment data in `localStorage`
- **DON'T** generate sessions if `frequencyDuration` validation fails
- **DON'T** allow `totalWeeks > 52` (hard cap)
- **DON'T** auto-generate sessions for past dates
- **DON'T** create duplicate sessions for the same patient at the same datetime

---

## 7. Code Quality Rules

### DO's
- **DO** run `npm run lint` before committing
- **DO** run `npx tsc --noEmit` before committing
- **DO** use named exports for all non-page files
- **DO** keep functions under 40 lines
- **DO** keep components under 150 lines
- **DO** extract repeated logic into `lib/` utilities
- **DO** use early returns to reduce nesting

### DON'Ts
- **DON'T** write comments explaining *what* — only explain *why* if non-obvious
- **DON'T** use `var` — use `const` by default, `let` only when reassignment is needed
- **DON'T** use `console.log` in production code — use structured logging (Phase 2)
- **DON'T** write unused imports, variables, or functions
- **DON'T** use nested ternary operators — use `if/else` or lookup objects
- **DON'T** mix `async/await` with `.then()` chains in the same function

---

## 8. File Naming & Organization

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` | `app/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx` |
| Loading | `loading.tsx` | `app/dashboard/loading.tsx` |
| Error | `error.tsx` | `app/dashboard/error.tsx` |
| Components | `kebab-case.tsx` | `components/assessments/assessment-wizard.tsx` |
| Hooks | `use-kebab-case.ts` | `hooks/use-session-preview.ts` |
| Utilities | `kebab-case.ts` | `lib/scheduler/generate-sessions.ts` |
| Types | `kebab-case.ts` | `types/patient.ts` |
| Server Actions | `kebab-case.ts` | `lib/actions/create-assessment.ts` |
| Schemas | `kebab-case.ts` | `lib/validations/assessment.ts` |

---

## 9. Error Handling Patterns

```typescript
// Server Action: Structured error return
export async function action(): Promise<
  | { success: true; data: SomeType }
  | { success: false; error: string }
> {
  try {
    const data = await riskyOperation();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Operation failed" };
  }
}

// Client Component: Handle structured errors
'use client';

import { useActionState } from 'react';

export function AssessmentForm() {
  const [state, formAction, isPending] = useActionState(createAssessment, null);

  return (
    <form action={formAction}>
      {/* ... */}
      {state?.success === false && state.errors && (
        <div className="text-destructive">
          {Object.entries(state.errors).map(([field, message]) => (
            <p key={field}>{message}</p>
          ))}
        </div>
      )}
    </form>
  );
}
```

---

## 10. Session Scheduler Rules

### DO's
- **DO** compute session dates client-side for instant preview
- **DO** validate `frequencyDuration` with Zod before generating sessions
- **DO** show total session count and estimated hours in preview
- **DO** group preview sessions by week for readability
- **DO** respect `preferredTimeOfDay` when computing session dates
- **DO** skip weekends when `preferredTimeOfDay` is not "any"

### DON'Ts
- **DON'T** generate sessions until the user clicks "Submit" (preview only)
- **DON'T** allow `totalWeeks` to exceed 52
- **DON'T** schedule sessions on past dates
- **DON'T** create overlapping sessions (check existing sessions in DB)
- **DON'T** auto-generate sessions if any `frequencyDuration` field is invalid
- **DON'T** modify existing sessions when the assessment is re-edited (manual override only)
