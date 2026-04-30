"use client";

import Image from "next/image";
import { Flag, Trophy, Clock, MapPin } from "lucide-react";

const lastRace = {
  name: "Abu Dhabi Grand Prix",
  circuit: "Yas Marina Circuit",
  location: "Abu Dhabi, UAE",
  date: "December 6-8, 2024",
  winner: "Lando Norris",
  winnerTeam: "McLaren",
  winnerTime: "1:26:33",
  polePosition: "Lando Norris",
  poleTime: "1:22.706",
  fastestLap: "George Russell",
  fastestLapTime: "1:24.963",
  flag: "🇦🇪",
  results: [
    { position: 1, driver: "Lando Norris", team: "McLaren", time: "1:26:33.404", points: 25 },
    { position: 2, driver: "Oscar Piastri", team: "McLaren", time: "+4.135s", points: 18 },
    { position: 3, driver: "Charles Leclerc", team: "Ferrari", time: "+10.246s", points: 15 },
    { position: 4, driver: "Carlos Sainz", team: "Ferrari", time: "+12.032s", points: 12 },
    { position: 5, driver: "Max Verstappen", team: "Red Bull Racing", time: "+13.842s", points: 10 },
    { position: 6, driver: "Lewis Hamilton", team: "Mercedes", time: "+15.906s", points: 8 },
    { position: 7, driver: "George Russell", team: "Mercedes", time: "+16.357s", points: 6 },
    { position: 8, driver: "Fernando Alonso", team: "Aston Martin", time: "+23.641s", points: 4 },
    { position: 9, driver: "Pierre Gasly", team: "Alpine", time: "+27.482s", points: 2 },
    { position: 10, driver: "Yuki Tsunoda", team: "RB", time: "+28.193s", points: 1 },
  ],
  teamColors: {
    "McLaren": "ff8000",
    "Ferrari": "e8002d",
    "Red Bull Racing": "3671c6",
    "Mercedes": "27f4d2",
    "Aston Martin": "229971",
    "Alpine": "ff87bc",
    "RB": "6692ff",
  } as Record<string, string>
};

export function LastRace() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">Last Race</h2>
        <span className="text-sm text-muted-foreground">Abu Dhabi GP</span>
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
            <div className="text-center p-3 rounded-lg bg-muted">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-sm text-muted-foreground">Winner</div>
              <div className="font-semibold">{lastRace.winner}</div>
              <div className="text-xs text-muted-foreground">{lastRace.winnerTeam}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-semibold">{lastRace.winnerTime}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="text-muted-foreground">Pole</div>
              <div className="font-medium">{lastRace.polePosition}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Pole Time</div>
              <div className="font-medium">{lastRace.poleTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Fastest Lap</div>
              <div className="font-medium">{lastRace.fastestLap}</div>
            </div>
          </div>
        </div>

        {/* Results card */}
        <div className="rounded-lg border bg-card p-4 overflow-hidden">
          <h4 className="font-semibold mb-3">Race Results</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {lastRace.results.map((result) => (
              <div
                key={result.position}
                className="flex items-center gap-3 text-sm"
              >
                {/* Position */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    result.position === 1
                      ? "bg-yellow-500 text-black"
                      : result.position === 2
                      ? "bg-gray-400 text-black"
                      : result.position === 3
                      ? "bg-amber-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  {result.position}
                </div>

                {/* Driver info */}
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate">{result.driver}</span>
                </div>

                {/* Team color bar */}
                <div
                  className="w-1 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: `#${lastRace.teamColors[result.team]}` }}
                />

                {/* Time/Gap */}
                <div className="text-muted-foreground text-xs shrink-0">
                  {result.time}
                </div>

                {/* Points */}
                <div className="w-6 text-right text-xs font-bold text-green-500 shrink-0">
                  +{result.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
