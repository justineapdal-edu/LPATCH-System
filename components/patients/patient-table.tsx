import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Users } from "lucide-react";

interface PatientRow {
  id: string;
  fullName: string;
  gender: string;
  status: string;
  createdAt: string;
}

interface PatientTableProps {
  patients: PatientRow[];
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

export function PatientTable({ patients }: PatientTableProps) {
  if (patients.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center text-card-foreground shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">No patients found</p>
        <p className="mt-1 text-xs text-muted-foreground">Add your first patient to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{p.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="capitalize">{p.gender.replace("_", " ")}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(p.createdAt).toLocaleDateString("en-US")}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/patients/${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
