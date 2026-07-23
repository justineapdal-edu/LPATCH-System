import Link from "next/link";

interface ActivityItem {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  patientId: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No recent activity.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/patients/${item.patientId}`}
            className="block transition-opacity hover:opacity-80"
          >
            <p className="text-xs text-muted-foreground">
              {timeAgo(item.timestamp)}
            </p>
            <p className="mt-1 text-sm">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
