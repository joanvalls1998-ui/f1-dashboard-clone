"use client";

import { useEffect, useState } from "react";
import { Bomb, AlertTriangle, Search, Filter, Trophy } from "lucide-react";
import { getTeamColor, driverImages } from "@/lib/f1-assets";

interface DestructorRecord {
  driverId: string;
  abbreviation: string;
  fullName: string;
  team: string;
  teamColor: string;
  number: string;
  nationality: string;
  position: number;
  championshipPoints: number;
  dnfs: number;
  accidents: number;
  mechanical: number;
  driverErrors: number;
  penalties: number;
  penaltyPoints: number;
  totalIncidents: number;
  raceIncidents: Array<{
    round: number;
    raceName: string;
    country: string;
    type: string;
    reason: string;
    lap?: number;
  }>;
}

interface DNFReason {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  position: number;
  lap: number;
  reason: string;
  category: string;
}

export function DestructorsStandings() {
  const [drivers, setDrivers] = useState<DestructorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all race results for 2026 to count DNFs
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026.json", {
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;

        // Fetch results for each race to count DNFs
        const allDNFs: DNFReason[] = [];

        for (const race of races) {
          try {
            const resultsRes = await fetch(
              `https://api.jolpi.ca/ergast/f1/2026/${race.round}/results.json`,
              { signal: AbortSignal.timeout(8000) }
            );
            const resultsData = await resultsRes.json();
            const raceResults = resultsData.MRData.RaceTable.Races[0];

            // Extract DNFs
            raceResults.Results.filter((r: any) => r.status !== "Finished").forEach((result: any) => {
              const reason = result.status;
              const category = categorizeDNF(reason);

              allDNFs.push({
                driver_number: parseInt(result.Driver.permanentNumber) || parseInt(result.Driver.code) || 0,
                driver_name: result.Driver.code,
                team_name: result.Constructor.name,
                team_color: getTeamColor(result.Constructor.name),
                position: parseInt(result.position) || 0,
                lap: result.laps ? parseInt(result.laps) : 0,
                reason,
                category,
              });
            });
          } catch (e) {
            console.error(`Failed to fetch results for round ${race.round}`);
          }
        }

        // Fetch driver standings to get current championship positions
        const standingsRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverstandings.json", {
          signal: AbortSignal.timeout(8000),
        });
        const standingsData = await standingsRes.json();
        const standings = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        // Build driver records
        const driverRecords: Record<string, DestructorRecord> = {};

        standings.forEach((standing: any) => {
          const abbrev = standing.Driver.code;
          driverRecords[abbrev] = {
            driverId: standing.Driver.driverId,
            abbreviation: abbrev,
            fullName: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
            team: standing.Constructors[0].name,
            teamColor: getTeamColor(standing.Constructors[0].name),
            number: standing.Driver.permanentNumber || abbrev,
            nationality: standing.Driver.nationality,
            position: parseInt(standing.position),
            championshipPoints: parseInt(standing.points),
            dnfs: 0,
            accidents: 0,
            mechanical: 0,
            driverErrors: 0,
            penalties: 0,
            penaltyPoints: 0,
            totalIncidents: 0,
            raceIncidents: [],
          };
        });

        // Count DNFs and incidents per driver
        allDNFs.forEach((dnf) => {
          if (driverRecords[dnf.driver_name]) {
            const driver = driverRecords[dnf.driver_name];
            driver.dnfs++;
            driver.totalIncidents++;

            switch (dnf.category) {
              case "ACCIDENT":
                driver.accidents++;
                break;
              case "MECHANICAL":
                driver.mechanical++;
                break;
              case "DRIVER_ERROR":
                driver.driverErrors++;
                break;
              case "PENALTY":
                driver.penalties++;
                driver.penaltyPoints += 5; // Assume 5 points per penalty
                break;
            }

            // Add to race incidents
            const raceName = races.find((r: any) => {
              // Find the race by round
              return true; // Simplified - would need proper mapping
            })?.raceName || "Unknown";

            driver.raceIncidents.push({
              round: 0, // Would need to track this properly
              raceName: "GP",
              country: dnf.team_name,
              type: dnf.category,
              reason: dnf.reason,
              lap: dnf.lap,
            });
          }
        });

        // Convert to array and sort by total incidents
        let sortedDrivers = Object.values(driverRecords).sort(
          (a, b) => b.totalIncidents - a.totalIncidents || b.dnfs - a.dnfs
        );

        // Add position ranking
        sortedDrivers = sortedDrivers.map((driver, index) => ({
          ...driver,
          position: index + 1,
        }));

        setDrivers(sortedDrivers);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function categorizeDNF(reason: string): string {
    const lower = reason.toLowerCase();
    if (
      lower.includes("accident") ||
      lower.includes("collision") ||
      lower.includes("crash") ||
      lower.includes("spun off") ||
      lower.includes("contact")
    ) {
      return "ACCIDENT";
    }
    if (
      lower.includes("engine") ||
      lower.includes("power unit") ||
      lower.includes("pu") ||
      lower.includes("mechanical") ||
      lower.includes("gearbox") ||
      lower.includes("transmission") ||
      lower.includes("hydraulics") ||
      lower.includes("brakes") ||
      lower.includes("suspension") ||
      lower.includes("steering") ||
      lower.includes("throttle") ||
      lower.includes("clerance") ||
      lower.includes("mgu-h") ||
      lower.includes("mgu-k") ||
      lower.includes("ers") ||
      lower.includes("turbo") ||
      lower.includes("exhaust") ||
      lower.includes("fuel") ||
      lower.includes("oil") ||
      lower.includes("water") ||
      lower.includes("overheating") ||
      lower.includes("electrical")
    ) {
      return "MECHANICAL";
    }
    if (
      lower.includes("driver") ||
      lower.includes("pilot") ||
      lower.includes("error") ||
      lower.includes("mistake") ||
      lower.includes("spin") ||
      lower.includes("locked") ||
      lower.includes("off track") ||
      lower.includes("exceeded track limits")
    ) {
      return "DRIVER_ERROR";
    }
    if (
      lower.includes("penalty") ||
      lower.includes("disqualified") ||
      lower.includes("dsq") ||
      lower.includes("excluded")
    ) {
      return "PENALTY";
    }
    if (
      lower.includes("retired") ||
      lower.includes("dnf") ||
      lower.includes("did not finish") ||
      lower.includes("withdrawn") ||
      lower.includes("withdrew")
    ) {
      return "RETIRED";
    }
    return "OTHER";
  }

  const filteredDrivers = drivers.filter((driver) => {
    if (filterType !== "all") {
      switch (filterType) {
        case "accidents":
          if (driver.accidents === 0) return false;
          break;
        case "mechanical":
          if (driver.mechanical === 0) return false;
          break;
        case "errors":
          if (driver.driverErrors === 0) return false;
          break;
        case "penalties":
          if (driver.penalties === 0) return false;
          break;
      }
    }
    if (search !== "") {
      const searchLower = search.toLowerCase();
      return (
        driver.abbreviation.toLowerCase().includes(searchLower) ||
        driver.fullName.toLowerCase().includes(searchLower) ||
        driver.team.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalDNFs = drivers.reduce((sum, d) => sum + d.dnfs, 0);
  const totalAccidents = drivers.reduce((sum, d) => sum + d.accidents, 0);
  const totalMechanical = drivers.reduce((sum, d) => sum + d.mechanical, 0);
  const totalDriverErrors = drivers.reduce((sum, d) => sum + d.driverErrors, 0);

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "ACCIDENT":
        return "text-red-500 bg-red-500/10";
      case "MECHANICAL":
        return "text-orange-500 bg-orange-500/10";
      case "DRIVER_ERROR":
        return "text-yellow-500 bg-yellow-500/10";
      case "PENALTY":
        return "text-purple-500 bg-purple-500/10";
      case "RETIRED":
        return "text-gray-500 bg-gray-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-[#1a1a1a] text-sm"
            aria-label="Search drivers"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-md border bg-[#1a1a1a] text-sm"
          aria-label="Filter by incident type"
        >
          <option value="all">All Incidents</option>
          <option value="accidents">Accidents Only</option>
          <option value="mechanical">Mechanical Only</option>
          <option value="errors">Driver Errors Only</option>
          <option value="penalties">Penalties Only</option>
        </select>
      </div>

      {/* Standings Table */}
      <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
        <table className="w-full" aria-label="Destructors championship standings">
          <thead>
            <tr className="border-b border-[#333] text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Driver</th>
              <th className="text-center p-4">DNFs</th>
              <th className="text-center p-4">Accidents</th>
              <th className="text-center p-4">Mechanical</th>
              <th className="text-center p-4">Errors</th>
              <th className="text-center p-4">Penalties</th>
              <th className="text-center p-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr
                key={driver.abbreviation}
                className="border-b border-[#252525] hover:bg-[#252525] transition-colors"
              >
                <td className="p-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      driver.position === 1
                        ? "bg-red-500 text-white"
                        : driver.position === 2
                        ? "bg-orange-500 text-white"
                        : driver.position === 3
                        ? "bg-yellow-500 text-black"
                        : "bg-[#333] text-gray-300"
                    }`}
                  >
                    {driver.position}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-10 rounded-full"
                      style={{ backgroundColor: driver.teamColor }}
                    />
                    <div>
                      <p className="text-white font-bold">{driver.fullName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{driver.team}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: driver.teamColor + "33",
                            color: driver.teamColor,
                          }}
                        >
                          {driver.abbreviation}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-2xl font-black text-red-500">{driver.dnfs}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-red-400">{driver.accidents}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-orange-400">{driver.mechanical}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-yellow-400">{driver.driverErrors}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-purple-400">{driver.penalties}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-xl font-black text-white bg-[#333] px-3 py-1 rounded">
                    {driver.totalIncidents}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 font-medium">DNF</span>
          <span className="text-gray-500">Did Not Finish</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-red-400/10 text-red-400 font-medium">ACC</span>
          <span className="text-gray-500">Accidents/Collisions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-orange-400/10 text-orange-400 font-medium">MECH</span>
          <span className="text-gray-500">Mechanical Failures</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-yellow-400/10 text-yellow-400 font-medium">ERR</span>
          <span className="text-gray-500">Driver Errors</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-purple-400/10 text-purple-400 font-medium">PEN</span>
          <span className="text-gray-500">Penalties/DSQ</span>
        </div>
      </div>
    </div>
  );
}

export function DestructorsLeaderboard() {
  const [drivers, setDrivers] = useState<DestructorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026.json", {
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;

        const allDNFs: DNFReason[] = [];

        for (const race of races) {
          try {
            const resultsRes = await fetch(
              `https://api.jolpi.ca/ergast/f1/2026/${race.round}/results.json`,
              { signal: AbortSignal.timeout(8000) }
            );
            const resultsData = await resultsRes.json();
            const raceResults = resultsData.MRData.RaceTable.Races[0];

            raceResults.Results.filter((r: any) => r.status !== "Finished").forEach((result: any) => {
              allDNFs.push({
                driver_number: parseInt(result.Driver.permanentNumber) || parseInt(result.Driver.code) || 0,
                driver_name: result.Driver.code,
                team_name: result.Constructor.name,
                team_color: getTeamColor(result.Constructor.name),
                position: parseInt(result.position) || 0,
                lap: result.laps ? parseInt(result.laps) : 0,
                reason: result.status,
                category: categorizeDNF(result.status),
              });
            });
          } catch (e) {
            console.error(`Failed to fetch results for round ${race.round}`);
          }
        }

        const standingsRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverstandings.json", {
          signal: AbortSignal.timeout(8000),
        });
        const standingsData = await standingsRes.json();
        const standings = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const driverRecords: Record<string, DestructorRecord> = {};

        standings.forEach((standing: any) => {
          const abbrev = standing.Driver.code;
          driverRecords[abbrev] = {
            driverId: standing.Driver.driverId,
            abbreviation: abbrev,
            fullName: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
            team: standing.Constructors[0].name,
            teamColor: getTeamColor(standing.Constructors[0].name),
            number: standing.Driver.permanentNumber || abbrev,
            nationality: standing.Driver.nationality,
            position: parseInt(standing.position),
            championshipPoints: parseInt(standing.points),
            dnfs: 0,
            accidents: 0,
            mechanical: 0,
            driverErrors: 0,
            penalties: 0,
            penaltyPoints: 0,
            totalIncidents: 0,
            raceIncidents: [],
          };
        });

        allDNFs.forEach((dnf) => {
          if (driverRecords[dnf.driver_name]) {
            const driver = driverRecords[dnf.driver_name];
            driver.dnfs++;
            driver.totalIncidents++;

            switch (dnf.category) {
              case "ACCIDENT":
                driver.accidents++;
                break;
              case "MECHANICAL":
                driver.mechanical++;
                break;
              case "DRIVER_ERROR":
                driver.driverErrors++;
                break;
              case "PENALTY":
                driver.penalties++;
                break;
            }
          }
        });

        let sortedDrivers = Object.values(driverRecords).sort(
          (a, b) => b.totalIncidents - a.totalIncidents || b.dnfs - a.dnfs
        );

        sortedDrivers = sortedDrivers.map((driver, index) => ({
          ...driver,
          position: index + 1,
        }));

        setDrivers(sortedDrivers);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function categorizeDNF(reason: string): string {
    const lower = reason.toLowerCase();
    if (
      lower.includes("accident") ||
      lower.includes("collision") ||
      lower.includes("crash") ||
      lower.includes("spun off") ||
      lower.includes("contact")
    ) {
      return "ACCIDENT";
    }
    if (
      lower.includes("engine") ||
      lower.includes("power unit") ||
      lower.includes("pu") ||
      lower.includes("mechanical") ||
      lower.includes("gearbox") ||
      lower.includes("transmission") ||
      lower.includes("hydraulics") ||
      lower.includes("brakes") ||
      lower.includes("suspension")
    ) {
      return "MECHANICAL";
    }
    if (
      lower.includes("driver") ||
      lower.includes("error") ||
      lower.includes("mistake") ||
      lower.includes("spin")
    ) {
      return "DRIVER_ERROR";
    }
    if (
      lower.includes("penalty") ||
      lower.includes("disqualified") ||
      lower.includes("dsq")
    ) {
      return "PENALTY";
    }
    return "RETIRED";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Top 3 podium
  const top3 = drivers.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((driver) => (
          <div
            key={driver.position}
            className="relative bg-[#1a1a1a] rounded-xl overflow-hidden"
            style={{
              borderTop: `4px solid ${
                driver.position === 1 ? "#FF4444" : driver.position === 2 ? "#FF8844" : "#FFAA44"
              }`,
            }}
          >
            <div className="p-6 text-center">
              <div
                className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-black ${
                  driver.position === 1
                    ? "bg-red-500 text-white"
                    : driver.position === 2
                    ? "bg-orange-500 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {driver.position}
              </div>

              <div
                className="w-1 h-16 mx-auto rounded-full mb-3"
                style={{ backgroundColor: driver.teamColor }}
              />

              <h3 className="text-white font-bold text-lg">{driver.fullName}</h3>
              <p className="text-sm text-gray-500">{driver.team}</p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">DNFs</span>
                  <span className="text-red-500 font-bold">{driver.dnfs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Incidents</span>
                  <span className="text-white font-bold">{driver.totalIncidents}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of standings */}
      <DestructorsStandings />
    </div>
  );
}
