import Link from "next/link";
import {
  UserPlus,
  FileText,
  CalendarCheck,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  patientId: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function activityIcon(type: string) {
  switch (type) {
    case "patient_registered":
      return UserPlus;
    case "assessment_completed":
      return FileText;
    case "session_scheduled":
      return CalendarCheck;
    case "session_completed":
      return ClipboardList;
    case "patient_discharged":
      return AlertTriangle;
    default:
      return ClipboardList;
  }
}

function activityColor(type: string) {
  switch (type) {
    case "patient_registered":
      return "bg-blue-50 text-blue-600";
    case "assessment_completed":
      return "bg-violet-50 text-violet-600";
    case "session_scheduled":
      return "bg-teal-50 text-teal-600";
    case "session_completed":
      return "bg-emerald-50 text-emerald-600";
    case "patient_discharged":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No recent activity.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = activityIcon(item.type);
          const colorClass = activityColor(item.type);
          return (
            <Link
              key={item.id}
              href={`/patients/${item.patientId}`}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{item.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {timeAgo(item.timestamp)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
