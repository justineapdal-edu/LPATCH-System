import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePadComponent } from "@/components/assessments/signature-pad";
import type { TherapistNotes, TherapistOnDuty } from "@/types/patient";

interface Props {
  data: TherapistNotes;
  onNotesChange: (data: TherapistNotes) => void;
  onDutyChange: (data: TherapistOnDuty) => void;
  notesValue: string;
  onGeneralNotesChange: (value: string) => void;
  therapistOnDuty: TherapistOnDuty;
  errors: Record<string, string>;
}

export function TherapistNotesStep({
  data,
  onNotesChange,
  onDutyChange,
  notesValue,
  onGeneralNotesChange,
  therapistOnDuty,
  errors,
}: Props) {
  function updateNote(field: keyof TherapistNotes, value: string) {
    onNotesChange({ ...data, [field]: value });
  }

  function updateDuty(field: keyof TherapistOnDuty, value: string) {
    onDutyChange({ ...therapistOnDuty, [field]: value });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Therapist Notes</h2>

      <div className="space-y-2">
        <Label>Initial Response to Treatment</Label>
        <Textarea
          value={data.initialResponse}
          onChange={(e) => updateNote("initialResponse", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Recommendations</Label>
        <Textarea
          value={data.recommendations}
          onChange={(e) => updateNote("recommendations", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Follow-up Date *</Label>
        <Input
          type="date"
          value={data.followUpDate}
          onChange={(e) => updateNote("followUpDate", e.target.value)}
        />
        {errors["therapistNotes.followUpDate"] && (
          <p className="text-xs text-destructive">
            {errors["therapistNotes.followUpDate"]}
          </p>
        )}
      </div>

      <hr />

      <h3 className="text-lg font-semibold">Therapist on Duty</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={therapistOnDuty.name}
            onChange={(e) => updateDuty("name", e.target.value)}
          />
          {errors["therapistOnDuty.name"] && (
            <p className="text-xs text-destructive">
              {errors["therapistOnDuty.name"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>License # *</Label>
          <Input
            value={therapistOnDuty.licenseNumber}
            onChange={(e) => updateDuty("licenseNumber", e.target.value)}
          />
          {errors["therapistOnDuty.licenseNumber"] && (
            <p className="text-xs text-destructive">
              {errors["therapistOnDuty.licenseNumber"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date *</Label>
          <Input
            type="date"
            value={therapistOnDuty.date}
            onChange={(e) => updateDuty("date", e.target.value)}
          />
          {errors["therapistOnDuty.date"] && (
            <p className="text-xs text-destructive">
              {errors["therapistOnDuty.date"]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Signature *</Label>
        <SignaturePadComponent
          value={therapistOnDuty.signatureBase64}
          onChange={(v) => updateDuty("signatureBase64", v)}
          error={errors["therapistOnDuty.signatureBase64"]}
        />
      </div>

      <div className="space-y-2">
        <Label>Additional Notes</Label>
        <Textarea
          value={notesValue}
          onChange={(e) => onGeneralNotesChange(e.target.value)}
        />
      </div>
    </div>
  );
}
