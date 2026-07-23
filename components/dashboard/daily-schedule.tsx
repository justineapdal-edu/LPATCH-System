import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ScheduleEntry {
  id: string;
  patientName: string;
  patientId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  therapistName: string | null;
  sessionNumber: number;
  sessionType: string;
}

interface DailyScheduleProps {
  entries: ScheduleEntry[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function statusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "no_show":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function DailySchedule({ entries }: DailyScheduleProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Today&apos;s Schedule</h3>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No sessions scheduled for today.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Today&apos;s Schedule</h3>
      <div className="space-y-3">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/patients/${entry.patientId}`}
            className="flex items-center gap-4 rounded-md border p-3 transition-colors hover:bg-muted"
          >
            <div className="w-16 text-sm font-medium">
              {formatTime(entry.scheduledAt)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{entry.patientName}</p>
              <p className="text-xs text-muted-foreground">
                {entry.sessionType} · {entry.durationMinutes} min · Session #
                {entry.sessionNumber}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {entry.therapistName ?? "Unassigned"}
            </div>
            <Badge className={statusColor(entry.status)} variant="secondary">
              {entry.status}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
