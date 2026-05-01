"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchDriverStandings } from "@/lib/api";
import { driverImages, teamColors } from "@/lib/f1-assets";

interface Driver {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  driverId: string;
  number: string;
  nationality: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDrivers() {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/2026/driverstandings.json`,
          { signal: AbortSignal.timeout(10000) }
        );
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const sorted = standings
          .map((item: any) => ({
            position: parseInt(item.position),
            abbreviation: item.Driver.code,
            fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
            team: item.Constructors[0].name,
            points: parseInt(item.points),
            driverId: item.Driver.driverId,
            number: item.Driver.permanentNumber || item.Driver.code,
            nationality: item.Driver.nationality,
          }))
          .sort((a: Driver, b: Driver) => a.position - b.position);
        setDrivers(sorted);
      } catch (e) {
        console.error('Failed to load drivers:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDrivers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8002D] to-[#FF8000] flex items-center justify-center">
          <span className="text-white font-bold text-lg">22</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Drivers</h1>
          <p className="text-muted-foreground text-sm">2026 Formula 1 World Championship</p>
        </div>
      </div>

      <div className="bg-[#171717] rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {drivers.map((driver) => {
            const imageUrl = driverImages[driver.abbreviation as keyof typeof driverImages];
            const teamColor = teamColors[driver.team] || "#666666";
            const nameParts = driver.fullName.split(" ");
            const lastName = nameParts[nameParts.length - 1];
            const firstName = nameParts.slice(0, -1).join(" ");

            return (
              <div
                key={driver.abbreviation}
                className="relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 transition-all duration-200 hover:scale-[1.02]"
                style={{ "--team-color": teamColor, ringColor: teamColor } as React.CSSProperties}
              >
                {/* Position badge */}
                <div
                  className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                  style={{ backgroundColor: teamColor, color: "#fff" }}
                >
                  {driver.position}
                </div>

                {/* Driver photo */}
                <div className="relative h-32 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={driver.fullName}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
                      <span className="text-4xl font-bold text-gray-600">
                        {lastName[0]}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                </div>

                {/* Driver info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm truncate leading-tight">
                        {lastName}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">{firstName}</p>
                    </div>
                    <div
                      className="shrink-0 px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: teamColor + "33", color: teamColor }}
                    >
                      {driver.team.length > 12
                        ? driver.team.split(" ").map(w => w[0]).join("")
                        : driver.team}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Points</span>
                    <span className="font-bold text-white">{driver.points}</span>
                  </div>

                  {/* Number */}
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-gray-500">#</span>
                    <span className="text-sm font-mono text-gray-300">{driver.number}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
