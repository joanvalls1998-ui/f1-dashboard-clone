"use client";

import { useState, useEffect } from "react";
import { User, Search, Trophy, Target, Timer, Flag } from "lucide-react";
import { TableSkeleton } from "@/components/Skeletons";

interface Driver {
  driver_number: number;
  first_name: string;
  last_name: string;
  team_name: string;
  team_color: string;
  country: string;
  headshot_url: string;
}

interface SeasonStats {
  position: number;
  wins: number;
  podiums: number;
  poles: number;
  fastest_laps: number;
  points: number;
  races: number;
}

const ERGAST = "https://api.jolpi.ca/ergast/f1";

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function DriverStats() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<SeasonStats | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDrivers() {
      // Try OpenF1 drivers first
      const data = await fetchJson("https://api.openf1.org/v1/drivers");
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((d: any) => ({
          driver_number: d.driver_number,
          first_name: d.first_name || "",
          last_name: d.last_name || "",
          team_name: d.team_name || "Unknown",
          team_color: d.team_colour || "666666",
          country: d.country_code || "",
          headshot_url: d.headshot_url || "",
        }));
        setDrivers(mapped);
        setSelectedDriver(mapped[0] || null);
        setLoading(false);
        return;
      }
      // Fallback to Ergast
      const erg = await fetchJson(`${ERGAST}/current/drivers.json`);
      const list = erg?.MRData?.DriverTable?.Drivers || [];
      const mapped = list.map((d: any) => ({
        driver_number: parseInt(d.permanentNumber) || 0,
        first_name: d.givenName || "",
        last_name: d.familyName || "",
        team_name: "Unknown",
        team_color: "666666",
        country: d.nationality || "",
        headshot_url: "",
      }));
      setDrivers(mapped);
      setSelectedDriver(mapped[0] || null);
      setLoading(false);
    }
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (!selectedDriver) return;
    async function fetchStatsForDriver() {
      setLoading(true);
      const driverNumber = selectedDriver!.driver_number;
      // Get standings
      const standings = await fetchJson(`${ERGAST}/current/driverstandings.json`);
      const allRaces = await fetchJson(`${ERGAST}/current/results.json?limit=1000`);
      const allQualy = await fetchJson(`${ERGAST}/current/qualifying.json?limit=1000`);

      const list = standings?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
      const entry = list.find((s: any) =>
        parseInt(s.Driver?.permanentNumber) === driverNumber
      );

      let wins = 0, podiums = 0, fastestLaps = 0, poles = 0, points = 0, position = 99, races = 0;
      if (entry) {
        position = parseInt(entry.position);
        points = parseInt(entry.points);
        wins = parseInt(entry.wins);
      }
      // Count podiums and fastest laps from results
      const raceList = allRaces?.MRData?.RaceTable?.Races || [];
      raceList.forEach((race: any) => {
        race.Results?.forEach((result: any) => {
          if (parseInt(result.Driver?.permanentNumber) === driverNumber) {
            races++;
            const pos = parseInt(result.position);
            if (pos >= 1 && pos <= 3) podiums++;
            if (result.FastestLap?.rank === "1") fastestLaps++;
          }
        });
      });
      // Count poles from qualifying
      const qualyList = allQualy?.MRData?.RaceTable?.Races || [];
      qualyList.forEach((race: any) => {
        const pole = race.QualifyingResults?.find((q: any) => q.position === "1");
        if (pole && parseInt(pole.Driver?.permanentNumber) === driverNumber) poles++;
      });

      setStats({ position, wins, podiums, poles, fastest_laps: fastestLaps, points, races });
      setLoading(false);
    }
    fetchStatsForDriver();
  }, [selectedDriver]);

  const filteredDrivers = drivers.filter((driver) => {
    const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || driver.driver_number.toString().includes(search);
  });

  if (loading) return <TableSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search drivers by name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
        />
      </div>

      {/* Driver selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredDrivers.map((driver) => (
          <button
            key={driver.driver_number}
            onClick={() => setSelectedDriver(driver)}
            className={`p-3 rounded-lg border text-left hover:shadow-md transition-all ${
              selectedDriver?.driver_number === driver.driver_number
                ? "border-primary bg-primary/5"
                : "bg-card"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `#${driver.team_color.replace('#', '')}` }}
              />
              <span className="font-bold">#{driver.driver_number}</span>
            </div>
            <div className="text-sm mt-1 truncate">
              {driver.first_name} {driver.last_name}
            </div>
            <div className="text-xs text-muted-foreground">{driver.team_name}</div>
          </button>
        ))}
      </div>

      {/* Selected driver stats */}
      {selectedDriver && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver card */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div
              className="p-4"
              style={{ backgroundColor: `#${selectedDriver.team_color.replace('#', '')}` }}
            >
              <div className="flex items-center gap-4">
                {selectedDriver.headshot_url ? (
                  <img
                    src={selectedDriver.headshot_url}
                    alt={`${selectedDriver.first_name} ${selectedDriver.last_name}`}
                    className="w-20 h-20 rounded-full object-cover bg-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-10 h-10 text-white/60" />
                  </div>
                )}
                <div className="text-white">
                  <div className="text-2xl font-bold">
                    #{selectedDriver.driver_number} {selectedDriver.first_name} {selectedDriver.last_name}
                  </div>
                  <div className="text-white/80">{selectedDriver.team_name}</div>
                  <div className="text-white/60 text-sm mt-1">
                    Country: {selectedDriver.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Season stats */}
          <div className="lg:col-span-2 rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Season Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-yellow-500">{stats.wins}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-blue-500">{stats.podiums}</div>
                <div className="text-sm text-muted-foreground">Podiums</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-purple-500">{stats.poles}</div>
                <div className="text-sm text-muted-foreground">Poles</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-orange-500">{stats.fastest_laps}</div>
                <div className="text-sm text-muted-foreground">Fastest Laps</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold">{stats.points}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold">{stats.races}</div>
                <div className="text-sm text-muted-foreground">Races</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
