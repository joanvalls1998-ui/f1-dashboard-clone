"use client";

import { useState } from "react";
import { Crown, TrendingUp } from "lucide-react";

interface Team {
  position: number;
  name: string;
  teamColor: string;
  points: number;
  wins: number;
  podiums: number;
  drivers: string[];
}

const teams2024: Team[] = [
  { position: 1, name: "McLaren", teamColor: "ff8000", points: 646, wins: 6, podiums: 29, drivers: ["Lando Norris", "Oscar Piastri"] },
  { position: 2, name: "Ferrari", teamColor: "e8002d", points: 646, wins: 5, podiums: 28, drivers: ["Charles Leclerc", "Carlos Sainz"] },
  { position: 3, name: "Red Bull Racing", teamColor: "3671c6", points: 671, wins: 20, podiums: 32, drivers: ["Max Verstappen", "Sergio Perez"] },
  { position: 4, name: "Mercedes", teamColor: "27f4d2", points: 232, wins: 2, podiums: 12, drivers: ["Lewis Hamilton", "George Russell"] },
  { position: 5, name: "Aston Martin", teamColor: "229971", points: 181, wins: 0, podiums: 8, drivers: ["Fernando Alonso", "Lance Stroll"] },
  { position: 6, name: "Alpine", teamColor: "ff87bc", points: 120, wins: 0, podiums: 2, drivers: ["Esteban Ocon", "Pierre Gasly"] },
  { position: 7, name: "RB", teamColor: "6692ff", points: 46, wins: 0, podiums: 0, drivers: ["Yuki Tsunoda", "Daniel Ricciardo"] },
  { position: 8, name: "Williams", teamColor: "64c4ff", points: 27, wins: 0, podiums: 1, drivers: ["Alex Albon", "Logan Sargeant"] },
  { position: 9, name: "Kick Sauber", teamColor: "52e252", points: 4, wins: 0, podiums: 0, drivers: ["Valtteri Bottas", "Zhou Guanyu"] },
  { position: 10, name: "Haas F1 Team", teamColor: "b6babd", points: 0, wins: 0, podiums: 0, drivers: ["Nico Hulkenberg", "Kevin Magnussen"] },
];

type SortKey = 'position' | 'points' | 'wins' | 'podiums';

export function ConstructorStandings() {
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedTeams = [...teams2024].sort((a, b) => {
    return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">2024 Constructor Standings</h2>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-yellow-500">20</div>
          <div className="text-xs text-muted-foreground">Race Wins</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-green-500">10</div>
          <div className="text-xs text-muted-foreground">Teams</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-blue-500">110</div>
          <div className="text-xs text-muted-foreground">Total Podiums</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-purple-500">1923</div>
          <div className="text-xs text-muted-foreground">Total Points</div>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        {[
          { key: 'position' as SortKey, label: 'Position' },
          { key: 'points' as SortKey, label: 'Points' },
          { key: 'wins' as SortKey, label: 'Wins' },
          { key: 'podiums' as SortKey, label: 'Podiums' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-2 py-1 rounded ${
              sortKey === key 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {label} {sortKey === key && (sortAsc ? '↑' : '↓')}
          </button>
        ))}
      </div>

      {/* Team list */}
      <div className="grid gap-3">
        {sortedTeams.map((team) => (
          <div
            key={team.name}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            {/* Position */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0 ${
                team.position === 1
                  ? 'bg-yellow-500 text-black'
                  : team.position === 2
                  ? 'bg-gray-400 text-black'
                  : team.position === 3
                  ? 'bg-amber-600 text-white'
                  : 'bg-muted'
              }`}
            >
              {team.position}
            </div>

            {/* Team color box */}
            <div
              className="w-12 h-12 rounded-lg shrink-0"
              style={{ backgroundColor: `#${team.teamColor}` }}
            />

            {/* Team info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-sm text-muted-foreground">
                {team.drivers.join(" • ")}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm shrink-0">
              <div className="text-center">
                <div className="font-bold text-xl">{team.points}</div>
                <div className="text-xs text-muted-foreground">PTS</div>
              </div>
              {team.wins > 0 && (
                <div className="text-center text-green-500">
                  <TrendingUp className="w-4 h-4 mx-auto" />
                  <div className="text-xs font-bold">{team.wins}</div>
                </div>
              )}
              <div className="text-center hidden md:block">
                <div className="text-muted-foreground">{team.podiums}</div>
                <div className="text-xs text-muted-foreground">Pod</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
