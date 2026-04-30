"use client";

import { useState, useEffect } from "react";
import { Trophy, TrendingUp } from "lucide-react";

interface DriverStanding {
  position: number;
  number: number;
  name: string;
  code: string;
  team: string;
  teamColor: string;
  points: number;
  wins: number;
  podiums: number;
  fastestLaps: number;
  country: string;
  headshot: string;
}

const mockDrivers2026: DriverStanding[] = [
  { position: 1, number: 12, name: "Kimi Antonelli", code: "ANT", team: "Mercedes", teamColor: "27f4d2", points: 68, wins: 1, podiums: 3, fastestLaps: 1, country: "ITA", headshot: "" },
  { position: 2, number: 81, name: "Oscar Piastri", code: "PIA", team: "McLaren", teamColor: "ff8000", points: 61, wins: 0, podiums: 3, fastestLaps: 1, country: "AUS", headshot: "" },
  { position: 3, number: 16, name: "Charles Leclerc", code: "LEC", team: "Ferrari", teamColor: "e8002d", points: 55, wins: 0, podiums: 3, fastestLaps: 0, country: "MON", headshot: "" },
  { position: 4, number: 63, name: "George Russell", code: "RUS", team: "Mercedes", teamColor: "27f4d2", points: 42, wins: 0, podiums: 2, fastestLaps: 0, country: "GBR", headshot: "" },
  { position: 5, number: 1, name: "Max Verstappen", code: "VER", team: "Red Bull Racing", teamColor: "3671c6", points: 38, wins: 0, podiums: 2, fastestLaps: 1, country: "NED", headshot: "" },
  { position: 6, number: 44, name: "Lewis Hamilton", code: "HAM", team: "Ferrari", teamColor: "e8002d", points: 36, wins: 0, podiums: 2, fastestLaps: 0, country: "GBR", headshot: "" },
  { position: 7, number: 10, name: "Pierre Gasly", code: "GAS", team: "Alpine", teamColor: "ff87bc", points: 18, wins: 0, podiums: 0, fastestLaps: 0, country: "FRA", headshot: "" },
  { position: 8, number: 30, name: "Liam Lawson", code: "LAW", team: "Racing Bulls", teamColor: "6692ff", points: 12, wins: 0, podiums: 0, fastestLaps: 0, country: "NZL", headshot: "" },
  { position: 9, number: 43, name: "Franco Colapinto", code: "COL", team: "Alpine", teamColor: "ff87bc", points: 8, wins: 0, podiums: 0, fastestLaps: 0, country: "ARG", headshot: "" },
  { position: 10, number: 31, name: "Esteban Ocon", code: "OCO", team: "Haas F1 Team", teamColor: "b6babd", points: 7, wins: 0, podiums: 0, fastestLaps: 0, country: "FRA", headshot: "" },
  { position: 11, number: 6, name: "Isack Hadjar", code: "HAD", team: "Red Bull Racing", teamColor: "3671c6", points: 6, wins: 0, podiums: 0, fastestLaps: 0, country: "FRA", headshot: "" },
  { position: 12, number: 27, name: "Nico Hulkenberg", code: "HUL", team: "Audi", teamColor: "cccccc", points: 4, wins: 0, podiums: 0, fastestLaps: 0, country: "GER", headshot: "" },
  { position: 13, number: 14, name: "Fernando Alonso", code: "ALO", team: "Aston Martin", teamColor: "229971", points: 3, wins: 0, podiums: 0, fastestLaps: 0, country: "ESP", headshot: "" },
  { position: 14, number: 5, name: "Gabriel Bortoleto", code: "BOR", team: "Audi", teamColor: "cccccc", points: 2, wins: 0, podiums: 0, fastestLaps: 0, country: "BRA", headshot: "" },
  { position: 15, number: 41, name: "Arvid Lindblad", code: "LIN", team: "Racing Bulls", teamColor: "6692ff", points: 1, wins: 0, podiums: 0, fastestLaps: 0, country: "GBR", headshot: "" },
  { position: 16, number: 55, name: "Carlos Sainz", code: "SAI", team: "Williams", teamColor: "64c4ff", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "ESP", headshot: "" },
  { position: 17, number: 23, name: "Alexander Albon", code: "ALB", team: "Williams", teamColor: "64c4ff", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "THA", headshot: "" },
  { position: 18, number: 18, name: "Lance Stroll", code: "STR", team: "Aston Martin", teamColor: "229971", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "CAN", headshot: "" },
  { position: 19, number: 77, name: "Valtteri Bottas", code: "BOT", team: "Cadillac", teamColor: "000000", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "FIN", headshot: "" },
  { position: 20, number: 11, name: "Sergio Perez", code: "PER", team: "Cadillac", teamColor: "000000", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "MEX", headshot: "" },
  { position: 21, number: 3, name: "Max Verstappen", code: "VER", team: "Red Bull Racing", teamColor: "3671c6", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "NED", headshot: "" },
  { position: 22, number: 87, name: "Oliver Bearman", code: "BEA", team: "Haas F1 Team", teamColor: "b6babd", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "GBR", headshot: "" },
];

type SortKey = 'position' | 'points' | 'wins' | 'podiums' | 'fastestLaps';

export function DriverStandings() {
  const [drivers, setDrivers] = useState<DriverStanding[]>(mockDrivers2026);
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedDrivers = [...drivers].sort((a, b) => {
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
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Driver Standings 2026</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b">
              <th className="pb-2 pr-4">Pos</th>
              <th className="pb-2 pr-4">Driver</th>
              <th className="pb-2 pr-4">Team</th>
              <th 
                className="pb-2 pr-4 cursor-pointer hover:text-foreground"
                onClick={() => handleSort('points')}
              >
                PTS {sortKey === 'points' && (sortAsc ? '↑' : '↓')}
              </th>
              <th 
                className="pb-2 pr-4 cursor-pointer hover:text-foreground"
                onClick={() => handleSort('wins')}
              >
                W {sortKey === 'wins' && (sortAsc ? '↑' : '↓')}
              </th>
              <th 
                className="pb-2 pr-4 cursor-pointer hover:text-foreground"
                onClick={() => handleSort('podiums')}
              >
                Pod {sortKey === 'podiums' && (sortAsc ? '↑' : '↓')}
              </th>
              <th 
                className="pb-2 cursor-pointer hover:text-foreground"
                onClick={() => handleSort('fastestLaps')}
              >
                FL {sortKey === 'fastestLaps' && (sortAsc ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.slice(0, 15).map(driver => (
              <tr key={driver.number} className="border-b hover:bg-accent/50">
                <td className="py-3 pr-4">
                  <span className="font-bold">{driver.position}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: `#${driver.teamColor}` }}
                    >
                      {driver.code}
                    </div>
                    <span className="font-medium">{driver.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">
                  {driver.team}
                </td>
                <td className="py-3 pr-4 font-semibold">
                  {driver.points}
                </td>
                <td className="py-3 pr-4">
                  {driver.wins}
                </td>
                <td className="py-3 pr-4">
                  {driver.podiums}
                </td>
                <td className="py-3">
                  {driver.fastestLaps}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
