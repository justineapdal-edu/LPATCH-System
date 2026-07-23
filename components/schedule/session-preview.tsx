"use client";

import { useMemo, useState } from "react";
import { generateSessions } from "@/lib/scheduler/generate-sessions";
import type { FrequencyDuration } from "@/types/patient";

interface SessionPreviewProps {
  frequencyDuration: FrequencyDuration;
  assignedTherapistId?: string | null;
}

function getSessionsPerWeek(frequency: string): number {
  const map: Record<string, number> = {
    "1x/week": 1,
    "2x/week": 2,
    "3x/week": 3,
    "5x/week": 5,
    daily: 7,
  };
  return map[frequency] ?? 1;
}

export function SessionPreview({
  frequencyDuration,
  assignedTherapistId,
}: SessionPreviewProps) {
  const sessions = useMemo(
    () => generateSessions(frequencyDuration),
    [frequencyDuration]
  );

  const totalMinutes =
    sessions.length * (sessions[0]?.durationMinutes ?? 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMin = totalMinutes % 60;

  const weekMap = useMemo(() => {
    const map = new Map<number, typeof sessions>();
    sessions.forEach((s) => {
      const weekNum = Math.ceil(
        s.sessionNumber / getSessionsPerWeek(frequencyDuration.frequency)
      );
      const weekSessions = map.get(weekNum) ?? [];
      weekSessions.push(s);
      map.set(weekNum, weekSessions);
    });
    return map;
  }, [sessions, frequencyDuration.frequency]);

  if (sessions.length === 0) {
    return (
      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        No sessions to preview.
      </div>
    );
  }

  return (
    <div className="rounded-md bg-muted p-3 text-sm">
      <p className="font-medium">
        PREVIEW: {sessions.length} sessions scheduled
      </p>
      <p className="text-muted-foreground">
        Therapist:{" "}
        {assignedTherapistId ? "Assigned" : "Unassigned (assign later)"}
      </p>
      <div className="mt-2 max-h-40 overflow-y-auto">
        {Array.from(weekMap.entries()).map(([week, weekSessions]) => (
          <div key={week}>
            Week {week}:{" "}
            {weekSessions
              .map((s) =>
                new Date(s.scheduledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })
              )
              .join(" · ")}
          </div>
        ))}
      </div>
      <p className="mt-2 text-muted-foreground">
        Total: {sessions.length} sessions × {sessions[0]?.durationMinutes} min
        = {totalHours}h {remainingMin}m
      </p>
    </div>
  );
}
