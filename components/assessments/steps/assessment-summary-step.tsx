import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AssessmentSummary } from "@/types/patient";

interface Props {
  data: AssessmentSummary;
  onChange: (data: AssessmentSummary) => void;
  errors: Record<string, string>;
}

export function AssessmentSummaryStep({ data, onChange, errors }: Props) {
  function update(field: keyof AssessmentSummary, value: string) {
    onChange({ ...data, [field]: value });
  }

  const fields: { key: keyof AssessmentSummary; label: string }[] = [
    { key: "clinicalImpression", label: "Clinical Impression" },
    { key: "ptDiagnosis", label: "PT Diagnosis" },
    { key: "prognosis", label: "Prognosis" },
    { key: "goals", label: "Goals (Short-term and Long-term)" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Assessment Summary</h2>
      {fields.map((f) => (
        <div key={f.key} className="space-y-2">
          <Label>{f.label} *</Label>
          <Textarea
            value={data[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
          />
          {errors[`assessmentSummary.${f.key}`] && (
            <p className="text-xs text-destructive">
              {errors[`assessmentSummary.${f.key}`]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
