import { KpiCard } from "@/components/dashboard/kpi-card";
import { DailySchedule } from "@/components/dashboard/daily-schedule";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { getDashboardKpis, getRecentActivity } from "@/lib/actions/get-dashboard-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  Clock,
  TrendingUp,
  Plus,
  List,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpis, activities] = await Promise.all([
    getDashboardKpis(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Active Patients"
          value={kpis.activePatients}
          subtitle="Currently in treatment"
          icon={Users}
        />
        <KpiCard
          title="Sessions Today"
          value={kpis.todaySessions}
          subtitle={`${kpis.completedToday} done / ${kpis.upcomingToday} upcoming`}
          icon={CalendarCheck}
        />
        <KpiCard
          title="Pending Sessions"
          value={kpis.pendingSessions}
          subtitle="Scheduled across all patients"
          icon={Clock}
        />
        <KpiCard
          title="Patient Retention"
          value={`${kpis.retention}%`}
          subtitle="Active vs total patients"
          icon={TrendingUp}
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
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Patient
          </Button>
        </Link>
        <Link href="/patients">
          <Button variant="outline" className="gap-1.5">
            <List className="h-4 w-4" />
            View All Patients
          </Button>
        </Link>
        <Link href="/schedule">
          <Button variant="outline" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Full Calendar
          </Button>
        </Link>
      </div>
    </div>
  );
}
