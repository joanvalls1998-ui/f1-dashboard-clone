"use client";

import { useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { fetchConstructorStandings, fetchDriverStandings } from "@/lib/api";
import { getTeamColor } from "@/lib/f1-assets";

interface ConstructorStanding {
  position: number;
  name: string;
  drivers: string[];
  points: number;
  wins: number;
  color: string;
}

export default function ConstructorStandings() {
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [constructorsData, driversData] = await Promise.all([
          fetchConstructorStandings(2026),
          fetchDriverStandings(2026)
        ]);

        // Match drivers to constructors
        const constructorsWithDrivers = constructorsData.map((c) => ({
          ...c,
          drivers: driversData
            .filter((d) => d.team === c.name)
            .map((d) => d.fullName?.split(" ").pop() || d.fullName),
          color: getTeamColor(c.name)
        }));

        setConstructors(constructorsWithDrivers);
      } catch (error) {
        console.error("Error loading constructor standings:", error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#171717] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-white">Constructor Championships</h2>
      </div>

      <div className="space-y-1">
        {constructors.map((team) => (
          <div
            key={team.position}
            className="flex items-center justify-between py-3 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 text-center font-bold ${
                  team.position === 1
                    ? "text-yellow-500"
                    : team.position <= 3
                    ? "text-gray-300"
                    : "text-gray-400"
                }`}
              >
                {team.position}
              </span>
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: team.color || "#666" }}
              />
              <div>
                <p className="text-white text-sm font-medium">{team.name}</p>
                <p className="text-gray-500 text-xs">{(team.drivers || []).join(", ") || "N/A"}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-white font-bold">{team.points} pts</span>
              {team.wins > 0 && (
                <span className="ml-2 text-xs text-yellow-500">({team.wins}W)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
