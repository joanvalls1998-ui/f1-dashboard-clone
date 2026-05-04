"use client";

import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { fetchConstructorStandings, fetchDriverStandings } from "@/lib/api";
import { driverImages, teamLogos, getTeamColor } from "@/lib/f1-assets";

interface Team {
  name: string;
  color: string;
  drivers: { name: string; abbreviation: string; image: string }[];
  points: number;
  wins: number;
  position: number;
}

export function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [constructors, drivers] = await Promise.all([
          fetchConstructorStandings(2026),
          fetchDriverStandings(2026)
        ]);

        const teamsData: Team[] = constructors.map((c) => ({
          name: c.name,
          color: getTeamColor(c.name),
          drivers: drivers
            .filter((d) => d.team === c.name)
            .map((d) => ({
              name: d.fullName,
              abbreviation: d.abbreviation,
              image: driverImages[d.abbreviation] || ""
            })),
          points: c.points,
          wins: c.wins,
          position: c.position
        }));

        setTeams(teamsData);
      } catch (error) {
        console.error("Error loading teams:", error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg-overlay)', borderTopColor: 'var(--accent-red)' }} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((team) => (
        <div
          key={team.name}
          className="card card-interactive"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm mt-1 shrink-0"
                style={{ backgroundColor: team.color }}
              />
              <div>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{team.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{team.points} pts</p>
              </div>
            </div>
            <div className="text-right">
              <span className="stat-number text-2xl" style={{ color: team.color }}>{team.points}</span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>P{team.position}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {team.drivers.map((driver) => (
              <div key={driver.abbreviation} className="flex items-center gap-2">
                {driver.image ? (
                  <img
                    src={driver.image}
                    alt={driver.name}
                    className="w-10 h-10 rounded-full object-cover"
                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.abbreviation}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{driver.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{driver.abbreviation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
