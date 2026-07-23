import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  icon: LucideIcon;
}

export function KpiCard({ title, value, subtitle, trend, icon: Icon }: KpiCardProps) {
  return (
    <div className="group rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          {trend.direction === "up" && <TrendingUp className="h-3 w-3 text-emerald-600" />}
          {trend.direction === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
          {trend.direction === "neutral" && <Minus className="h-3 w-3 text-muted-foreground" />}
          <p
            className={cn(
              "text-xs font-medium",
              trend.direction === "up" && "text-emerald-600",
              trend.direction === "down" && "text-red-600",
              trend.direction === "neutral" && "text-muted-foreground"
            )}
          >
            {trend.value}
          </p>
        </div>
      )}
    </div>
  );
}
