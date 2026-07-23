import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PatientHeaderProps {
  patient: {
    id: string;
    fullName: string;
    gender: string;
    status: string;
    contactNumber: string;
    email: string | null;
    address: string;
    dateOfBirth: string;
    occupation: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    insuranceProvider: string | null;
    insurancePolicyNumber: string | null;
  };
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "inactive":
      return "outline";
    case "discharged":
      return "destructive";
    default:
      return "outline";
  }
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{patient.fullName}</h1>
            <Badge variant={statusVariant(patient.status)}>
              {patient.status}
            </Badge>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground md:grid-cols-4">
            <span>Gender: {patient.gender}</span>
            <span>Contact: {patient.contactNumber}</span>
            {patient.email && <span>Email: {patient.email}</span>}
            <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString("en-US")}</span>
            {patient.occupation && <span>Occupation: {patient.occupation}</span>}
            {patient.emergencyContactName && (
              <span>Emergency: {patient.emergencyContactName} ({patient.emergencyContactPhone})</span>
            )}
            {patient.insuranceProvider && (
              <span>Insurance: {patient.insuranceProvider} {patient.insurancePolicyNumber}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/patients/${patient.id}/assessment`}>
            <Button variant="outline" size="sm">New Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
