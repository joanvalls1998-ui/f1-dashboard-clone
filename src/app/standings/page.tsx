import { DriverStandings } from "@/components/DriverStandings";

export default function StandingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Standings</h1>
        <p className="text-muted-foreground">
          Current Formula 1 driver championship standings.
        </p>
      </div>
      <DriverStandings />
    </div>
  );
}
