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
        <div style={{ color: 'var(--text-muted)' }}>Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent-red)' }}
        >
          <span className="var(--text-primary) font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>22</span>
        </div>
        <div>
          <p className="eyebrow">2026 Season</p>
          <h1
            className="text-3xl font-extrabold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
          >
            Drivers
          </h1>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {drivers.map((driver, i) => {
          const imageUrl = driverImages[driver.abbreviation as keyof typeof driverImages];
          const teamColor = teamColors[driver.team] || "#666666";
          const nameParts = driver.fullName.split(" ");
          const lastName = nameParts[nameParts.length - 1];
          const firstName = nameParts.slice(0, -1).join(" ");

          return (
            <div
              key={driver.abbreviation}
              className="card card-interactive overflow-hidden animate-enter"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Position badge */}
              <div
                className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                style={{ backgroundColor: teamColor, color: "#fff", fontFamily: 'var(--font-mono)' }}
              >
                {driver.position}
              </div>

              {/* Driver photo */}
              <div className="relative h-28 overflow-hidden rounded-lg mb-3" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={driver.fullName}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="text-4xl font-black"
                      style={{ color: teamColor + '66', fontFamily: 'var(--font-heading)' }}
                    >
                      {lastName[0]}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent" />
              </div>

              {/* Driver info */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <h3
                      className="font-bold text-sm truncate leading-tight"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                    >
                      {lastName}
                    </h3>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{firstName}</p>
                  </div>
                  <div
                    className="shrink-0 px-1.5 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: teamColor + '22', color: teamColor }}
                  >
                    {driver.team.length > 10 ? driver.team.split(" ").map((w: string) => w[0]).join("") : driver.team}
                  </div>
                </div>

                {/* Points + Number */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--bg-overlay)' }}>
                  <span className="stat-number text-base" style={{ color: teamColor }}>{driver.points}</span>
                  <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>#{driver.number}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
