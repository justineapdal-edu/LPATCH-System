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
      <div className="rounded-lg border bg-card p-8 text-center text-card-foreground shadow-sm">
        <p className="text-muted-foreground">No patients found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
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
              <TableCell className="font-medium">{p.fullName}</TableCell>
              <TableCell className="capitalize">{p.gender.replace("_", " ")}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString("en-US")}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/patients/${p.id}`}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
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
