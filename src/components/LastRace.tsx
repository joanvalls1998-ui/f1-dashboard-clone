"use client";

import { Flag, Trophy, Clock, MapPin } from "lucide-react";

const lastRace = {
  name: "Japanese Grand Prix",
  circuit: "Suzuka International Racing Course",
  location: "Suzuka, Japan",
  date: "March 29, 2026",
  winner: "Kimi Antonelli",
  winnerTeam: "Mercedes",
  winnerTime: "1:24:33",
  polePosition: "Oscar Piastri",
  poleTime: "1:26.012",
  fastestLap: "Oscar Piastri",
  fastestLapTime: "1:29.445",
  flag: "🇯🇵",
  results: [
    { position: 1, driver: "Kimi Antonelli", team: "Mercedes", time: "1:24:33.204", points: 25 },
    { position: 2, driver: "Oscar Piastri", team: "McLaren", time: "+3.847s", points: 18 },
    { position: 3, driver: "Charles Leclerc", team: "Ferrari", time: "+8.231s", points: 15 },
    { position: 4, driver: "George Russell", team: "Mercedes", time: "+12.456s", points: 12 },
    { position: 5, driver: "Max Verstappen", team: "Red Bull Racing", time: "+15.892s", points: 10 },
    { position: 6, driver: "Lewis Hamilton", team: "Ferrari", time: "+18.234s", points: 8 },
    { position: 7, driver: "Pierre Gasly", team: "Alpine", time: "+24.567s", points: 6 },
    { position: 8, driver: "Esteban Ocon", team: "Haas F1 Team", time: "+31.123s", points: 4 },
    { position: 9, driver: "Liam Lawson", team: "Racing Bulls", time: "+35.789s", points: 2 },
    { position: 10, driver: "Franco Colapinto", team: "Alpine", time: "+42.156s", points: 1 },
  ],
  teamColors: {
    "Mercedes": "27f4d2",
    "McLaren": "ff8000",
    "Ferrari": "e8002d",
    "Red Bull Racing": "3671c6",
    "Alpine": "ff87bc",
    "Haas F1 Team": "b6babd",
    "Racing Bulls": "6692ff",
    "Aston Martin": "229971",
    "Williams": "64c4ff",
    "Audi": "cccccc",
    "Cadillac": "000000",
  } as Record<string, string>
};

export function LastRace() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">Last Race</h2>
        <span className="text-sm text-muted-foreground">Japan GP</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Race info card */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{lastRace.flag}</span>
            <div>
              <h3 className="text-xl font-bold">{lastRace.name}</h3>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {lastRace.circuit}, {lastRace.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Winner</div>
              <div className="font-semibold">{lastRace.winner}</div>
              <div className="text-sm text-muted-foreground">{lastRace.winnerTeam}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Pole Position</div>
              <div className="font-semibold">{lastRace.polePosition}</div>
              <div className="text-sm text-muted-foreground">{lastRace.poleTime}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Fastest Lap</div>
              <div className="font-semibold">{lastRace.fastestLap}</div>
              <div className="text-sm text-muted-foreground">{lastRace.fastestLapTime}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-semibold">{lastRace.date}</div>
            </div>
          </div>
        </div>

        {/* Results card */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <h4 className="font-semibold">Race Results</h4>
          </div>
          <div className="space-y-2">
            {lastRace.results.slice(0, 5).map(result => (
              <div
                key={result.position}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: `#${lastRace.teamColors[result.team] || "666666"}` }}
                >
                  {result.position}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{result.driver}</div>
                  <div className="text-xs text-muted-foreground">{result.team}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">{result.time}</div>
                  <div className="text-xs text-green-500">+{result.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
