"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Search, Filter } from "lucide-react";
import { fetchDriverStandings } from "@/lib/api";
import { driverImages, getTeamColor } from "@/lib/f1-assets";

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

export function DriversList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"points" | "wins" | "name">("points");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDriverStandings(2026);
        setDrivers(data);
      } catch (e) {
        console.error("Error loading drivers:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const teams = Array.from(new Set(drivers.map(d => d.team)));

  const filteredDrivers = drivers
    .filter(driver => {
      const matchesSearch = search === "" ||
        driver.fullName.toLowerCase().includes(search.toLowerCase()) ||
        driver.abbreviation.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = !selectedTeam || driver.team === selectedTeam;
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
      return a.position - b.position;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-red)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Tots els Pilots</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Cerca pilots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border text-sm"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--sidebar-border)', color: 'var(--text-primary)' }}
          />
        </div>

        <select
          value={selectedTeam || ""}
          onChange={(e) => setSelectedTeam(e.target.value || null)}
          className="px-3 py-2 rounded-md border text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--sidebar-border)', color: 'var(--text-primary)' }}
        >
          <option value="">Tots els equips</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--sidebar-border)', color: 'var(--text-primary)' }}
        >
          <option value="points">Ordenar per punts</option>
          <option value="name">Ordenar per nom</option>
        </select>
      </div>

      {/* Driver grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const imageUrl = driverImages[driver.abbreviation as keyof typeof driverImages];
          const teamColor = getTeamColor(driver.team);
          const nameParts = driver.fullName.split(" ");
          const lastName = nameParts[nameParts.length - 1];
          const firstName = nameParts.slice(0, -1).join(" ");

          return (
            <div
              key={driver.abbreviation}
              className="rounded-lg border p-4 hover:shadow-md transition-shadow"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--sidebar-border)' }}
            >
              <div className="flex items-start gap-4">
                {/* Driver number badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                  style={{ backgroundColor: teamColor, color: "#fff" }}
                >
                  {driver.position}
                </div>

                {/* Driver image */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={driver.fullName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}
                    >
                      {driver.abbreviation}
                    </div>
                  )}
                </div>

                {/* Driver info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-[var(--text-primary)]">{driver.fullName}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{driver.abbreviation} · #{driver.number}</p>
                  <p className="text-xs text-[var(--text-muted)]">{driver.team}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t"
                style={{ borderColor: 'var(--sidebar-border)' }}
              >
                <div className="text-center">
                  <div className="font-bold text-lg text-[var(--text-primary)]">{driver.points}</div>
                  <div className="text-xs text-[var(--text-muted)]">Punts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-yellow-500">—</div>
                  <div className="text-xs text-[var(--text-muted)]">Victòries</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-[var(--accent-red)]">{driver.position}</div>
                  <div className="text-xs text-[var(--text-muted)]">Posició</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-8 text-[var(--text-muted)]">
          No s'han trobat pilots amb aquests filtres.
        </div>
      )}
    </div>
  );
}
