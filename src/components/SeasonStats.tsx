"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Trophy, Target, Timer } from "lucide-react";
import { fetchDriverStandings } from "@/lib/api";
import { getTeamColor } from "@/lib/f1-assets";

interface DriverStanding {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  wins: number;
  driverId: string;
  number: string;
  nationality: string;
}

interface DriverStats {
  driverId: string;
  abbreviation: string;
  fullName: string;
  team: string;
  teamColor: string;
  wins: number;
  podiums: number;
  fastestLaps: number;
  points: number;
  position: number;
}

interface SeasonPoint {
  driver_name: string;
  team_color: string;
  rounds: number[];
  points_by_round: { round: number; points: number }[];
  total_points: number;
}

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';

// Fallback 2026 mock season data (no live session)
export function SeasonStats() {
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [seasonData, setSeasonData] = useState<SeasonPoint[]>([]);
  const [driverStats, setDriverStats] = useState<DriverStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"cumulative" | "per_round">("cumulative");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch driver standings from Ergast directly to get wins
        const standingsRes = await fetch(`${ERGAST_BASE}/current/driverstandings.json`);
        const standingsData = await standingsRes.json();
        
        const standingsList = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        const driverStandings: DriverStanding[] = standingsList.map((item: any) => ({
          position: parseInt(item.position),
          abbreviation: item.Driver.code,
          fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
          team: item.Constructors[0].name,
          points: parseInt(item.points),
          wins: parseInt(item.wins),
          driverId: item.Driver.driverId,
          number: item.Driver.permanentNumber || item.Driver.code,
          nationality: item.Driver.nationality,
        }));
        
        setDrivers(driverStandings);
        
        // Fetch all race results to calculate stats
        const resultsRes = await fetch(`${ERGAST_BASE}/current/results.json?limit=1000`);
        const resultsData = await resultsRes.json();
        
        // Fetch all qualifying results for fastest laps
        const qualyRes = await fetch(`${ERGAST_BASE}/current/qualifying.json?limit=1000`);
        const qualyData = await qualyRes.json();
        
        // Build driver stats from all races
        const statsMap: Record<string, DriverStats> = {};
        
        // Initialize stats for all drivers
        driverStandings.forEach((d) => {
          statsMap[d.driverId] = {
            driverId: d.driverId,
            abbreviation: d.abbreviation,
            fullName: d.fullName,
            team: d.team,
            teamColor: getTeamColor(d.team),
            wins: d.wins || 0,
            podiums: 0,
            fastestLaps: 0,
            points: d.points,
            position: d.position,
          };
        });
        
        // Count podiums (position 1-3) from results
        if (resultsData.MRData?.RaceTable?.Races) {
          resultsData.MRData.RaceTable.Races.forEach((race: any) => {
            race.Results?.forEach((result: any) => {
              const pos = parseInt(result.position);
              const driverId = result.Driver.driverId;
              if (statsMap[driverId]) {
                if (pos >= 1 && pos <= 3) {
                  statsMap[driverId].podiums++;
                }
              }
            });
          });
        }
        
        // Count fastest laps from qualifying (pole position = fastest lap in quali)
        // Or from race results if available
        if (qualyData.MRData?.RaceTable?.Races) {
          qualyData.MRData.RaceTable.Races.forEach((race: any) => {
            // Q3 pole position is the fastest qualifying lap
            const poleResult = race.QualifyingResults?.find((q: any) => q.position === "1");
            if (poleResult) {
              const driverId = poleResult.Driver.driverId;
              if (statsMap[driverId]) {
                statsMap[driverId].fastestLaps++;
              }
            }
          });
        }
        
        // Also check race results for fastest lap flag
        if (resultsData.MRData?.RaceTable?.Races) {
          resultsData.MRData.RaceTable.Races.forEach((race: any) => {
            race.Results?.forEach((result: any) => {
              const driverId = result.Driver.driverId;
              if (result.FastestLap?.rank === "1" && statsMap[driverId]) {
                statsMap[driverId].fastestLaps++;
              }
            });
          });
        }
        
        // Build season points progression data
        const pointsProgression: Record<string, SeasonPoint> = {};
        driverStandings.forEach((d) => {
          pointsProgression[d.driverId] = {
            driver_name: d.abbreviation,
            team_color: getTeamColor(d.team).replace('#', ''),
            rounds: [],
            points_by_round: [],
            total_points: d.points,
          };
        });
        
        // Get points per round from results
        if (resultsData.MRData?.RaceTable?.Races) {
          resultsData.MRData.RaceTable.Races.forEach((race: any, idx: number) => {
            race.Results?.forEach((result: any) => {
              const driverId = result.Driver.driverId;
              if (pointsProgression[driverId]) {
                const roundNum = idx + 1;
                pointsProgression[driverId].rounds.push(roundNum);
                pointsProgression[driverId].points_by_round.push({
                  round: roundNum,
                  points: parseInt(result.points) || 0,
                });
              }
            });
          });
        }
        
        const statsArray = Object.values(statsMap).sort((a, b) => b.points - a.points);
        const seasonArray = Object.values(pointsProgression).sort((a, b) => b.total_points - a.total_points);
        
        setDriverStats(statsArray);
        setSeasonData(seasonArray);
        setSelectedDrivers(statsArray.slice(0, 3).map(d => d.abbreviation));
      } catch (error) {
        console.error('Error fetching season data:', error);
        // Use fallback mock data when API fails
        setDriverStats([]);
        setSeasonData([]);
        setSelectedDrivers([]);
      }
      setLoading(false);
    }
    
    fetchData();
  }, []);

  const toggleDriver = (driverName: string) => {
    setSelectedDrivers(prev => 
      prev.includes(driverName) 
        ? prev.filter(d => d !== driverName)
        : [...prev, driverName]
    );
  };

  const getChartData = () => {
    const rounds = Array.from(new Set(seasonData.flatMap(d => d.rounds))).sort((a, b) => a - b);
    
    return rounds.map(round => {
      const dataPoint: Record<string, any> = { round };
      
      seasonData.forEach(driver => {
        const roundData = driver.points_by_round.find(p => p.round === round);
        const prevTotal = driver.points_by_round
          .filter(p => p.round < round)
          .reduce((sum, p) => sum + p.points, 0);
        
        if (viewMode === "cumulative") {
          dataPoint[driver.driver_name] = roundData ? prevTotal + roundData.points : prevTotal;
        } else {
          dataPoint[driver.driver_name] = roundData?.points || 0;
        }
      });
      
      return dataPoint;
    });
  };

  const colors = ["#3671c6", "#ff8000", "#e8002d", "#27f4d2", "#229971"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Find leaders
  const winsLeader = driverStats.reduce((prev, curr) => (curr.wins > prev.wins ? curr : prev), driverStats[0]);
  const podiumsLeader = driverStats.reduce((prev, curr) => (curr.podiums > prev.podiums ? curr : prev), driverStats[0]);
  const fastestLapsLeader = driverStats.reduce((prev, curr) => (curr.fastestLaps > prev.fastestLaps ? curr : prev), driverStats[0]);

  return (
    <div className="space-y-4">
      {/* Leader Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wins Leader */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border-b">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">Wins Leader</span>
          </div>
          <div className="p-4">
            {winsLeader && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-12 rounded-full"
                  style={{ backgroundColor: winsLeader.teamColor }}
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">{winsLeader.fullName}</div>
                  <div className="text-sm text-muted-foreground">{winsLeader.team}</div>
                </div>
                <div className="text-3xl font-bold text-yellow-500">{winsLeader.wins}</div>
              </div>
            )}
          </div>
        </div>

        {/* Podiums Leader */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="flex items-center gap-2 p-3 bg-blue-500/10 border-b">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Podiums Leader</span>
          </div>
          <div className="p-4">
            {podiumsLeader && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-12 rounded-full"
                  style={{ backgroundColor: podiumsLeader.teamColor }}
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">{podiumsLeader.fullName}</div>
                  <div className="text-sm text-muted-foreground">{podiumsLeader.team}</div>
                </div>
                <div className="text-3xl font-bold text-blue-500">{podiumsLeader.podiums}</div>
              </div>
            )}
          </div>
        </div>

        {/* Fastest Laps Leader */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="flex items-center gap-2 p-3 bg-orange-500/10 border-b">
            <Timer className="w-5 h-5 text-orange-500" />
            <span className="font-semibold">Fastest Laps Leader</span>
          </div>
          <div className="p-4">
            {fastestLapsLeader && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-12 rounded-full"
                  style={{ backgroundColor: fastestLapsLeader.teamColor }}
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">{fastestLapsLeader.fullName}</div>
                  <div className="text-sm text-muted-foreground">{fastestLapsLeader.team}</div>
                </div>
                <div className="text-3xl font-bold text-orange-500">{fastestLapsLeader.fastestLaps}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-semibold">Points Progression</h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cumulative")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === "cumulative" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Cumulative
          </button>
          <button
            onClick={() => setViewMode("per_round")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === "per_round" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Per Round
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {seasonData.map((driver) => (
            <button
              key={driver.driver_name}
              onClick={() => toggleDriver(driver.driver_name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-opacity ${
                selectedDrivers.includes(driver.driver_name) ? "" : "opacity-40"
              }`}
              style={{ backgroundColor: `${driver.team_color}20`, borderColor: `#${driver.team_color}` }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `#${driver.team_color}` }}
              />
              {driver.driver_name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={getChartData()}>
            <XAxis
              dataKey="round"
              label={{ value: "Round", position: "bottom" }}
              tickFormatter={(value) => `R${value}`}
            />
            <YAxis
              label={{ value: viewMode === "cumulative" ? "Total Points" : "Points", angle: -90, position: "left" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              labelFormatter={(value) => `Round ${value}`}
            />
            <Legend />
            {seasonData
              .filter(d => selectedDrivers.includes(d.driver_name))
              .map((driver) => (
                <Line
                  key={driver.driver_name}
                  type="monotone"
                  dataKey={driver.driver_name}
                  stroke={`#${driver.team_color}`}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Standings table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Pos</th>
              <th className="text-left p-3 font-medium">Driver</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Team</th>
              <th className="text-right p-3 font-medium">Pts</th>
              <th className="text-right p-3 font-medium">W</th>
              <th className="text-right p-3 font-medium">Pod</th>
              <th className="text-right p-3 font-medium">FL</th>
            </tr>
          </thead>
          <tbody>
            {driverStats.map((driver, index) => (
              <tr key={driver.driverId} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <span className={`font-bold ${
                    index === 0 ? "text-yellow-500" :
                    index === 1 ? "text-gray-400" :
                    index === 2 ? "text-amber-600" : ""
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-6 rounded-full"
                      style={{ backgroundColor: driver.teamColor }}
                    />
                    <span className="font-medium">{driver.abbreviation}</span>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">
                  {driver.team}
                </td>
                <td className="p-3 text-right font-bold">{driver.points}</td>
                <td className="p-3 text-right">
                  <span className="font-medium text-yellow-500">{driver.wins}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="font-medium text-blue-500">{driver.podiums}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="font-medium text-orange-500">{driver.fastestLaps}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
