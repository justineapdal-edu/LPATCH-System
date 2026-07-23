import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PatientInformation } from "@/types/patient";

interface Props {
  data: PatientInformation;
  onChange: (data: PatientInformation) => void;
  errors: Record<string, string>;
  readOnly?: boolean;
}

export function PatientInfoStep({ data, onChange, errors, readOnly }: Props) {
  function update(field: keyof PatientInformation, value: string) {
    onChange({ ...data, [field]: value });
  }

  const fieldError = (field: string) =>
    errors[`patientInformation.${field}`];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Patient Information</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            readOnly={readOnly}
          />
          {fieldError("fullName") && (
            <p className="text-xs text-destructive">{fieldError("fullName")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Address *</Label>
          <Input
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
          />
          {fieldError("address") && (
            <p className="text-xs text-destructive">{fieldError("address")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            readOnly={readOnly}
          />
          {fieldError("dateOfBirth") && (
            <p className="text-xs text-destructive">
              {fieldError("dateOfBirth")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select
            value={data.gender}
            onValueChange={(v) => { if (v) update("gender", v); }}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
          {fieldError("gender") && (
            <p className="text-xs text-destructive">{fieldError("gender")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Contact Number *</Label>
          <Input
            type="tel"
            value={data.contactNumber}
            onChange={(e) => update("contactNumber", e.target.value)}
            readOnly={readOnly}
          />
          {fieldError("contactNumber") && (
            <p className="text-xs text-destructive">
              {fieldError("contactNumber")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            readOnly={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label>Occupation</Label>
          <Input
            value={data.occupation}
            onChange={(e) => update("occupation", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Hobbies</Label>
          <Input
            value={data.hobbies}
            onChange={(e) => update("hobbies", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Date of Assessment *</Label>
          <Input
            type="date"
            value={data.dateOfAssessment}
            onChange={(e) => update("dateOfAssessment", e.target.value)}
          />
          {fieldError("dateOfAssessment") && (
            <p className="text-xs text-destructive">
              {fieldError("dateOfAssessment")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Referring Doctor</Label>
          <Input
            value={data.referringDoctor}
            onChange={(e) => update("referringDoctor", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Emergency Contact Name *</Label>
          <Input
            value={data.emergencyContactName}
            onChange={(e) => update("emergencyContactName", e.target.value)}
          />
          {fieldError("emergencyContactName") && (
            <p className="text-xs text-destructive">
              {fieldError("emergencyContactName")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Emergency Contact Phone *</Label>
          <Input
            type="tel"
            value={data.emergencyContactPhone}
            onChange={(e) => update("emergencyContactPhone", e.target.value)}
          />
          {fieldError("emergencyContactPhone") && (
            <p className="text-xs text-destructive">
              {fieldError("emergencyContactPhone")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Insurance Provider</Label>
          <Input
            value={data.insuranceProvider}
            onChange={(e) => update("insuranceProvider", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Insurance Policy Number</Label>
          <Input
            value={data.insurancePolicyNumber}
            onChange={(e) => update("insurancePolicyNumber", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
