import { DriverStandings } from "@/components/DriverStandings";
import { ConstructorStandings } from "@/components/ConstructorStandings";
import { RaceCalendar } from "@/components/RaceCalendar";
import { LastRace } from "@/components/LastRace";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to F1 Dashboard</h1>
        <p className="text-muted-foreground">
          Your ultimate source for Formula 1 statistics and live race data.
        </p>
      </div>

      {/* Last Race */}
      <LastRace />

      {/* Driver Standings */}
      <DriverStandings />

      {/* Constructor Standings */}
      <ConstructorStandings />

      {/* Race Calendar */}
      <RaceCalendar />
    </div>
  );
}
