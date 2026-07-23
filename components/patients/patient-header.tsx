import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Shield,
  Plus,
} from "lucide-react";

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
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{patient.fullName}</h1>
              <Badge variant={statusVariant(patient.status)}>
                {patient.status}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {patient.gender}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {patient.contactNumber}
              </span>
              {patient.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {patient.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(patient.dateOfBirth).toLocaleDateString("en-US")}
              </span>
              {patient.occupation && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {patient.occupation}
                </span>
              )}
              {patient.emergencyContactName && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Emergency: {patient.emergencyContactName} ({patient.emergencyContactPhone})
                </span>
              )}
              {patient.insuranceProvider && (
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  {patient.insuranceProvider} {patient.insurancePolicyNumber}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/patients/${patient.id}/assessment`}>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
