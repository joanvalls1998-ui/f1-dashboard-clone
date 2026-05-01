"use client";

import { useState, useEffect } from "react";
import { User, TrendingUp, Award, Clock, Flag, Search } from "lucide-react";

interface Driver {
  driver_number: number;
  team_name: string;
  team_color: string;
  first_name: string;
  last_name: string;
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

export function DriverStats() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [stats, setStats] = useState<SeasonStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch(
          "https://api.jolpi.ca/ergast/f1/2026/driverstandings.json",
          { signal: AbortSignal.timeout(10000) }
        );
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const uniqueDrivers = standings.map((item: any) => ({
          driver_number: parseInt(item.Driver.permanentNumber) || 0,
          team_name: item.Constructors[0].name,
          team_color: "666666",
          first_name: item.Driver.givenName,
          last_name: item.Driver.familyName,
          country: item.Driver.nationality || "XX",
          headshot_url: "",
        }));

        setDrivers(uniqueDrivers as Driver[]);
        if (uniqueDrivers.length > 0) {
          setSelectedDriver(uniqueDrivers[0] as Driver);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      if (!selectedDriver) return;
      
      // Mock stats based on driver number (simulating 2024 season)
      const mockStats: Record<number, SeasonStats> = {
        1: { position: 1, wins: 19, podiums: 22, poles: 12, fastest_laps: 9, points: 437, races: 24 },
        16: { position: 2, wins: 4, podiums: 17, poles: 4, fastest_laps: 3, points: 374, races: 24 },
        55: { position: 3, wins: 4, podiums: 16, poles: 4, fastest_laps: 4, points: 356, races: 24 },
        11: { position: 4, wins: 2, podiums: 11, poles: 2, fastest_laps: 2, points: 291, races: 24 },
        44: { position: 5, wins: 2, podiums: 9, poles: 1, fastest_laps: 2, points: 223, races: 24 },
        14: { position: 6, wins: 1, podiums: 7, poles: 2, fastest_laps: 2, points: 183, races: 24 },
        63: { position: 7, wins: 0, podiums: 6, poles: 1, fastest_laps: 0, points: 145, races: 24 },
        81: { position: 8, wins: 1, podiums: 5, poles: 0, fastest_laps: 2, points: 125, races: 24 },
        18: { position: 9, wins: 0, podiums: 2, poles: 0, fastest_laps: 1, points: 70, races: 24 },
        31: { position: 10, wins: 0, podiums: 2, poles: 0, fastest_laps: 1, points: 68, races: 24 },
        27: { position: 11, wins: 0, podiums: 1, poles: 0, fastest_laps: 0, points: 41, races: 24 },
        10: { position: 12, wins: 0, podiums: 1, poles: 0, fastest_laps: 1, points: 33, races: 24 },
        24: { position: 13, wins: 0, podiums: 0, poles: 0, fastest_laps: 0, points: 8, races: 24 },
        77: { position: 14, wins: 0, podiums: 0, poles: 0, fastest_laps: 0, points: 4, races: 24 },
        4: { position: 15, wins: 0, podiums: 0, poles: 0, fastest_laps: 0, points: 0, races: 24 },
      };
      
      setStats(mockStats[selectedDriver.driver_number] || {
        position: 99, wins: 0, podiums: 0, poles: 0, fastest_laps: 0, points: 0, races: 0
      });
    }
    
    fetchStats();
  }, [selectedDriver]);

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || 
           driver.driver_number.toString().includes(search);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                style={{ backgroundColor: `#${driver.team_color}` }}
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
              style={{ backgroundColor: `#${selectedDriver.team_color}` }}
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
              <TrendingUp className="w-5 h-5 text-green-500" />
              2024 Season Stats
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold text-yellow-500">P{stats.position}</div>
                <div className="text-sm text-muted-foreground">Championship Position</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold">{stats.points}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold">{stats.races}</div>
                <div className="text-sm text-muted-foreground">Races</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-3xl font-bold">{stats.wins}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10">
                <Award className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-xl font-bold">{stats.podiums}</div>
                  <div className="text-xs text-muted-foreground">Podiums</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10">
                <Flag className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-xl font-bold">{stats.poles}</div>
                  <div className="text-xs text-muted-foreground">Pole Positions</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10">
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-xl font-bold">{stats.fastest_laps}</div>
                  <div className="text-xs text-muted-foreground">Fastest Laps</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-xl font-bold">{stats.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
