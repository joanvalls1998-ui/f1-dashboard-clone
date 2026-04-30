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

const teams2026: Team[] = [
  { position: 1, name: "Mercedes", teamColor: "27f4d2", points: 110, wins: 1, podiums: 5, drivers: ["Kimi Antonelli", "George Russell"] },
  { position: 2, name: "McLaren", teamColor: "ff8000", points: 61, wins: 0, podiums: 3, drivers: ["Oscar Piastri", "Lando Norris"] },
  { position: 3, name: "Ferrari", teamColor: "e8002d", points: 91, wins: 0, podiums: 5, drivers: ["Charles Leclerc", "Lewis Hamilton"] },
  { position: 4, name: "Red Bull Racing", teamColor: "3671c6", points: 44, wins: 0, podiums: 2, drivers: ["Max Verstappen", "Isack Hadjar"] },
  { position: 5, name: "Alpine", teamColor: "ff87bc", points: 26, wins: 0, podiums: 0, drivers: ["Pierre Gasly", "Franco Colapinto"] },
  { position: 6, name: "Racing Bulls", teamColor: "6692ff", points: 13, wins: 0, podiums: 0, drivers: ["Liam Lawson", "Arvid Lindblad"] },
  { position: 7, name: "Audi", teamColor: "cccccc", points: 6, wins: 0, podiums: 0, drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"] },
  { position: 8, name: "Haas F1 Team", teamColor: "b6babd", points: 7, wins: 0, podiums: 0, drivers: ["Esteban Ocon", "Oliver Bearman"] },
  { position: 9, name: "Aston Martin", teamColor: "229971", points: 3, wins: 0, podiums: 0, drivers: ["Fernando Alonso", "Lance Stroll"] },
  { position: 10, name: "Williams", teamColor: "64c4ff", points: 0, wins: 0, podiums: 0, drivers: ["Carlos Sainz", "Alexander Albon"] },
  { position: 11, name: "Cadillac", teamColor: "000000", points: 0, wins: 0, podiums: 0, drivers: ["Valtteri Bottas", "Sergio Perez"] },
];

type SortKey = 'position' | 'points' | 'wins' | 'podiums';

export function ConstructorStandings() {
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedTeams = [...teams2026].sort((a, b) => {
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
        <Crown className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Constructor Standings 2026</h2>
      </div>

      <div className="space-y-2">
        {sortedTeams.map(team => (
          <div
            key={team.name}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{ backgroundColor: `#${team.teamColor}` }}
            >
              {team.position}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{team.name}</div>
              <div className="text-sm text-muted-foreground">
                {team.drivers.join(" • ")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{team.points}</div>
              <div className="text-xs text-muted-foreground">PTS</div>
            </div>
            <div className="text-right min-w-[60px]">
              <div className="font-semibold">{team.wins}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </div>
            <div className="text-right min-w-[60px]">
              <div className="font-semibold">{team.podiums}</div>
              <div className="text-xs text-muted-foreground">Podiums</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
