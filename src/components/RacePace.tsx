"use client";

import { useState } from "react";
import { Flame, Search } from "lucide-react";

interface LapTime {
  driver: string;
  team: string;
  teamColor: string;
  lapTime: string;
  lapNumber: number;
  tire: string;
}

const racePaceData: LapTime[] = [
  { driver: "VER", team: "Red Bull Racing", teamColor: "3671c6", lapTime: "1:24.220", lapNumber: 1, tire: "Medium" },
  { driver: "NOR", team: "McLaren", teamColor: "ff8000", lapTime: "1:24.312", lapNumber: 1, tire: "Medium" },
  { driver: "LEC", team: "Ferrari", teamColor: "e8002d", lapTime: "1:24.445", lapNumber: 1, tire: "Medium" },
  { driver: "SAI", team: "Ferrari", teamColor: "e8002d", lapTime: "1:24.501", lapNumber: 1, tire: "Medium" },
  { driver: "PIA", team: "McLaren", teamColor: "ff8000", lapTime: "1:24.556", lapNumber: 1, tire: "Medium" },
  { driver: "RUS", team: "Mercedes", teamColor: "27f4d2", lapTime: "1:24.623", lapNumber: 1, tire: "Medium" },
  { driver: "HAM", team: "Mercedes", teamColor: "27f4d2", lapTime: "1:24.701", lapNumber: 1, tire: "Medium" },
  { driver: "PER", team: "Red Bull Racing", teamColor: "3671c6", lapTime: "1:24.789", lapNumber: 1, tire: "Medium" },
  { driver: "ALO", team: "Aston Martin", teamColor: "229971", lapTime: "1:24.856", lapNumber: 1, tire: "Medium" },
  { driver: "GAS", team: "Alpine", teamColor: "ff87bc", lapTime: "1:24.923", lapNumber: 1, tire: "Medium" },
  { driver: "VER", team: "Red Bull Racing", teamColor: "3671c6", lapTime: "1:24.156", lapNumber: 20, tire: "Hard" },
  { driver: "NOR", team: "McLaren", teamColor: "ff8000", lapTime: "1:24.201", lapNumber: 20, tire: "Hard" },
  { driver: "LEC", team: "Ferrari", teamColor: "e8002d", lapTime: "1:24.267", lapNumber: 20, tire: "Hard" },
  { driver: "PIA", team: "McLaren", teamColor: "ff8000", lapTime: "1:24.334", lapNumber: 20, tire: "Hard" },
  { driver: "RUS", team: "Mercedes", teamColor: "27f4d2", lapTime: "1:24.412", lapNumber: 20, tire: "Hard" },
  { driver: "HAM", team: "Mercedes", teamColor: "27f4d2", lapTime: "1:24.478", lapNumber: 20, tire: "Hard" },
  { driver: "SAI", team: "Ferrari", teamColor: "e8002d", lapTime: "1:24.523", lapNumber: 20, tire: "Hard" },
  { driver: "PER", team: "Red Bull Racing", teamColor: "3671c6", lapTime: "1:24.589", lapNumber: 20, tire: "Hard" },
  { driver: "ALO", team: "Aston Martin", teamColor: "229971", lapTime: "1:24.667", lapNumber: 20, tire: "Hard" },
  { driver: "GAS", team: "Alpine", teamColor: "ff87bc", lapTime: "1:24.734", lapNumber: 20, tire: "Hard" },
];

const teams = [...new Set(racePaceData.map(d => d.team))];

export function RacePace() {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedLap, setSelectedLap] = useState<number | null>(1);

  const filteredData = racePaceData.filter(d => {
    const matchesSearch = search === "" || d.driver.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = !selectedTeam || d.team === selectedTeam;
    const matchesLap = !selectedLap || d.lapNumber === selectedLap;
    return matchesSearch && matchesTeam && matchesLap;
  });

  const laps = [1, 20];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Race Pace Analysis</h2>
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
          value={selectedLap || ""}
          onChange={(e) => setSelectedLap(e.target.value ? parseInt(e.target.value) : null)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="">All Laps</option>
          {laps.map(lap => (
            <option key={lap} value={lap}>Lap {lap}</option>
          ))}
        </select>
      </div>

      {/* Pace comparison chart */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Lap Time Comparison</h3>
        <div className="space-y-2">
          {filteredData.slice(0, 10).map((entry, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-4 text-sm font-medium">{idx + 1}</div>
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: '#${entry.teamColor}` }}
              />
              <div className="w-12 font-medium">{entry.driver}</div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${100 - (idx * 5)}%`,
                      backgroundColor: '#${entry.teamColor}`
                    }}
                  />
                </div>
              </div>
              <div className="w-20 text-right font-mono text-sm">
                {entry.lapTime}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tire strategy */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Tire Strategy</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="text-3xl mb-2">🔴</div>
            <div className="font-semibold">Soft</div>
            <div className="text-xs text-muted-foreground">Fastest laps</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="text-3xl mb-2">🟡</div>
            <div className="font-semibold">Medium</div>
            <div className="text-xs text-muted-foreground">Race pace</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="text-3xl mb-2">⚪</div>
            <div className="font-semibold">Hard</div>
            <div className="text-xs text-muted-foreground">Long stints</div>
          </div>
        </div>
      </div>
    </div>
  );
}
