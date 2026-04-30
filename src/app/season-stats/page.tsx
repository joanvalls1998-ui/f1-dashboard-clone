import { SeasonStats } from "@/components/SeasonStats";

export default function SeasonStatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Season Stats</h1>
        <p className="text-muted-foreground">
          Championship standings progression.
        </p>
      </div>
      <SeasonStats />
    </div>
  );
}
