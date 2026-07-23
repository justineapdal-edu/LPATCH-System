import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  icon: string;
}

export function KpiCard({ title, value, subtitle, trend, icon }: KpiCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {trend && (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            trend.direction === "up" && "text-emerald-600",
            trend.direction === "down" && "text-red-600",
            trend.direction === "neutral" && "text-muted-foreground"
          )}
        >
          {trend.direction === "up" && "▲ "}
          {trend.direction === "down" && "▼ "}
          {trend.value}
        </p>
      )}
    </div>
  );
}
