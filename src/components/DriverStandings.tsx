"use client";

import { useEffect, useState } from "react";
import { DriverStandingsVisual } from "./DriverCard";
import { driverImages, teamColors, getTeamColor } from "@/lib/f1-assets";
import { fetchDriverStandings } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface DriverStanding {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  driverId: string;
  number: string;
  nationality: string;
}

export default function DriverStandings() {
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDriverStandings(2026);
        setDrivers(data);
      } catch (error) {
        console.error("Error loading driver standings:", error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No driver standings data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Leader highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {drivers.slice(0, 3).map((driver) => {
          const color = getTeamColor(driver.team);
          const image = driverImages[driver.abbreviation as keyof typeof driverImages] || "";
          return (
            <div key={driver.position} className="relative">
              <div
                className="bg-[#1a1a1a] rounded-xl overflow-hidden"
                style={{
                  borderTop: `4px solid ${
                    driver.position === 1 ? "#FFD700" : driver.position === 2 ? "#C0C0C0" : "#CD7F32"
                  }`
                }}
              >
                {/* Image banner */}
                <div className="h-24 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
                  {image && (
                    <img
                      src={image}
                      alt={driver.fullName}
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                  {/* Position badge */}
                  <div
                    className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl font-black"
                    style={{
                      backgroundColor:
                        driver.position === 1 ? "#FFD700" : driver.position === 2 ? "#C0C0C0" : "#CD7F32",
                      color: driver.position === 2 ? "#333" : "#fff"
                    }}
                  >
                    {driver.position}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{driver.team}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{driver.fullName}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-3xl font-black" style={{ color }}>
                      {driver.points}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">pts</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full standings list */}
      <DriverStandingsVisual drivers={drivers} />
    </div>
  );
}
