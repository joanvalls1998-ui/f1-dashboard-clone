"use client";

import { mockConstructorStandings2024 } from "@/lib/api";
import { Crown } from "lucide-react";

export function ConstructorStandings() {
  const constructors = mockConstructorStandings2024;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">2024 Constructor Standings</h2>
      </div>

      <div className="grid gap-3">
        {constructors.map((team) => (
          <div
            key={team.team_name}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
          >
            {/* Position */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                team.position === 1
                  ? "bg-yellow-500 text-black"
                  : team.position === 2
                  ? "bg-gray-400 text-black"
                  : team.position === 3
                  ? "bg-amber-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {team.position}
            </div>

            {/* Team color indicator */}
            <div
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: `#${team.team_colour}` }}
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{team.team_name}</h3>
              <p className="text-sm text-muted-foreground">
                {team.wins} {team.wins === 1 ? "win" : "wins"}
              </p>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="text-2xl font-bold">{team.points}</div>
              <div className="text-xs text-muted-foreground">POINTS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
