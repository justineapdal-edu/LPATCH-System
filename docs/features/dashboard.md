# Dashboard

> Main clinic dashboard displaying KPIs, daily schedule, recent activity, and calendar integration with auto-generated sessions.

---

## 1. ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LPATCH  [Dashboard] [Patients] [Schedule] [Reports]    [Admin] [Avatar]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌────────────┐  │
│  │  Active       │ │  Sessions     │ │  Pending      │ │  Patient   │  │
│  │  Patients     │ │  Today        │ │  Appointments │ │  Retention │  │
│  │               │ │               │ │               │ │            │  │
│  │     142       │ │      18       │ │       7       │ │    89%     │  │
│  │  ▲ 3% from    │ │  12 done /    │ │  3 confirmed  │ │  ▲ 2% from │  │
│  │    last week  │ │    6 upcoming │ │    4 unconfirm │ │  last month│  │
│  └───────────────┘ └───────────────┘ └───────────────┘ └────────────┘  │
│                                                                         │
├────────────────────────────────────┬────────────────────────────────────┤
│                                    │                                    │
│  TODAY'S SCHEDULE                  │  RECENT ACTIVITY                   │
│  ────────────────                  │  ───────────────                   │
│                                    │                                    │
│  09:00  John Doe    - Treatment    │  • 12 min ago                      │
│         [45 min] [Session #5/24]   │    Assessment completed for        │
│         [Done]                     │    Alice Brown                     │
│                                    │                                    │
│  09:45  Jane Smith  - Treatment    │  • 45 min ago                      │
│         [60 min] [Session #12/18]  │    24 sessions generated for       │
│         [Done]                     │    John Doe (3x/week, 45min)       │
│                                    │                                    │
│  10:45  Bob Wilson  - Follow-up    │  • 1 hour ago                      │
│         [30 min] [Session #8/12]   │    Progress note added for         │
│         [Active]                   │    Jane Smith                      │
│                                    │                                    │
│  11:15  ___         - LUNCH        │  • 2 hours ago                     │
│                                    │    Treatment plan updated for       │
│  13:00  Carol Lee   - Evaluation   │    Bob Wilson                      │
│         [60 min] [Session #1/24]   │                                    │
│         [Upcoming]                 │  [View All Activity →]             │
│                                    │                                    │
│  [View Full Calendar →]            │                                    │
│                                    │                                    │
├────────────────────────────────────┴────────────────────────────────────┤
│                                                                         │
│  WEEKLY CALENDAR OVERVIEW                                               │
│  ────────────────────────                                               │
│                                                                         │
│  Mon 13      Tue 14      Wed 15      Thu 16      Fri 17      Sat 18    │
│  ─────────── ─────────── ─────────── ─────────── ─────────── ──────────│
│  09:00 Doe   ·····       ·····       09:00 Doe   ·····       ·····      │
│  09:45 Smith ·····       ·····       ·····       ·····       ·····      │
│  ·····       ·····       ·····       ·····       ·····       ·····      │
│  11:00 Wilson·····       ·····       ·····       ·····       ·····      │
│  ·····       ·····       ·····       ·····       ·····       ·····      │
│  ·····       13:00 Lee   ·····       ·····       ·····       ·····      │
│                                                                         │
│  [Full Calendar View →]                                                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                                          │
│  ─────────────                                                          │
│  [+ New Patient]  [New Assessment]  [Add Progress Note]  [Run Report]   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. KPI Cards

| Metric | Source | Calculation | Trend |
|--------|--------|-------------|-------|
| **Active Patients** | `patients` table | `WHERE status = 'active'` | % change vs. previous 7 days |
| **Sessions Today** | `therapy_sessions` table | `WHERE DATE(scheduledAt) = TODAY()` | Split: completed / upcoming |
| **Pending Appointments** | `therapy_sessions` table | `WHERE status = 'scheduled' AND scheduledAt > NOW()` | Count of unconfirmed |
| **Patient Retention** | `patients` table | `active / (active + discharged) * 100` | % change vs. previous 30 days |

### KPI Card Component

```typescript
// components/dashboard/kpi-card.tsx

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;            // e.g., "3% from last week"
  };
  icon: React.ReactNode;
}
```

---

## 3. Daily Schedule Widget

### Data Source
```typescript
interface ScheduleEntry {
  id: string;
  patientName: string;
  sessionType: "evaluation" | "treatment" | "follow_up" | "discharge";
  scheduledAt: string;         // ISO 8601 datetime
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  therapistName: string;
  sessionNumber: number;       // e.g., 5 (current) of 24 (total)
  totalSessions: number;       // From FrequencyDuration.totalWeeks * frequency
  assessmentId: string;        // FK -> assessment (links back to treatment plan)
}
```

### Behavior
- Shows only today's sessions for the current therapist (or all if admin)
- Color-coded status indicators: green (done), blue (active), gray (upcoming), red (cancelled)
- Displays session progress: "Session #5/24" (derived from treatment plan frequency)
- Click entry → navigate to `/patients/[patientId]`
- Auto-refreshes every 5 minutes (Server Component re-render)

---

## 4. Weekly Calendar Overview

### Data Source
```typescript
interface CalendarDay {
  date: string;                // ISO 8601 date
  isToday: boolean;
  sessions: CalendarSession[];
}

interface CalendarSession {
  id: string;
  patientName: string;
  scheduledAt: string;         // ISO 8601 datetime
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  sessionType: "evaluation" | "treatment" | "follow_up" | "discharge";
}
```

### Behavior
- Shows current week (Mon-Sun) by default
- Navigation: ◀ Previous week / Next week ▶
- Each day cell shows session time blocks with patient name abbreviations
- Color-coded by session type: evaluation (purple), treatment (blue), follow-up (amber), discharge (green)
- Click day → navigate to `/schedule?date=YYYY-MM-DD` (full day view)
- Click session → navigate to `/patients/[patientId]`

### Calendar Session Auto-Population
Sessions appear on the calendar when:
1. A new assessment is submitted with `frequencyDuration`
2. `generateSessions()` creates `therapy_sessions` rows
3. `revalidatePath` triggers calendar refresh
4. Sessions respect preferred time of day (morning/afternoon/evening)

---

## 5. Recent Activity Feed

### Activity Types
```typescript
type ActivityType =
  | "session_completed"
  | "session_scheduled"
  | "progress_note_added"
  | "assessment_completed"
  | "patient_onboarded"
  | "treatment_plan_updated"
  | "patient_status_changed";

interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string;           // ISO 8601 datetime
  description: string;         // Human-readable summary
  patientId: string;           // FK -> Patient (for linking)
  patientName: string;         // Denormalized for display
  performedBy: string;         // Therapist or admin name
}
```

### Activity Type → Description Mapping
| Activity Type | Description Template |
|---------------|---------------------|
| `session_completed` | "Session completed for {patientName}" |
| `session_scheduled` | "{count} sessions generated for {patientName} ({frequency}, {duration}min)" |
| `progress_note_added` | "Progress note added for {patientName}" |
| `assessment_completed` | "Assessment completed for {patientName}" |
| `patient_onboarded` | "New patient onboarded: {patientName}" |
| `treatment_plan_updated` | "Treatment plan updated for {patientName}" |

### Behavior
- Shows last 10 activities across the clinic
- Relative timestamps ("12 min ago", "1 hour ago")
- Click activity → navigate to relevant patient or session
- No auto-refresh (static snapshot)

---

## 6. Quick Actions

| Action | Button | Target | Permission |
|--------|--------|--------|------------|
| New Patient | `+ New Patient` | `/patients/new` | Admin only |
| New Assessment | `New Assessment` | `/patients/[id]/assessment` | Therapist / Admin |
| Add Progress Note | `Add Progress Note` | Modal dialog | Therapist only |
| Run Report | `Run Report` | `/reports` (Phase 2) | Admin only |

---

## 7. Data Fetching Strategy

### Server Component (Default)
```typescript
// app/dashboard/page.tsx

// Server Component — fetches all dashboard data server-side
export default async function DashboardPage() {
  const kpis = await getDashboardKpis();
  const schedule = await getTodaySchedule();
  const calendarWeek = await getWeeklyCalendar();
  const activities = await getRecentActivity();

  return (
    <div>
      <KpiGrid data={kpis} />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <DailySchedule entries={schedule} />
        </div>
        <div>
          <ActivityFeed items={activities} />
        </div>
      </div>
      <WeeklyCalendar days={calendarWeek} />
      <QuickActions />
    </div>
  );
}
```

### Loading States
```typescript
// app/dashboard/loading.tsx

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <KpiGridSkeleton />       {/* 4 shimmer cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ScheduleSkeleton />   {/* 8 shimmer rows */}
        </div>
        <div>
          <ActivitySkeleton />   {/* 5 shimmer items */}
        </div>
      </div>
      <CalendarSkeleton />       {/* 7-column week grid */}
    </div>
  );
}
```

---

## 8. Schedule ↔ Calendar Connection

The schedule widget and calendar view share the same `therapy_sessions` data source. The flow:

```
Assessment saved with FrequencyDuration
        │
        ▼
generateSessions() computes session dates
        │
        ▼
Server Action creates therapy_sessions rows
(linked to assessmentId, patientId, therapistId)
        │
        ▼
revalidatePath() triggers re-render
        │
        ├──► Dashboard: DailySchedule shows today's sessions
        ├──► Dashboard: WeeklyCalendar shows full week
        └──► Patient Profile: Sessions tab shows all sessions
```

### Session Lifecycle
| State | Description | UI Indicator |
|-------|-------------|--------------|
| `scheduled` | Auto-generated, awaiting session | Gray, outlined |
| `completed` | Session attended, notes added | Green, filled |
| `cancelled` | Patient/therapist cancelled | Red, strikethrough |
| `no_show` | Patient did not attend | Red, outlined |

### Manual Session Overrides
After auto-generation, therapists can:
- **Reschedule** a session (drag on calendar or edit in modal)
- **Cancel** a session (with reason field)
- **Add extra sessions** (one-off additions not tied to frequency)
- **Mark no-show** (triggers retention metric update)

---

## 9. DO's and DON'Ts

### DO's
- **DO** use Server Components for all dashboard data fetching
- **DO** show loading skeletons during Suspense boundaries
- **DO** format dates/times in user's local timezone
- **DO** handle empty states gracefully ("No sessions today", "No recent activity")
- **DO** make KPI cards responsive (2-col on mobile, 4-col on desktop)
- **DO** show session count progress (e.g., "5/24") in schedule entries
- **DO** link calendar sessions back to the originating assessment
- **DO** auto-refresh calendar when sessions are rescheduled or cancelled

### DON'Ts
- **DON'T** fetch dashboard data with `useEffect` in Client Components
- **DON'T** hardcode clinic-wide metrics (always query from database)
- **DON'T** show patient PII in activity feed beyond first name + last initial
- **DON'T** auto-refresh the entire page (use targeted revalidation)
- **DON'T** display counts as exact numbers when > 999 (use "1.2k" format)
- **DON'T** show past sessions as "upcoming" (timezone edge case — always compare with server time)
- **DON'T** allow calendar drag-reschedule without confirming new time with therapist
