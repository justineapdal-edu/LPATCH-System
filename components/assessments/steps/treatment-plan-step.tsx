import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SessionScheduler } from "@/components/schedule/session-scheduler";
import type { TreatmentPlan, FrequencyDuration } from "@/types/patient";

interface Props {
  data: TreatmentPlan;
  onChange: (data: TreatmentPlan) => void;
  errors: Record<string, string>;
}

export function TreatmentPlanStep({ data, onChange, errors }: Props) {
  function updateFd(fd: FrequencyDuration) {
    onChange({ ...data, frequencyDuration: fd });
  }

  function update(field: keyof TreatmentPlan, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Treatment Plan</h2>

      <SessionScheduler
        value={data.frequencyDuration}
        onChange={updateFd}
        errors={errors}
      />

      <div className="space-y-2">
        <Label>Therapeutic Exercises *</Label>
        <Textarea
          value={data.therapeuticExercises}
          onChange={(e) => update("therapeuticExercises", e.target.value)}
        />
        {errors["treatmentPlan.therapeuticExercises"] && (
          <p className="text-xs text-destructive">
            {errors["treatmentPlan.therapeuticExercises"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Home Exercise Program *</Label>
        <Textarea
          value={data.homeExerciseProgram}
          onChange={(e) => update("homeExerciseProgram", e.target.value)}
        />
        {errors["treatmentPlan.homeExerciseProgram"] && (
          <p className="text-xs text-destructive">
            {errors["treatmentPlan.homeExerciseProgram"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Modalities</Label>
        <Textarea
          value={data.modalities}
          onChange={(e) => update("modalities", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Manual Therapy</Label>
        <Textarea
          value={data.manualTherapy}
          onChange={(e) => update("manualTherapy", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Education and Counseling</Label>
        <Textarea
          value={data.educationCounseling}
          onChange={(e) => update("educationCounseling", e.target.value)}
        />
      </div>
    </div>
  );
}
