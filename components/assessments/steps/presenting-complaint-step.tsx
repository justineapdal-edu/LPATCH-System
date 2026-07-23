import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import type { PresentingComplaint } from "@/types/patient";

interface Props {
  data: PresentingComplaint;
  onChange: (data: PresentingComplaint) => void;
  errors: Record<string, string>;
}

export function PresentingComplaintStep({ data, onChange, errors }: Props) {
  function update(field: keyof PresentingComplaint, value: unknown) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Presenting Complaint</h2>

      <div className="space-y-2">
        <Label>Description of Symptoms *</Label>
        <Textarea
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
        {errors["presentingComplaint.description"] && (
          <p className="text-xs text-destructive">
            {errors["presentingComplaint.description"]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Onset and Duration *</Label>
          <Input
            value={data.onsetDuration}
            onChange={(e) => update("onsetDuration", e.target.value)}
          />
          {errors["presentingComplaint.onsetDuration"] && (
            <p className="text-xs text-destructive">
              {errors["presentingComplaint.onsetDuration"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Aggravating / Relieving Factors *</Label>
          <Input
            value={data.aggravatingRelievingFactors}
            onChange={(e) =>
              update("aggravatingRelievingFactors", e.target.value)
            }
          />
          {errors["presentingComplaint.aggravatingRelievingFactors"] && (
            <p className="text-xs text-destructive">
              {errors["presentingComplaint.aggravatingRelievingFactors"]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Pain Scale: {data.painScale}/10</Label>
        <Slider
          value={[data.painScale]}
          onValueChange={(val) => {
            const v = Array.isArray(val) ? val[0] : val;
            update("painScale", v ?? 5);
          }}
          min={0}
          max={10}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 - No pain</span>
          <span>10 - Worst pain</span>
        </div>
        {errors["presentingComplaint.painScale"] && (
          <p className="text-xs text-destructive">
            {errors["presentingComplaint.painScale"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Functional Limitations *</Label>
        <Textarea
          value={data.functionalLimitations}
          onChange={(e) => update("functionalLimitations", e.target.value)}
        />
        {errors["presentingComplaint.functionalLimitations"] && (
          <p className="text-xs text-destructive">
            {errors["presentingComplaint.functionalLimitations"]}
          </p>
        )}
      </div>
    </div>
  );
}
