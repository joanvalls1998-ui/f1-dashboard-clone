"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchDriverStandings } from "@/lib/api";
import { driverImages, teamColors } from "@/lib/f1-assets";
import { Search, User, Trophy, Flag, Hash } from "lucide-react";

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

export default function DriverStatsPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      const data = await fetchDriverStandings(2026);
      const sorted = [...data].sort((a, b) => a.position - b.position);
      setDrivers(sorted);
      if (sorted.length > 0) {
        setSelectedDriver(sorted[0]);
      }
      setLoading(false);
    }
    loadDrivers();
  }, []);

  const filteredDrivers = drivers.filter((driver) => {
    const fullName = driver.fullName.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      driver.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
      driver.team.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Statistics</h1>
        <p className="text-gray-400">
          2026 Formula 1 World Championship — Select a driver to view their stats
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by driver name, code, or team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-card text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-3 var(--text-muted)">
            Drivers ({filteredDrivers.length})
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredDrivers.map((driver) => {
              const teamColor = teamColors[driver.team] || "#666666";
              const isSelected = selectedDriver?.driverId === driver.driverId;

              return (
                <button
                  key={driver.driverId}
                  onClick={() => setSelectedDriver(driver)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "bg-card hover:bg-card/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm var(--text-primary)"
                      style={{ backgroundColor: teamColor }}
                    >
                      {driver.position}
                    </div>
                    {driverImages[driver.abbreviation] && (
                      <div className="w-8 h-8 rounded-full overflow-hidden var(--bg-overlay) shrink-0">
                        <Image
                          src={driverImages[driver.abbreviation]}
                          alt={driver.fullName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{driver.fullName}</p>
                      <p className="text-xs var(--text-muted) truncate">
                        {driver.team}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">{driver.points} pts</p>
                      <p className="text-xs var(--text-muted) font-mono">
                        #{driver.number}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Driver Details */}
        <div className="lg:col-span-2">
          {selectedDriver ? (
            <div className="space-y-6">
              {/* Driver Header Card */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: teamColors[selectedDriver.team] || "#666666",
                }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Driver Image */}
                    <div className="relative">
                      {driverImages[selectedDriver.abbreviation] ? (
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/20 ring-4 ring-white/30">
                          <Image
                            src={driverImages[selectedDriver.abbreviation]}
                            alt={selectedDriver.fullName}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-white/20 flex items-center justify-center">
                          <User className="w-12 h-12 var(--text-primary)/60" />
                        </div>
                      )}
                      {/* Position Badge */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full var(--bg-surface) flex items-center justify-center font-bold text-lg var(--text-primary) ring-4 ring-white/30">
                        P{selectedDriver.position}
                      </div>
                    </div>

                    {/* Driver Info */}
                    <div className="text-white">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-3xl font-bold">
                          {selectedDriver.fullName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/20 text-sm font-mono">
                          #{selectedDriver.number}
                        </span>
                      </div>
                      <div className="var(--text-primary)/80 text-lg">{selectedDriver.team}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="var(--text-primary)/60 text-sm">
                          {selectedDriver.nationality}
                        </span>
                        <span className="var(--text-primary)/60 text-sm">•</span>
                        <span className="var(--text-primary)/60 text-sm font-mono">
                          {selectedDriver.abbreviation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Position */}
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <span className="text-sm var(--text-muted)">Position</span>
                  </div>
                  <div className="text-3xl font-bold">
                    P{selectedDriver.position}
                  </div>
                </div>

                {/* Points */}
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Flag className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-sm var(--text-muted)">Points</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {selectedDriver.points}
                  </div>
                </div>

                {/* Team */}
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: (teamColors[selectedDriver.team] || "#666666") + "20" }}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: teamColors[selectedDriver.team] || "#666666" }}
                      />
                    </div>
                    <span className="text-sm var(--text-muted)">Team</span>
                  </div>
                  <div className="text-lg font-bold truncate">
                    {selectedDriver.team}
                  </div>
                </div>

                {/* Number */}
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-sm var(--text-muted)">Number</span>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    {selectedDriver.number}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-sm font-semibold var(--text-muted) mb-3">
                  Driver Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-gray-400">Driver ID</span>
                    <span className="font-mono text-sm">{selectedDriver.driverId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-gray-400">Abbreviation</span>
                    <span className="font-mono text-sm">{selectedDriver.abbreviation}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-gray-400">Nationality</span>
                    <span className="text-sm">{selectedDriver.nationality}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-gray-400">Team</span>
                    <span className="text-sm">{selectedDriver.team}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] rounded-xl border bg-card">
              <p className="text-gray-400">Select a driver to view stats</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
