"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SessionPreview } from "./session-preview";
import { generateSessions } from "@/lib/scheduler/generate-sessions";
import { Calendar, Repeat, Clock, Timer, Hash } from "lucide-react";
import type {
  FrequencyDuration,
  SessionFrequency,
  SessionDuration,
} from "@/types/patient";

interface SessionSchedulerProps {
  value: FrequencyDuration;
  onChange: (value: FrequencyDuration) => void;
  errors?: Record<string, string>;
  assignedTherapistId?: string | null;
}

export function SessionScheduler({
  value,
  onChange,
  errors,
  assignedTherapistId,
}: SessionSchedulerProps) {
  const preview = useMemo(() => generateSessions(value), [value]);

  return (
    <div className="space-y-4 rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Repeat className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-semibold">Session Schedule</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Repeat className="h-3 w-3" />
            Frequency
          </Label>
          <Select
            value={value.frequency}
            onValueChange={(v) => {
              if (v) onChange({ ...value, frequency: v as SessionFrequency });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1x/week">1x/week</SelectItem>
              <SelectItem value="2x/week">2x/week</SelectItem>
              <SelectItem value="3x/week">3x/week</SelectItem>
              <SelectItem value="5x/week">5x/week</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
          {errors?.["frequencyDuration.frequency"] && (
            <p className="text-xs text-destructive">
              {errors["frequencyDuration.frequency"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Timer className="h-3 w-3" />
            Duration (min)
          </Label>
          <Select
            value={String(value.durationMinutes)}
            onValueChange={(v) => {
              if (v) onChange({ ...value, durationMinutes: Number(v) as SessionDuration });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="45">45 min</SelectItem>
              <SelectItem value="60">60 min</SelectItem>
              <SelectItem value="90">90 min</SelectItem>
            </SelectContent>
          </Select>
          {errors?.["frequencyDuration.durationMinutes"] && (
            <p className="text-xs text-destructive">
              {errors["frequencyDuration.durationMinutes"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Hash className="h-3 w-3" />
            Total Weeks
          </Label>
          <Input
            type="number"
            min={1}
            max={52}
            value={value.totalWeeks}
            onChange={(e) =>
              onChange({
                ...value,
                totalWeeks: Math.min(52, Math.max(1, Number(e.target.value))),
              })
            }
          />
          {errors?.["frequencyDuration.totalWeeks"] && (
            <p className="text-xs text-destructive">
              {errors["frequencyDuration.totalWeeks"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Clock className="h-3 w-3" />
            Time of Day
          </Label>
          <Select
            value={value.preferredTimeOfDay}
            onValueChange={(v) => {
              if (v) {
                onChange({
                  ...value,
                  preferredTimeOfDay: v as FrequencyDuration["preferredTimeOfDay"],
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="any">Any</SelectItem>
            </SelectContent>
          </Select>
          {errors?.["frequencyDuration.preferredTimeOfDay"] && (
            <p className="text-xs text-destructive">
              {errors["frequencyDuration.preferredTimeOfDay"]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Calendar className="h-3 w-3" />
          Start Date
        </Label>
        <Input
          type="date"
          value={value.startDate}
          onChange={(e) =>
            onChange({ ...value, startDate: e.target.value })
          }
        />
        {errors?.["frequencyDuration.startDate"] && (
          <p className="text-xs text-destructive">
            {errors["frequencyDuration.startDate"]}
          </p>
        )}
      </div>

      <SessionPreview
        frequencyDuration={value}
        assignedTherapistId={assignedTherapistId}
      />
    </div>
  );
}
