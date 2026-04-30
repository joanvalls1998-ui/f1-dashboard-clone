import { DriverStandings } from "@/components/DriverStandings";
import { ConstructorStandings } from "@/components/ConstructorStandings";
import { RaceCalendar } from "@/components/RaceCalendar";
import { LastRace } from "@/components/LastRace";
import { NextRace } from "@/components/NextRace";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">F1 Dashboard</h1>
        <p className="text-muted-foreground">
          Your ultimate source for Formula 1 statistics and live race data.
        </p>
      </div>

      {/* Race info cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LastRace />
        <NextRace />
      </div>

      {/* Driver Standings */}
      <DriverStandings />

      {/* Constructor Standings */}
      <ConstructorStandings />

      {/* Race Calendar */}
      <RaceCalendar />
    </div>
  );
}
