import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
      sessions: sessions.filter(
        (s: (typeof sessions)[number]) => s.scheduledAt.toISOString().split("T")[0] === dayStr
      ),
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Weekly Schedule</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {days.map((day) => (
          <div key={day.date} className="rounded-lg border bg-card p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {day.label}
            </p>
            {day.sessions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No sessions</p>
            ) : (
              <div className="space-y-2">
                {day.sessions.map((s: (typeof day.sessions)[number]) => (
                  <Link
                    key={s.id}
                    href={`/patients/${s.patient.id}`}
                    className="block rounded border p-2 text-xs transition-colors hover:bg-muted"
                  >
                    <p className="font-medium">
                      {new Date(s.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <p>{s.patient.fullName.split(" ")[0]}</p>
                    <p className="text-muted-foreground">
                      {s.therapist?.fullName ?? "Unassigned"}
                    </p>
                    <Badge
                      variant={
                        s.status === "completed" ? "default" : "outline"
                      }
                      className="mt-1"
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
