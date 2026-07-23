import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PhysicalExamination } from "@/types/patient";

interface Props {
  data: PhysicalExamination;
  onChange: (data: PhysicalExamination) => void;
  errors: Record<string, string>;
}

const fields: { key: keyof PhysicalExamination; label: string; required: boolean }[] = [
  { key: "posture", label: "Posture", required: true },
  { key: "gait", label: "Gait", required: true },
  { key: "rangeOfMotion", label: "Range of Motion", required: true },
  { key: "muscleStrength", label: "Muscle Strength", required: true },
  { key: "jointIntegrity", label: "Joint Integrity", required: true },
  { key: "neurologicalScreening", label: "Neurological Screening", required: true },
  { key: "specialTests", label: "Special Tests", required: false },
];

export function PhysicalExamStep({ data, onChange, errors }: Props) {
  function update(field: keyof PhysicalExamination, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Physical Examination</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label>
              {f.label} {f.required && "*"}
            </Label>
            <Input
              value={data[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
            />
            {errors[`physicalExamination.${f.key}`] && (
              <p className="text-xs text-destructive">
                {errors[`physicalExamination.${f.key}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
