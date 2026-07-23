import { prisma } from "@/lib/db";
import { PatientTable } from "@/components/patients/patient-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface PatientsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = params.status ?? "";
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 20;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { contactNumber: { contains: search } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        gender: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.patient.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{total} total patients</p>
        </div>
        <Link href="/patients/new">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Patient
          </Button>
        </Link>
      </div>

      <PatientTable
        patients={patients.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        }))}
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/patients?page=${p}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
            >
              <Button variant={p === page ? "default" : "outline"} size="sm">
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
