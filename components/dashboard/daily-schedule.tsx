import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Dumbbell, CheckCircle2, XCircle, AlertCircle, Ban } from "lucide-react";

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

function statusConfig(status: string) {
  switch (status) {
    case "completed":
      return { className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
    case "scheduled":
      return { className: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock };
    case "cancelled":
      return { className: "bg-red-50 text-red-700 border-red-200", icon: XCircle };
    case "no_show":
      return { className: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle };
    default:
      return { className: "bg-gray-50 text-gray-700 border-gray-200", icon: Ban };
  }
}

export function DailySchedule({ entries }: DailyScheduleProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Today&apos;s Schedule</h3>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No sessions scheduled for today.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Today&apos;s Schedule</h3>
      <div className="space-y-2">
        {entries.map((entry) => {
          const { className: statusClassName, icon: StatusIcon } = statusConfig(entry.status);
          return (
            <Link
              key={entry.id}
              href={`/patients/${entry.patientId}`}
              className="flex items-center gap-4 rounded-lg border p-3 transition-all duration-200 hover:bg-accent hover:shadow-sm"
            >
              <div className="flex items-center gap-2 w-20">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium tabular-nums">
                  {formatTime(entry.scheduledAt)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.patientName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Dumbbell className="h-3 w-3" />
                  <span>{entry.sessionType}</span>
                  <span className="text-border">·</span>
                  <span>{entry.durationMinutes} min</span>
                  <span className="text-border">·</span>
                  <span>#{entry.sessionNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="hidden sm:inline">{entry.therapistName ?? "Unassigned"}</span>
              </div>
              <Badge className={statusClassName} variant="outline">
                <StatusIcon className="mr-1 h-3 w-3" />
                {entry.status}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
