import { describe, it, expect } from "vitest";
import { generateSessions } from "../generate-sessions";
import type { FrequencyDuration } from "@/types/patient";

describe("generateSessions", () => {
  const baseInput: FrequencyDuration = {
    frequency: "3x/week",
    durationMinutes: 45,
    totalWeeks: 2,
    preferredTimeOfDay: "morning",
    startDate: "2026-01-15",
  };

  it("generates correct number of sessions for 3x/week × 2 weeks", () => {
    const sessions = generateSessions(baseInput);
    expect(sessions).toHaveLength(6);
  });

  it("generates sessions with correct duration", () => {
    const sessions = generateSessions(baseInput);
    expect(sessions[0]?.durationMinutes).toBe(45);
  });

  it("generates sessions in correct date order", () => {
    const sessions = generateSessions(baseInput);
    const dates = sessions.map((s) => s.scheduledAt.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });

  it("assigns sequential session numbers", () => {
    const sessions = generateSessions(baseInput);
    const numbers = sessions.map((s) => s.sessionNumber);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("generates 1x/week sessions", () => {
    const sessions = generateSessions({ ...baseInput, frequency: "1x/week" });
    expect(sessions).toHaveLength(2);
  });

  it("generates 2x/week sessions", () => {
    const sessions = generateSessions({ ...baseInput, frequency: "2x/week" });
    expect(sessions).toHaveLength(4);
  });

  it("generates 5x/week sessions", () => {
    const sessions = generateSessions({ ...baseInput, frequency: "5x/week" });
    expect(sessions).toHaveLength(10);
  });

  it("generates daily sessions", () => {
    const sessions = generateSessions({ ...baseInput, frequency: "daily" });
    expect(sessions).toHaveLength(14);
  });

  it("respects durationMinutes", () => {
    const sessions = generateSessions({ ...baseInput, durationMinutes: 60 });
    expect(sessions[0]?.durationMinutes).toBe(60);
  });

  it("sets morning hour for morning preference", () => {
    const sessions = generateSessions(baseInput);
    expect(sessions[0]?.scheduledAt.getHours()).toBe(9);
  });

  it("sets afternoon hour for afternoon preference", () => {
    const sessions = generateSessions({
      ...baseInput,
      preferredTimeOfDay: "afternoon",
    });
    expect(sessions[0]?.scheduledAt.getHours()).toBe(14);
  });

  it("sets evening hour for evening preference", () => {
    const sessions = generateSessions({
      ...baseInput,
      preferredTimeOfDay: "evening",
    });
    expect(sessions[0]?.scheduledAt.getHours()).toBe(18);
  });
});
