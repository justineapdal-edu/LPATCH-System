import { KpiCard } from "@/components/dashboard/kpi-card";
import { DailySchedule } from "@/components/dashboard/daily-schedule";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { getDashboardKpis, getRecentActivity } from "@/lib/actions/get-dashboard-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpis, activities] = await Promise.all([
    getDashboardKpis(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Active Patients"
          value={kpis.activePatients}
          subtitle="Currently in treatment"
          icon="👥"
        />
        <KpiCard
          title="Sessions Today"
          value={kpis.todaySessions}
          subtitle={`${kpis.completedToday} done / ${kpis.upcomingToday} upcoming`}
          icon="📅"
        />
        <KpiCard
          title="Pending Sessions"
          value={kpis.pendingSessions}
          subtitle="Scheduled across all patients"
          icon="⏳"
        />
        <KpiCard
          title="Patient Retention"
          value={`${kpis.retention}%`}
          subtitle="Active vs total patients"
          icon="📈"
        />
      </div>

      {/* Schedule + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DailySchedule entries={kpis.todaySchedule} />
        </div>
        <div>
          <ActivityFeed items={activities} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/patients/new">
          <Button>+ New Patient</Button>
        </Link>
        <Link href="/patients">
          <Button variant="outline">View All Patients</Button>
        </Link>
        <Link href="/schedule">
          <Button variant="outline">Full Calendar</Button>
        </Link>
      </div>
    </div>
  );
}
