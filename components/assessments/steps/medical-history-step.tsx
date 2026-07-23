import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { MedicalHistory } from "@/types/patient";

interface Props {
  data: MedicalHistory;
  onChange: (data: MedicalHistory) => void;
  errors: Record<string, string>;
}

const checkboxes: { key: keyof MedicalHistory; label: string }[] = [
  { key: "hypertension", label: "Hypertension" },
  { key: "diabetes", label: "Diabetes" },
  { key: "cardiovascularDisease", label: "Cardiovascular Disease" },
  { key: "respiratoryConditions", label: "Respiratory Conditions" },
  { key: "neurologicalDisorders", label: "Neurological Disorders" },
  { key: "musculoskeletalInjuries", label: "Musculoskeletal Injuries" },
];

export function MedicalHistoryStep({ data, onChange }: Props) {
  function toggleCheck(key: keyof MedicalHistory) {
    onChange({ ...data, [key]: !data[key] });
  }

  function update(key: keyof MedicalHistory, value: string) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Medical History</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {checkboxes.map((cb) => (
          <label
            key={cb.key}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox
              checked={Boolean(data[cb.key])}
              onCheckedChange={() => toggleCheck(cb.key)}
            />
            {cb.label}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Surgeries</Label>
        <Input
          value={data.surgeries}
          onChange={(e) => update("surgeries", e.target.value)}
          placeholder="Specify surgeries..."
        />
      </div>

      <div className="space-y-2">
        <Label>Medications</Label>
        <Textarea
          value={data.medications}
          onChange={(e) => update("medications", e.target.value)}
          placeholder="List current medications..."
        />
      </div>

      <div className="space-y-2">
        <Label>Allergies</Label>
        <Input
          value={data.allergies}
          onChange={(e) => update("allergies", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Other Relevant History</Label>
        <Textarea
          value={data.otherHistory}
          onChange={(e) => update("otherHistory", e.target.value)}
        />
      </div>
    </div>
  );
}
