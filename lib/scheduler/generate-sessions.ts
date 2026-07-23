import type { FrequencyDuration, SessionFrequency } from "@/types/patient";

interface GeneratedSession {
  scheduledAt: Date;
  durationMinutes: number;
  sessionNumber: number;
}

function getSessionsPerWeek(frequency: SessionFrequency): number {
  const map: Record<SessionFrequency, number> = {
    "1x/week": 1,
    "2x/week": 2,
    "3x/week": 3,
    "5x/week": 5,
    daily: 7,
  };
  return map[frequency];
}

/**
 * Returns weekday indices (0=Mon..6=Sun) spread evenly across the week.
 * For N sessions/week, picks N evenly-spaced weekdays centered around Wednesday.
 */
function getPreferredDayIndices(frequency: SessionFrequency): number[] {
  const count = getSessionsPerWeek(frequency);

  if (count >= 7) {
    return [0, 1, 2, 3, 4, 5, 6];
  }

  const spread = count - 1;
  const startOffset = 2 - Math.floor(spread / 2);

  return Array.from({ length: count }, (_, i) => startOffset + i);
}

function getPreferredHour(
  timeOfDay: FrequencyDuration["preferredTimeOfDay"]
): number {
  const map = {
    morning: 9,
    afternoon: 14,
    evening: 18,
    any: 9,
  } as const;
  return map[timeOfDay];
}

export function generateSessions(fd: FrequencyDuration): GeneratedSession[] {
  const sessions: GeneratedSession[] = [];
  const sessionsPerWeek = getSessionsPerWeek(fd.frequency);
  const startDate = new Date(fd.startDate);
  const preferredDays = getPreferredDayIndices(fd.frequency);
  const preferredHour = getPreferredHour(fd.preferredTimeOfDay);

  let sessionCount = 0;
  const totalSessions = sessionsPerWeek * fd.totalWeeks;

  for (let week = 0; week < fd.totalWeeks; week++) {
    for (let dayIdx = 0; dayIdx < sessionsPerWeek; dayIdx++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(
        sessionDate.getDate() + week * 7 + preferredDays[dayIdx]
      );
      sessionDate.setHours(preferredHour, 0, 0, 0);

      sessions.push({
        scheduledAt: sessionDate,
        durationMinutes: fd.durationMinutes,
        sessionNumber: ++sessionCount,
      });

      if (sessionCount >= totalSessions) return sessions;
    }
  }

  return sessions;
}
