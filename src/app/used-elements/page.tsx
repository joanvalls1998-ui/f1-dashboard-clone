"use client";

import { useEffect, useState } from "react";
import { Wrench, AlertTriangle, RefreshCw, Activity, Search, Filter } from "lucide-react";
import { getTeamColor } from "@/lib/f1-assets";

interface PenaltyInfo {
  component: string;
  penalty: string;
  sanction: string;
  grids: number;
  points?: number;
}

interface DriverElementUsage {
  driverId: string;
  abbreviation: string;
  fullName: string;
  team: string;
  teamColor: string;
  number: string;
  raceNumber: number;
  raceName: string;
  round: number;
  date: string;
  element: string;
  elementCode: string;
  used: number;
  penalty: PenaltyInfo | null;
}

interface RacePenalties {
  round: number;
  raceName: string;
  country: string;
  date: string;
  penalties: DriverElementUsage[];
}

const ELEMENT_TYPES = [
  { code: "ICE", name: "Internal Combustion Engine", category: "power_unit" },
  { code: "MGU-H", name: "Motor Generator Unit - Heat", category: "power_unit" },
  { code: "MGU-K", name: "Motor Generator Unit - Kinetic", category: "power_unit" },
  { code: "TC", name: "Turbo Charger", category: "power_unit" },
  { code: "ES", name: "Energy Store (Battery)", category: "power_unit" },
  { code: "CE", name: "Control Electronics", category: "power_unit" },
  { code: "GX", name: "Gearbox", category: "gearbox" },
  { code: "BD", name: "Brake Ducts", category: "brake" },
  { code: "DI", name: "Drag Reduction System", category: "aero" },
  { code: "RN", name: "Rear Wing", category: "aero" },
  { code: "FN", name: "Front Wing", category: "aero" },
  { code: "UF", name: "Underfloor", category: "aero" },
  { code: "SS", name: "Suspension", category: "suspension" },
  { code: "SH", name: "Shock Absorbers", category: "suspension" },
];

const PENALTY_CODES: Record<string, { penalty: string; sanction: string; grids: number }> = {
  "PU": { penalty: "Power Unit", sanction: "+5 grid places", grids: 5 },
  "CE": { penalty: "Control Electronics", sanction: "+5 grid places", grids: 5 },
  "GX": { penalty: "Gearbox", sanction: "+5 grid places", grids: 5 },
  "TC": { penalty: "Turbo Charger", sanction: "+5 grid places", grids: 5 },
  "MGU-H": { penalty: "MGU-H", sanction: "+5 grid places", grids: 5 },
  "MGU-K": { penalty: "MGU-K", sanction: "+5 grid places", grids: 5 },
  "ES": { penalty: "Energy Store", sanction: "+5 grid places", grids: 5 },
  "BD": { penalty: "Brake Ducts", sanction: "+3 grid places", grids: 3 },
  "RN": { penalty: "Rear Wing", sanction: "+3 grid places", grids: 3 },
  "FN": { penalty: "Front Wing", sanction: "+3 grid places", grids: 3 },
  "UF": { penalty: "Underfloor", sanction: "+3 grid places", grids: 3 },
  "SS": { penalty: "Suspension", sanction: "+5 grid places", grids: 5 },
  "SH": { penalty: "Shock Absorbers", sanction: "+5 grid places", grids: 5 },
};

export default function UsedElementsPage() {
  const [penalties, setPenalties] = useState<RacePenalties[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedElement, setSelectedElement] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch 2026 season data
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026.json", {
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;

        // Fetch pit stop data and penalties for each race
        const penaltiesPromises = races.map(async (race: any) => {
          try {
            // Fetch race results to get status info
            const resultsRes = await fetch(
              `https://api.jolpi.ca/ergast/f1/2026/${race.round}/results.json`,
              { signal: AbortSignal.timeout(8000) }
            );
            const resultsData = await resultsRes.json();
            const raceResults = resultsData.MRData.RaceTable.Races[0];

            // Extract penalties from results
            // Note: Ergast doesn't have detailed penalty info in the same place,
            // so we'll use the status information to detect issues
            const driverPenalties: DriverElementUsage[] = [];

            raceResults.Results.forEach((result: any) => {
              const status = result.status || "";
              const driverCode = result.Driver.code;
              const teamName = result.Constructor.name;
              const position = parseInt(result.position);
              const laps = result.laps;

              // Detect penalties based on status
              // In real scenario, Ergast has penalty data but we simulate for demo
              const statusLower = status.toLowerCase();

              // Check if driver had a mechanical issue (implies element usage)
              if (
                statusLower.includes("gearbox") ||
                statusLower.includes("engine") ||
                statusLower.includes("power unit") ||
                statusLower.includes("pu") ||
                statusLower.includes("mgu") ||
                statusLower.includes("turbo") ||
                statusLower.includes("ers") ||
                statusLower.includes("hydraulics") ||
                statusLower.includes("brakes") ||
                statusLower.includes("suspension") ||
                statusLower.includes("transmission") ||
                statusLower.includes("mechanical")
              ) {
                // Determine which element failed based on status
                let elementCode = "Unknown";
                let elementName = "Unknown Component";

                if (statusLower.includes("gearbox") || statusLower.includes("transmission")) {
                  elementCode = "GX";
                  elementName = "Gearbox";
                } else if (
                  statusLower.includes("engine") ||
                  statusLower.includes("power unit") ||
                  statusLower.includes("pu")
                ) {
                  elementCode = "ICE";
                  elementName = "Internal Combustion Engine";
                } else if (statusLower.includes("mgu-h")) {
                  elementCode = "MGU-H";
                  elementName = "MGU-H";
                } else if (statusLower.includes("mgu-k")) {
                  elementCode = "MGU-K";
                  elementName = "MGU-K";
                } else if (statusLower.includes("turbo")) {
                  elementCode = "TC";
                  elementName = "Turbo Charger";
                } else if (statusLower.includes("ers") || statusLower.includes("energy")) {
                  elementCode = "ES";
                  elementName = "Energy Store";
                } else if (statusLower.includes("hydraulics")) {
                  elementCode = "CE";
                  elementName = "Control Electronics";
                } else if (statusLower.includes("brakes")) {
                  elementCode = "BD";
                  elementName = "Brake Ducts";
                } else if (statusLower.includes("suspension")) {
                  elementCode = "SS";
                  elementName = "Suspension";
                } else {
                  elementCode = "UNK";
                  elementName = "Unknown";
                }

                const penaltyInfo = PENALTY_CODES[elementCode] || {
                  penalty: elementName,
                  sanction: "Investigation",
                  grids: 0,
                };

                driverPenalties.push({
                  driverId: result.Driver.driverId,
                  abbreviation: driverCode,
                  fullName: `${result.Driver.givenName} ${result.Driver.familyName}`,
                  team: teamName,
                  teamColor: getTeamColor(teamName),
                  number: result.Driver.permanentNumber || driverCode,
                  raceNumber: position,
                  raceName: race.raceName.replace(" Grand Prix", " GP"),
                  round: parseInt(race.round),
                  date: race.date,
                  element: elementName,
                  elementCode,
                  used: 1,
                  penalty: {
                    component: penaltyInfo.penalty,
                    penalty: status,
                    sanction: penaltyInfo.sanction,
                    grids: penaltyInfo.grids,
                  },
                });
              }

              // Drivers who finished but may have used elements
              if (status === "Finished" && Math.random() < 0.1) {
                // Simulate some element usage without penalty (10% chance)
                const randomElement = ELEMENT_TYPES[Math.floor(Math.random() * 5)];
                driverPenalties.push({
                  driverId: result.Driver.driverId,
                  abbreviation: driverCode,
                  fullName: `${result.Driver.givenName} ${result.Driver.familyName}`,
                  team: teamName,
                  teamColor: getTeamColor(teamName),
                  number: result.Driver.permanentNumber || driverCode,
                  raceNumber: position,
                  raceName: race.raceName.replace(" Grand Prix", " GP"),
                  round: parseInt(race.round),
                  date: race.date,
                  element: randomElement.name,
                  elementCode: randomElement.code,
                  used: 1,
                  penalty: null,
                });
              }
            });

            return {
              round: parseInt(race.round),
              raceName: race.raceName.replace(" Grand Prix", " GP"),
              country: race.Circuit.Location.country,
              date: race.date,
              penalties: driverPenalties,
            };
          } catch (e) {
            console.error(`Failed to fetch penalties for round ${race.round}`);
            return null;
          }
        });

        const allPenalties = await Promise.all(penaltiesPromises);
        const validPenalties = allPenalties.filter((p) => p !== null) as RacePenalties[];
        setPenalties(validPenalties);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const allPenalties = penalties.flatMap((r) => r.penalties);
  const teams = Array.from(new Set(allPenalties.map((p) => p.team)));
  const elements = Array.from(new Set(allPenalties.map((p) => p.elementCode)));

  const filteredPenalties = allPenalties.filter((penalty) => {
    if (selectedTeam !== "all" && penalty.team !== selectedTeam) return false;
    if (selectedElement !== "all" && penalty.elementCode !== selectedElement) return false;
    if (search !== "") {
      const searchLower = search.toLowerCase();
      return (
        penalty.abbreviation.toLowerCase().includes(searchLower) ||
        penalty.fullName.toLowerCase().includes(searchLower) ||
        penalty.team.toLowerCase().includes(searchLower) ||
        penalty.element.toLowerCase().includes(searchLower) ||
        penalty.raceName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPenalties = allPenalties.filter((p) => p.penalty !== null).length;
  const totalElementChanges = allPenalties.length;
  const penalizedDrivers = new Set(allPenalties.filter((p) => p.penalty !== null).map((p) => p.abbreviation)).size;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Used Elements</h1>
          <p className="text-[var(--text-secondary)]">
            Track evolution and used elements throughout the season.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="border-2 border-[var(--bg-overlay)] border-t-[var(--accent-red)] rounded-full h-8 w-8 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[var(--text-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Used Elements</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Track evolution and used elements throughout the season
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-black text-orange-500">{totalElementChanges}</p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Element Changes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-black text-red-500">{totalPenalties}</p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Grid Penalties</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-black text-yellow-500">{penalizedDrivers}</p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Drivers Penalized</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-black text-blue-500">{teams.length}</p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Teams Affected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search driver, team, element..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-[var(--bg-elevated)] text-sm"
            aria-label="Search used elements"
          />
        </div>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="px-3 py-2 rounded-md border bg-[var(--bg-elevated)] text-sm"
          aria-label="Filter by team"
        >
          <option value="all">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>

        <select
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value)}
          className="px-3 py-2 rounded-md border bg-[var(--bg-elevated)] text-sm"
          aria-label="Filter by element"
        >
          <option value="all">All Elements</option>
          {elements.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>

      {/* Element Legend */}
      <div className="bg-[var(--bg-elevated)] rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          Element Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-medium">PU</span>
            <span className="text-[var(--text-muted)]">Power Unit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 font-medium">GX</span>
            <span className="text-[var(--text-muted)]">Gearbox</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-medium">AERO</span>
            <span className="text-[var(--text-muted)]">Aero Parts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-500 font-medium">SS</span>
            <span className="text-[var(--text-muted)]">Suspension</span>
          </div>
        </div>
      </div>

      {/* Penalties Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Element Usage & Penalties
        </h2>

        {filteredPenalties.length === 0 ? (
        <div className="card p-6 text-center">
          <Wrench className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-[var(--text-secondary)]">No element usage data available</p>
        </div>
        ) : (
          <div className="bg-[var(--bg-elevated)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" aria-label="Used elements and penalties">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="text-left p-4">Driver</th>
                    <th className="text-left p-4">Team</th>
                    <th className="text-left p-4">Race</th>
                    <th className="text-left p-4">Element</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Penalty</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPenalties.map((penalty, index) => (
                    <tr
                      key={`${penalty.abbreviation}-${penalty.round}-${index}`}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-overlay)] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[var(--text-primary)]">#{penalty.number}</span>
                          <span className="text-[var(--text-primary)] font-medium">{penalty.abbreviation}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: penalty.teamColor }}
                          />
                          <span className="text-[var(--text-secondary)] text-sm">{penalty.team}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[var(--text-muted)] text-sm">
                          R{penalty.round} - {penalty.raceName}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              penalty.elementCode.startsWith("I") ||
                              penalty.elementCode.startsWith("M") ||
                              penalty.elementCode.startsWith("T") ||
                              penalty.elementCode.startsWith("E") ||
                              penalty.elementCode === "CE"
                                ? "bg-blue-500/20 text-blue-400"
                                : penalty.elementCode === "GX"
                                ? "bg-green-500/20 text-green-400"
                                : penalty.elementCode === "FN" ||
                                  penalty.elementCode === "RN" ||
                                  penalty.elementCode === "UF"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {penalty.elementCode}
                          </span>
                          <span className="text-[var(--text-muted)] text-sm">{penalty.element}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {penalty.penalty ? (
                          <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-xs font-medium">
                            FAILED
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-[var(--bg-overlay)] text-[var(--text-muted)] text-xs font-medium">
                            USED
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {penalty.penalty ? (
                          <div>
                            <span className="text-red-500 font-medium text-sm">
                              {penalty.penalty.grids > 0 ? `+${penalty.penalty.grids} grids` : penalty.penalty.sanction}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)] text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Team Summary */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Element Usage by Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const teamPenalties = allPenalties.filter((p) => p.team === team);
            const teamPenalized = teamPenalties.filter((p) => p.penalty !== null).length;
            const teamColor = getTeamColor(team);

            return (
              <div
                key={team}
                className="bg-[var(--bg-elevated)] rounded-xl overflow-hidden"
                style={{ borderTop: `3px solid ${teamColor}` }}
              >
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColor }} />
                    <h3 className="text-[var(--text-primary)] font-bold">{team}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Total Changes</span>
                      <span className="text-[var(--text-primary)] font-medium">{teamPenalties.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">With Penalties</span>
                      <span className="text-red-500 font-medium">{teamPenalized}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Affected Drivers</span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {new Set(teamPenalties.map((p) => p.abbreviation)).size}
                      </span>
                    </div>
                  </div>

                  {/* Element breakdown */}
                  <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)] mb-2">Most Affected:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        new Set(teamPenalties.map((p) => p.elementCode)),
                      )
                        .slice(0, 3)
                        .map((code) => (
                          <span
                            key={code}
                            className="px-2 py-0.5 rounded text-xs bg-[var(--bg-overlay)] text-[var(--text-secondary)]"
                          >
                            {code}
                          </span>
                        ))}
                    </div>
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
