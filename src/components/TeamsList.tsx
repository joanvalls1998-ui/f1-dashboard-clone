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
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((team) => (
        <div
          key={team.name}
          className="bg-[#171717] rounded-xl p-4 sm:p-6 hover:bg-[#1f1f1f] transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm mt-1"
                style={{ backgroundColor: team.color }}
              />
              <div>
                <h3 className="text-white font-bold text-lg">{team.name}</h3>
                <p className="text-gray-500 text-sm">{team.points} pts</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${
                team.position === 1 ? "text-yellow-500" :
                team.position === 2 ? "text-gray-300" :
                team.position === 3 ? "text-amber-600" : "text-gray-400"
              }`}>
                P{team.position}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {team.drivers.map((driver) => (
              <div key={driver.abbreviation} className="flex items-center gap-2">
                {driver.image ? (
                  <img
                    src={driver.image}
                    alt={driver.name}
                    className="w-10 h-10 rounded-full object-cover bg-[#2a2a2a]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                    <span className="text-xs text-gray-400">{driver.abbreviation}</span>
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{driver.name}</p>
                  <p className="text-gray-500 text-xs">{driver.abbreviation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
