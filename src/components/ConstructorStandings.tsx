"use client";

import { useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { fetchConstructorStandings, fetchDriverStandings } from "@/lib/api";
import { getTeamColor } from "@/lib/f1-assets";
import { TeamCard } from "./TeamCard";

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
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent-red)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5" style={{ color: "#eab308" }} />
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Constructor Championships
        </h2>
      </div>

      {/* Grid of team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {constructors.map((team, i) => (
          <div key={team.position} className="animate-enter" style={{ animationDelay: `${i * 50}ms` }}>
            <TeamCard team={team} variant="detailed" />
          </div>
        ))}
      </div>
    </div>
  );
}
