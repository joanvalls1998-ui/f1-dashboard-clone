"use client";

import { useEffect, useState } from "react";
import { Trophy, Flag, Clock, Hash } from "lucide-react";
import { driverImages, teamColors, getTeamColor } from "@/lib/f1-assets";
import Image from "next/image";

interface SeasonStats {
  driverStandings: DriverStat[];
  constructorStandings: ConstructorStat[];
  raceWinners: RaceWinner[];
  fastestLaps: FastestLap[];
  totalRaces: number;
  completedRaces: number;
}

interface DriverStat {
  position: number;
  driver: string;
  abbreviation: string;
  team: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
}

interface ConstructorStat {
  position: number;
  name: string;
  points: number;
  wins: number;
  podiums: number;
}

interface RaceWinner {
  raceName: string;
  winner: string;
  team: string;
  date: string;
}

interface FastestLap {
  raceName: string;
  driver: string;
  team: string;
  time: string;
}

const mockStats: SeasonStats = {
  completedRaces: 3,
  totalRaces: 22,
  driverStandings: [
    { position: 1, driver: "Andrea Kimi Antonelli", abbreviation: "ANT", team: "Mercedes", nationality: "Italian", points: 72, wins: 2, podiums: 3 },
    { position: 2, driver: "George Russell", abbreviation: "RUS", team: "Mercedes", nationality: "British", points: 55, wins: 0, podiums: 3 },
    { position: 3, driver: "Charles Leclerc", abbreviation: "LEC", team: "Ferrari", nationality: "Monegasque", points: 42, wins: 0, podiums: 2 },
    { position: 4, driver: "Lewis Hamilton", abbreviation: "HAM", team: "Ferrari", nationality: "British", points: 35, wins: 0, podiums: 2 },
    { position: 5, driver: "Lando Norris", abbreviation: "NOR", team: "McLaren", nationality: "British", points: 20, wins: 0, podiums: 1 },
    { position: 6, driver: "Oscar Piastri", abbreviation: "PIA", team: "McLaren", nationality: "Australian", points: 18, wins: 1, podiums: 1 },
    { position: 7, driver: "Pierre Gasly", abbreviation: "GAS", team: "Alpine", nationality: "French", points: 15, wins: 0, podiums: 0 },
    { position: 8, driver: "Oliver Bearman", abbreviation: "BEA", team: "Haas F1 Team", nationality: "British", points: 16, wins: 0, podiums: 0 },
    { position: 9, driver: "Liam Lawson", abbreviation: " LAW", team: "RB F1 Team", nationality: "New Zealander", points: 8, wins: 0, podiums: 0 },
    { position: 10, driver: "Isack Hadjar", abbreviation: "HAD", team: "RB F1 Team", nationality: "French", points: 4, wins: 0, podiums: 0 },
  ],
  constructorStandings: [
    { position: 1, name: "Mercedes", points: 127, wins: 2, podiums: 6 },
    { position: 2, name: "Ferrari", points: 77, wins: 0, podiums: 4 },
    { position: 3, name: "McLaren", points: 38, wins: 1, podiums: 2 },
    { position: 4, name: "Alpine", points: 15, wins: 0, podiums: 0 },
    { position: 5, name: "Haas F1 Team", points: 16, wins: 0, podiums: 0 },
    { position: 6, name: "RB F1 Team", points: 12, wins: 0, podiums: 0 },
  ],
  raceWinners: [
    { raceName: "Australian Grand Prix", winner: "Andrea Kimi Antonelli", team: "Mercedes", date: "2026-03-08" },
    { raceName: "Chinese Grand Prix", winner: "Andrea Kimi Antonelli", team: "Mercedes", date: "2026-03-15" },
    { raceName: "Japanese Grand Prix", winner: "Oscar Piastri", team: "McLaren", date: "2026-03-29" },
  ],
  fastestLaps: [
    { raceName: "Australian Grand Prix", driver: "Oscar Piastri", team: "McLaren", time: "1:19.546" },
    { raceName: "Chinese Grand Prix", driver: "Andrea Kimi Antonelli", team: "Mercedes", time: "1:34.183" },
    { raceName: "Japanese Grand Prix", driver: "Oscar Piastri", team: "McLaren", time: "1:28.103" },
  ],
};

export default function SeasonStatsPage() {
  const [stats, setStats] = useState<SeasonStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch driver standings
        const driversRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverStandings.json", { signal: AbortSignal.timeout(8000) });
        // Fetch constructor standings
        const constructorsRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json", { signal: AbortSignal.timeout(8000) });
        // Fetch race winners from results
        const resultsRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/results.json?limit=100", { signal: AbortSignal.timeout(8000) });

        if (driversRes.ok && constructorsRes.ok && resultsRes.ok) {
          const driversData = await driversRes.json();
          const constructorsData = await constructorsRes.json();
          const resultsData = await resultsRes.json();

          // Parse driver standings
          const driverRows = driversData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
          const parsedDrivers: DriverStat[] = driverRows.map((d: any) => ({
            position: parseInt(d.position),
            driver: `${d.Driver.givenName} ${d.Driver.familyName}`,
            abbreviation: d.Driver.code,
            team: d.Constructors[0].name,
            nationality: d.Driver.nationality,
            points: parseInt(d.points),
            wins: parseInt(d.wins),
            podiums: 0, // Not in standings
          }));

          // Parse constructor standings
          const constructorRows = constructorsData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
          const parsedConstructors: ConstructorStat[] = constructorRows.map((c: any) => ({
            position: parseInt(c.position),
            name: c.Constructor.name,
            points: parseInt(c.points),
            wins: parseInt(c.wins),
            podiums: 0,
          }));

          // Parse race winners
          const races = resultsData.MRData.RaceTable.Races || [];
          const winners: RaceWinner[] = races
            .filter((r: any) => r.Results && r.Results[0]?.position === "1")
            .map((r: any) => ({
              raceName: r.raceName,
              winner: `${r.Results[0].Driver.givenName} ${r.Results[0].Driver.familyName}`,
              team: r.Results[0].Constructor.name,
              date: r.date,
            }));

          setStats({
            ...mockStats,
            driverStandings: parsedDrivers,
            constructorStandings: parsedConstructors,
            raceWinners: winners,
            completedRaces: winners.length,
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setStats(mockStats);
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="border-2 rounded-full h-8 w-8 animate-spin" style={{ borderColor: 'var(--bg-overlay)', borderTopColor: 'var(--accent-red)' }} />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>2026 Season Statistics</h1>
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {stats.completedRaces} / {stats.totalRaces} races completed
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-yellow-500">{stats.completedRaces}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Races Completed</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-cyan-500">{stats.driverStandings[0]?.points || 0}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Leader Points</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-orange-500">{stats.constructorStandings[0]?.points || 0}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Leader Constructor</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-green-500">{stats.raceWinners.length}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Unique Winners</div>
        </div>
      </div>

      {/* Driver Championship */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Driver Championship</h2>
        <div className="space-y-2">
          {stats.driverStandings.slice(0, 10).map((driver) => (
            <div key={driver.abbreviation} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
              <div className="w-8 text-center font-bold text-lg">
                <span className={
                  driver.position === 1 ? "text-yellow-500" :
                  driver.position === 2 ? "var(--text-muted)" :
                  driver.position === 3 ? "text-amber-600" : ""
                }>
                  {driver.position}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                {driverImages[driver.abbreviation] && (
                  <Image
                    src={driverImages[driver.abbreviation]}
                    alt={driver.driver}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{driver.driver}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.team}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{driver.points} pts</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.wins} wins</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constructor Championship */}
      <div className="bg-card rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Constructor Championship</h2>
        <div className="space-y-2">
          {stats.constructorStandings.map((team) => (
            <div key={team.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
              <div className="w-8 text-center font-bold text-lg">
                <span className={
                  team.position === 1 ? "text-yellow-500" :
                  team.position === 2 ? "var(--text-muted)" :
                  team.position === 3 ? "text-amber-600" : ""
                }>
                  {team.position}
                </span>
              </div>
              <div className="w-4 h-8 rounded-full" style={{ backgroundColor: getTeamColor(team.name) }} />
              <div className="flex-1">
                <div className="font-medium">{team.name}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{team.points} pts</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{team.wins} wins</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Race Winners & Fastest Laps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Flag className="w-5 h-5 text-green-500" />
            Race Winners
          </h2>
          <div className="space-y-3">
            {stats.raceWinners.map((race, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{race.raceName}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{race.winner} ({race.team})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            Fastest Laps
          </h2>
          <div className="space-y-3">
            {stats.fastestLaps.map((lap, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 var(--text-primary) flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{lap.raceName}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{lap.driver} ({lap.team})</div>
                </div>
                <div className="font-mono text-sm font-bold">{lap.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
