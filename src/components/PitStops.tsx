"use client";

import { useState } from "react";
import { CircleDot, Search } from "lucide-react";

interface PitStop {
  driver: string;
  team: string;
  teamColor: string;
  stopNumber: number;
  time: string;
  duration: string;
  lap: number;
  position: number;
}

const pitStopData: PitStop[] = [
  { driver: "VER", team: "Red Bull Racing", teamColor: "3671c6", stopNumber: 1, time: "14:32:45", duration: "2.14", lap: 18, position: 1 },
  { driver: "NOR", team: "McLaren", teamColor: "ff8000", stopNumber: 1, time: "14:35:12", duration: "2.18", lap: 19, position: 2 },
  { driver: "LEC", team: "Ferrari", teamColor: "e8002d", stopNumber: 1, time: "14:33:56", duration: "2.21", lap: 18, position: 3 },
  { driver: "SAI", team: "Ferrari", teamColor: "e8002d", stopNumber: 1, time: "14:34:23", duration: "2.19", lap: 18, position: 4 },
  { driver: "PIA", team: "McLaren", teamColor: "ff8000", stopNumber: 1, time: "14:36:01", duration: "2.25", lap: 20, position: 5 },
  { driver: "RUS", team: "Mercedes", teamColor: "27f4d2", stopNumber: 1, time: "14:35:45", duration: "2.31", lap: 19, position: 6 },
  { driver: "HAM", team: "Mercedes", teamColor: "27f4d2", stopNumber: 1, time: "14:37:12", duration: "2.28", lap: 20, position: 7 },
  { driver: "PER", team: "Red Bull Racing", teamColor: "3671c6", stopNumber: 1, time: "14:38:34", duration: "2.45", lap: 22, position: 8 },
  { driver: "ALO", team: "Aston Martin", teamColor: "229971", stopNumber: 1, time: "14:39:56", duration: "2.38", lap: 21, position: 9 },
  { driver: "GAS", team: "Alpine", teamColor: "ff87bc", stopNumber: 1, time: "14:40:23", duration: "2.42", lap: 22, position: 10 },
];

const teams = [...new Set(pitStopData.map(d => d.team))];

export function PitStops() {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"duration" | "lap">("duration");

  const filteredData = pitStopData
    .filter(d => {
      const matchesSearch = search === "" || d.driver.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = !selectedTeam || d.team === selectedTeam;
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => {
      if (sortBy === "duration") return parseFloat(a.duration) - parseFloat(b.duration);
      return a.lap - b.lap;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CircleDot className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Pit Stop Analysis</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-green-500">2.14</div>
          <div className="text-xs text-muted-foreground">Fastest Stop (s)</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold">18</div>
          <div className="text-xs text-muted-foreground">Total Stops</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold">24</div>
          <div className="text-xs text-muted-foreground">Laps</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-yellow-500">20.3</div>
          <div className="text-xs text-muted-foreground">Avg Stop (s)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
          />
        </div>

        <select
          value={selectedTeam || ""}
          onChange={(e) => setSelectedTeam(e.target.value || null)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="duration">Sort by Duration</option>
          <option value="lap">Sort by Lap</option>
        </select>
      </div>

      {/* Pit stop times */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Pos</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Driver</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Team</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Lap</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Stop #</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map((stop, idx) => (
              <tr key={idx} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-sm">{stop.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: '#${stop.teamColor}` }}
                    />
                    <span className="font-medium">{stop.driver}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{stop.team}</td>
                <td className="px-4 py-3 text-sm">{stop.lap}</td>
                <td className="px-4 py-3 text-sm">{stop.stopNumber}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-mono font-medium ${
                    parseFloat(stop.duration) < 2.2 ? 'text-green-500' : 
                    parseFloat(stop.duration) < 2.4 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {stop.duration}s
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Under 2.2s (Excellent)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>2.2s - 2.4s (Normal)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Over 2.4s (Slow)</span>
        </div>
      </div>
    </div>
  );
}
