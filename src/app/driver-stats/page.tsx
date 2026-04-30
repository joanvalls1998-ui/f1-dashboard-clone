import { DriverStats } from "@/components/DriverStats";

export default function DriverStatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Statistics</h1>
        <p className="text-muted-foreground">
          Detailed statistics for all F1 drivers. Select a driver to view their performance.
        </p>
      </div>
      <DriverStats />
    </div>
  );
}
