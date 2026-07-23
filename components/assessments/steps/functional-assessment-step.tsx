import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FunctionalAssessment } from "@/types/patient";

interface Props {
  data: FunctionalAssessment;
  onChange: (data: FunctionalAssessment) => void;
  errors: Record<string, string>;
}

export function FunctionalAssessmentStep({ data, onChange, errors }: Props) {
  function update(field: keyof FunctionalAssessment, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Functional Assessment</h2>

      <div className="space-y-2">
        <Label>Activities of Daily Living (ADLs) *</Label>
        <Textarea
          value={data.adls}
          onChange={(e) => update("adls", e.target.value)}
        />
        {errors["functionalAssessment.adls"] && (
          <p className="text-xs text-destructive">
            {errors["functionalAssessment.adls"]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Mobility Status *</Label>
          <Input
            value={data.mobilityStatus}
            onChange={(e) => update("mobilityStatus", e.target.value)}
          />
          {errors["functionalAssessment.mobilityStatus"] && (
            <p className="text-xs text-destructive">
              {errors["functionalAssessment.mobilityStatus"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Balance and Coordination *</Label>
          <Input
            value={data.balanceCoordination}
            onChange={(e) => update("balanceCoordination", e.target.value)}
          />
          {errors["functionalAssessment.balanceCoordination"] && (
            <p className="text-xs text-destructive">
              {errors["functionalAssessment.balanceCoordination"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Assistive Devices Used</Label>
          <Input
            value={data.assistiveDevices}
            onChange={(e) => update("assistiveDevices", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Work / School Limitations</Label>
        <Textarea
          value={data.workLimitations}
          onChange={(e) => update("workLimitations", e.target.value)}
        />
      </div>
    </div>
  );
}
