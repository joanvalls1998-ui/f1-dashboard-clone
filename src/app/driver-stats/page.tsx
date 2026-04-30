import { BarChart3 } from "lucide-react";

export default function DriverStatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Stats</h1>
        <p className="text-muted-foreground">
          Detailed statistics and performance metrics for all drivers.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Driver Statistics</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Driver statistics will be displayed here.
        </p>
      </div>
    </div>
  );
}
