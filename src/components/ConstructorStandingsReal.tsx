"use client";

import { useState, useEffect } from "react";
import { Trophy, TrendingUp, Users } from "lucide-react";

interface Team {
  name: string;
  teamColor: string;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
}

export function ConstructorStandingsReal() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        // Use Ergast API - OpenF1 doesn't have a teams endpoint
        const response = await fetch(
          "https://api.jolpi.ca/ergast/f1/2026/constructorstandings.json",
          { signal: AbortSignal.timeout(8000) }
        );
        const json = await response.json();
        const constructors = json.MRData.ConstructorTable.Constructors;
        
        const mappedTeams: Team[] = (constructors as any[]).map((c: any, i: number) => ({
          name: c.name,
          teamColor: c.constructorId === "red_bull" ? "3671c6" :
                     c.constructorId === "mclaren" ? "ff8000" :
                     c.constructorId === "ferrari" ? "e8002d" :
                     c.constructorId === "mercedes" ? "27f4d2" :
                     c.constructorId === "aston_martin" ? "229971" :
                     c.constructorId === "alpine" ? "ff87bc" :
                     c.constructorId === "rb" ? "6692ff" :
                     c.constructorId === "williams" ? "64c4ff" :
                     c.constructorId === "sauber" ? "52e252" :
                     c.constructorId === "haas" ? "b6babd" : "666666",
          points: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          fastestLaps: 0,
        }));
        setTeams(mappedTeams);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    }
    
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Constructor Standings</h2>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Pos</th>
              <th className="text-left p-3 font-medium">Team</th>
              <th className="text-center p-3 font-medium">Pts</th>
              <th className="text-center p-3 font-medium hidden md:table-cell">W</th>
              <th className="text-center p-3 font-medium hidden md:table-cell">Pod</th>
              <th className="text-center p-3 font-medium hidden md:table-cell">Pole</th>
              <th className="text-center p-3 font-medium hidden md:table-cell">FL</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.name} className="border-t hover:bg-muted/50">
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
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `#${team.teamColor}` }}
                    />
                    <span className="font-medium">{team.name}</span>
                  </div>
                </td>
                <td className="p-3 text-center font-bold">{team.points}</td>
                <td className="p-3 text-center hidden md:table-cell">{team.wins}</td>
                <td className="p-3 text-center hidden md:table-cell">{team.podiums}</td>
                <td className="p-3 text-center hidden md:table-cell">{team.poles}</td>
                <td className="p-3 text-center hidden md:table-cell">{team.fastestLaps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span> W = Wins
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> Pod = Podiums
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span> Pole = Pole Positions
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span> FL = Fastest Laps
        </span>
      </div>
    </div>
  );
}
