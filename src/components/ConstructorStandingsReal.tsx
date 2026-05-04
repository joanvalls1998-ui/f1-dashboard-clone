"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { getTeamColor } from "@/lib/f1-assets";

interface Team {
  position: number;
  name: string;
  constructorId: string;
  teamColor: string;
  points: number;
  wins: number;
}

export function ConstructorStandingsReal() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        // Fetch constructor standings (includes points + wins)
        const standingsRes = await fetch(
          "https://api.jolpi.ca/ergast/f1/2026/constructorstandings.json",
          { signal: AbortSignal.timeout(8000) }
        );
        const standingsJson = await standingsRes.json();
        const standings = standingsJson.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
        
        if (standings.length === 0) {
          setTeams([]);
          setLoading(false);
          return;
        }

        const mappedTeams: Team[] = standings.map((cs: any, index: number) => {
          const constructor = cs.Constructor || {};
          return {
            position: parseInt(cs.position) || index + 1,
            name: constructor.name || "Unknown",
            constructorId: constructor.constructorId || "",
            teamColor: getTeamColor(constructor.name || ""),
            points: parseInt(cs.points) || 0,
            wins: parseInt(cs.wins) || 0,
          };
        });

        setTeams(mappedTeams);
      } catch (error) {
        console.error("Error fetching constructor standings:", error);
      }
      setLoading(false);
    }
    
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-red)]" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
        <Trophy className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-sm">No hi ha dades de constructors disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Classificació Constructors</h2>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--bg-elevated)' }}>
                <th className="text-left p-3 font-medium text-[var(--text-muted)]">Pos</th>
                <th className="text-left p-3 font-medium text-[var(--text-muted)]">Equip</th>
                <th className="text-center p-3 font-medium text-[var(--text-muted)]">Pts</th>
                <th className="text-center p-3 font-medium text-[var(--text-muted)]">Victòries</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.constructorId}
                  className="border-b hover:bg-[var(--sidebar-accent)] transition-colors"
                  style={{ borderColor: 'var(--sidebar-border)' }}
                >
                  <td className="p-3">
                    <span className={`font-bold ${
                      team.position === 1 ? "text-yellow-500" : 
                      team.position === 2 ? "text-gray-400" : 
                      team.position === 3 ? "text-amber-600" : ""
                    }`}>
                      {team.position}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.teamColor }}
                      />
                      <span className="font-medium text-[var(--text-primary)]">{team.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-[var(--text-primary)]">{team.points}</td>
                  <td className="p-3 text-center text-[var(--text-muted)]">{team.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
