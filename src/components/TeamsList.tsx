"use client";

import { useState } from "react";
import { Users, Search, Trophy } from "lucide-react";

interface Team {
  name: string;
  teamColor: string;
  base: string;
  teamChief: string;
  chassis: string;
  powerUnit: string;
  drivers: string[];
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
}

const teams: Team[] = [
  {
    name: "Red Bull Racing",
    teamColor: "3671c6",
    base: "Milton Keynes, UK",
    teamChief: "Christian Horner",
    chassis: "RB20",
    powerUnit: "Honda RBPT",
    drivers: ["Max Verstappen", "Sergio Perez"],
    points: 671,
    wins: 20,
    podiums: 32,
    poles: 13,
    fastestLaps: 22,
  },
  {
    name: "McLaren",
    teamColor: "ff8000",
    base: "Woking, UK",
    teamChief: "Andrea Stella",
    chassis: "MCL38",
    powerUnit: "Mercedes",
    drivers: ["Lando Norris", "Oscar Piastri"],
    points: 646,
    wins: 6,
    podiums: 29,
    poles: 8,
    fastestLaps: 9,
  },
  {
    name: "Ferrari",
    teamColor: "e8002d",
    base: "Maranello, Italy",
    teamChief: "Frédéric Vasseur",
    chassis: "SF-24",
    powerUnit: "Ferrari",
    drivers: ["Charles Leclerc", "Carlos Sainz"],
    points: 646,
    wins: 5,
    podiums: 28,
    poles: 8,
    fastestLaps: 6,
  },
  {
    name: "Mercedes",
    teamColor: "27f4d2",
    base: "Brackley, UK",
    teamChief: "Toto Wolff",
    chassis: "W15",
    powerUnit: "Mercedes",
    drivers: ["Lewis Hamilton", "George Russell"],
    points: 232,
    wins: 2,
    podiums: 12,
    poles: 1,
    fastestLaps: 4,
  },
  {
    name: "Aston Martin",
    teamColor: "229971",
    base: "Silverstone, UK",
    teamChief: "Mike Krack",
    chassis: "AMR24",
    powerUnit: "Mercedes",
    drivers: ["Fernando Alonso", "Lance Stroll"],
    points: 181,
    wins: 0,
    podiums: 8,
    poles: 0,
    fastestLaps: 2,
  },
  {
    name: "Alpine",
    teamColor: "ff87bc",
    base: "Enstone, UK",
    teamChief: "Bruno Famin",
    chassis: "A524",
    powerUnit: "Renault",
    drivers: ["Esteban Ocon", "Pierre Gasly"],
    points: 120,
    wins: 0,
    podiums: 2,
    poles: 0,
    fastestLaps: 1,
  },
  {
    name: "RB",
    teamColor: "6692ff",
    base: "Faenza, Italy",
    teamChief: "Laurent Mekies",
    chassis: "VCARB 01",
    powerUnit: "Honda RBPT",
    drivers: ["Yuki Tsunoda", "Daniel Ricciardo"],
    points: 46,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 1,
  },
  {
    name: "Williams",
    teamColor: "64c4ff",
    base: "Grove, UK",
    teamChief: "James Vowles",
    chassis: "FW46",
    powerUnit: "Mercedes",
    drivers: ["Alex Albon", "Logan Sargeant"],
    points: 27,
    wins: 0,
    podiums: 1,
    poles: 0,
    fastestLaps: 0,
  },
  {
    name: "Kick Sauber",
    teamColor: "52e252",
    base: "Hinwil, Switzerland",
    teamChief: "Alessandro Alunni Bravi",
    chassis: "C44",
    powerUnit: "Ferrari",
    drivers: ["Valtteri Bottas", "Zhou Guanyu"],
    points: 4,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
  },
  {
    name: "Haas F1 Team",
    teamColor: "b6babd",
    base: "Kannapolis, USA",
    teamChief: "Ayao Komatsu",
    chassis: "VF-24",
    powerUnit: "Ferrari",
    drivers: ["Nico Hulkenberg", "Kevin Magnussen"],
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
  },
];

export function TeamsList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"points" | "wins" | "name">("points");

  const filteredTeams = teams
    .filter(team => {
      const matchesSearch = search === "" || 
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.drivers.some(d => d.toLowerCase().includes(search.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "wins") return b.wins - a.wins;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">All Teams</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams or drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="points">Sort by Points</option>
          <option value="wins">Sort by Wins</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.name}
            className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header with team color */}
            <div
              className="p-4"
              style={{ backgroundColor: `#${team.teamColor}` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                <Trophy className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-white/80 text-sm mt-1">{team.base}</p>
            </div>

            {/* Stats */}
            <div className="p-4">
              {/* Key stats */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{team.points}</div>
                  <div className="text-xs text-muted-foreground">PTS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-500">{team.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">{team.podiums}</div>
                  <div className="text-xs text-muted-foreground">Pod</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-500">{team.poles}</div>
                  <div className="text-xs text-muted-foreground">Poles</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-500">{team.fastestLaps}</div>
                  <div className="text-xs text-muted-foreground">FL</div>
                </div>
              </div>

              {/* Team details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Principal</span>
                  <span className="font-medium">{team.teamChief}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chassis</span>
                  <span className="font-medium">{team.chassis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power Unit</span>
                  <span className="font-medium">{team.powerUnit}</span>
                </div>
              </div>

              {/* Drivers */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">Drivers</div>
                <div className="flex gap-2">
                  {team.drivers.map((driver) => (
                    <span
                      key={driver}
                      className="px-3 py-1 rounded-full bg-muted text-sm font-medium"
                    >
                      {driver}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No teams found matching your search.
        </div>
      )}
    </div>
  );
}
