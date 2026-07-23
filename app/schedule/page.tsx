import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Clock, User, Dumbbell, CalendarX } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const sessions = await prisma.therapySession.findMany({
    where: {
      scheduledAt: { gte: startOfWeek, lte: endOfWeek },
    },
    include: {
      patient: { select: { id: true, fullName: true } },
      therapist: { select: { fullName: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayStr = day.toISOString().split("T")[0];
    days.push({
      date: dayStr,
      label: day.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      isToday: day.toISOString().split("T")[0] === now.toISOString().split("T")[0],
      sessions: sessions.filter(
        (s: (typeof sessions)[number]) => s.scheduledAt.toISOString().split("T")[0] === dayStr
      ),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weekly Schedule</h1>
          <p className="text-sm text-muted-foreground">
            {startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
            {endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {days.map((day) => (
          <div
            key={day.date}
            className={`rounded-xl border bg-card p-3 shadow-sm transition-all ${
              day.isToday ? "ring-2 ring-primary/30 border-primary/30" : ""
            }`}
          >
            <p
              className={`mb-2.5 text-xs font-semibold uppercase tracking-wider ${
                day.isToday ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {day.label}
            </p>
            {day.sessions.length === 0 ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarX className="h-3 w-3" />
                No sessions
              </div>
            ) : (
              <div className="space-y-2">
                {day.sessions.map((s: (typeof day.sessions)[number]) => (
                  <Link
                    key={s.id}
                    href={`/patients/${s.patient.id}`}
                    className="block rounded-lg border p-2.5 text-xs transition-all hover:bg-accent hover:shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3 w-3 text-primary" />
                      {new Date(s.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                    <p className="mt-1 font-medium">{s.patient.fullName.split(" ")[0]}</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{s.therapist?.fullName ?? "Unassigned"}</span>
                    </div>
                    <Badge
                      variant={
                        s.status === "completed" ? "default" : "outline"
                      }
                      className="mt-1.5"
                    >
                      {s.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
