"use client";

import Image from "next/image";
import { mockDriverStandings2024 } from "@/lib/api";
import { Trophy } from "lucide-react";

export function DriverStandings() {
  const drivers = mockDriverStandings2024;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">2024 Driver Standings</h2>
      </div>

      <div className="grid gap-3">
        {drivers.map((driver) => (
          <div
            key={driver.driver_number}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
          >
            {/* Position */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                driver.position === 1
                  ? "bg-yellow-500 text-black"
                  : driver.position === 2
                  ? "bg-gray-400 text-black"
                  : driver.position === 3
                  ? "bg-amber-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {driver.position}
            </div>

            {/* Driver info */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
              <Image
                src={driver.headshot_url}
                alt={driver.broadcast_name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{driver.broadcast_name}</h3>
              <p className="text-sm text-muted-foreground">{driver.team_name}</p>
            </div>

            {/* Team color bar */}
            <div
              className="w-2 h-12 rounded-full"
              style={{ backgroundColor: `#${driver.team_colour}` }}
            />

            {/* Points */}
            <div className="text-right">
              <div className="text-2xl font-bold">{driver.points}</div>
              <div className="text-xs text-muted-foreground">POINTS</div>
            </div>

            {/* Wins */}
            {driver.wins > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">{driver.wins}</div>
                <div className="text-xs text-muted-foreground">WINS</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
