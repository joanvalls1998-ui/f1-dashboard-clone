import { SeasonStats } from "@/components/SeasonStats";

export default function SeasonStatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Season Statistics</h1>
        <p className="text-muted-foreground">
          Season leaders in wins, podiums, and fastest laps. Points progression chart for selected drivers.
        </p>
      </div>
      <SeasonStats />
    </div>
  );
}
