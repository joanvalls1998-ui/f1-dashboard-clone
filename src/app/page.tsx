import DriverStandings from "@/components/DriverStandings";
import ConstructorStandings from "@/components/ConstructorStandings";
import { RaceCalendar } from "@/components/RaceCalendar";
import LastRace from "@/components/LastRace";
import { NextRace } from "@/components/NextRace";
import { PointsChart } from "@/components/PointsChart";
import { WinsChart } from "@/components/WinsChart";
import { BarChart3, TrendingUp } from "lucide-react";

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

      {/* Charts section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Points distribution chart */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Points Distribution</h2>
          </div>
          <PointsChart />
        </div>

        {/* Wins pie chart */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold">Race Wins</h2>
          </div>
          <WinsChart />
        </div>
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
