import { prisma } from "@/lib/db";

export async function getDashboardKpis() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    activePatients,
    totalPatients,
    dischargedPatients,
    todaySessions,
    completedToday,
    pendingSessions,
  ] = await Promise.all([
    prisma.patient.count({ where: { status: "active" } }),
    prisma.patient.count(),
    prisma.patient.count({ where: { status: "discharged" } }),
    prisma.therapySession.findMany({
      where: {
        scheduledAt: { gte: todayStart, lte: todayEnd },
      },
      include: {
        patient: { select: { fullName: true } },
        therapist: { select: { fullName: true } },
      },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.therapySession.count({
      where: {
        scheduledAt: { gte: todayStart, lte: todayEnd },
        status: "completed",
      },
    }),
    prisma.therapySession.count({
      where: {
        status: "scheduled",
        scheduledAt: { gt: now },
      },
    }),
  ]);

  const retention =
    totalPatients > 0
      ? Math.round((activePatients / totalPatients) * 100)
      : 0;

  return {
    activePatients,
    todaySessions: todaySessions.length,
    completedToday,
    upcomingToday: todaySessions.length - completedToday,
    pendingSessions,
    retention,
    todaySchedule: todaySessions.map((s: (typeof todaySessions)[number]) => ({
      id: s.id,
      patientName: s.patient.fullName,
      patientId: s.patientId,
      scheduledAt: s.scheduledAt.toISOString(),
      durationMinutes: s.durationMinutes,
      status: s.status,
      therapistName: s.therapist?.fullName ?? null,
      sessionNumber: s.sessionNumber,
      sessionType: s.sessionType,
    })),
  };
}

export async function getRecentActivity() {
  const assessments = await prisma.physicalTherapyAssessment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      patient: { select: { id: true, fullName: true } },
    },
  });

  return assessments.map((a: (typeof assessments)[number]) => ({
    id: a.id,
    type: "assessment_completed" as const,
    timestamp: a.createdAt.toISOString(),
    description: `Assessment #${a.assessmentNumber} completed for ${a.patient.fullName.split(" ")[0]} ${a.patient.fullName.split(" ").slice(-1)[0]?.[0] ?? ""}.`,
    patientId: a.patient.id,
    patientName: a.patient.fullName.split(" ")[0],
  }));
}

export async function getWeeklyCalendar(weekOffset = 0) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const sessions = await prisma.therapySession.findMany({
    where: {
      scheduledAt: { gte: monday, lte: sunday },
    },
    include: {
      patient: { select: { fullName: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const dayStr = day.toISOString().split("T")[0];
    const isToday =
      day.toISOString().split("T")[0] === now.toISOString().split("T")[0];

    days.push({
      date: dayStr,
      isToday,
      sessions: sessions
        .filter(
          (s: (typeof sessions)[number]) =>
            s.scheduledAt.toISOString().split("T")[0] === dayStr
        )
        .map((s: (typeof sessions)[number]) => ({
          id: s.id,
          patientName: s.patient.fullName,
          patientId: s.patientId,
          scheduledAt: s.scheduledAt.toISOString(),
          durationMinutes: s.durationMinutes,
          status: s.status,
          sessionType: s.sessionType,
        })),
    });
  }

  return days;
}
