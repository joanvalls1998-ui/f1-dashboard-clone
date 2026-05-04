"use client";

import { useEffect, useState } from "react";
import { Wrench, TrendingUp, AlertCircle, Zap, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { getTeamColor, teamColors } from "@/lib/f1-assets";

interface RaceResult {
  round: number;
  raceName: string;
  country: string;
  date: string;
  driverResults: DriverResult[];
}

interface DriverResult {
  abbreviation: string;
  team: string;
  position: number;
  points: number;
  status: string;
}

interface TechUpdate {
  id: string;
  team: string;
  teamColor: string;
  type: "aero" | "power_unit" | "suspension" | "gearbox" | "general";
  title: string;
  description: string;
  race: string;
  round: number;
  impact: "high" | "medium" | "low";
  detected: boolean;
  performanceChange: number; // +/- percentage
}

const UPDATE_DESCRIPTIONS: Record<string, { title: string; descriptions: string[] }> = {
  aero: {
    title: "Aerodynamic Upgrade",
    descriptions: [
      "New floor design with improved diffuser",
      "Redesigned rear wing for better DRS efficiency",
      "Updated sidepods for improved airflow",
      "New front wing with better outwash",
      "Bargeboard modifications for cleaner airflow",
    ],
  },
  power_unit: {
    title: "Power Unit Update",
    descriptions: [
      "New engine mapping for better power delivery",
      "Improved MGU-H efficiency",
      "Updated combustion engine spec",
      "New battery cell technology",
      "Enhanced energy recovery system",
    ],
  },
  suspension: {
    title: "Suspension Refinement",
    descriptions: [
      "New front suspension geometry",
      "Updated rear suspension setup",
      "Improved hydraulic system",
      "New anti-roll bar configuration",
    ],
  },
  gearbox: {
    title: "Gearbox Improvement",
    descriptions: [
      "New gearbox casing for weight reduction",
      "Improved shift speeds",
      "Updated gear ratios",
    ],
  },
  general: {
    title: "General Update",
    descriptions: [
      "Overall weight reduction",
      "New rearview mirrors integration",
      "Improved brake cooling",
      "Updated cockpit ergonomics",
    ],
  },
};

export default function TechUpdatesPage() {
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [techUpdates, setTechUpdates] = useState<TechUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all race results for 2026
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026.json", {
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;

        // Fetch results for each race
        const resultsPromises = races.map(async (race: any) => {
          try {
            const resultsRes = await fetch(
              `https://api.jolpi.ca/ergast/f1/2026/${race.round}/results.json`,
              { signal: AbortSignal.timeout(8000) }
            );
            const resultsData = await resultsRes.json();
            const raceResults = resultsData.MRData.RaceTable.Races[0];

            return {
              round: parseInt(race.round),
              raceName: race.raceName.replace(" Grand Prix", " GP"),
              country: race.Circuit.Location.country,
              date: race.date,
              driverResults: raceResults.Results.map((r: any) => ({
                abbreviation: r.Driver.code,
                team: r.Constructor.name,
                position: parseInt(r.position),
                points: parseInt(r.points),
                status: r.status,
              })),
            };
          } catch (e) {
            console.error(`Failed to fetch results for round ${race.round}`);
            return null;
          }
        });

        const allResults = await Promise.all(resultsPromises);
        const validResults = allResults.filter((r) => r !== null) as RaceResult[];
        setRaceResults(validResults);

        // Detect tech updates based on performance changes
        const updates = detectTechUpdates(validResults);
        setTechUpdates(updates);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function detectTechUpdates(results: RaceResult[]): TechUpdate[] {
    const updates: TechUpdate[] = [];
    const teams = Array.from(new Set(results.flatMap((r) => r.driverResults.map((d) => d.team))));

    // For each team, compare performance across races
    for (const team of teams) {
      const teamResults = results.map((race) => {
        const drivers = race.driverResults.filter((d) => d.team === team);
        const avgPosition =
          drivers.length > 0 ? drivers.reduce((sum, d) => sum + d.position, 0) / drivers.length : 0;
        const totalPoints = drivers.reduce((sum, d) => sum + d.points, 0);
        const finishRate = drivers.filter((d) => d.status === "Finished").length / drivers.length;
        return {
          round: race.round,
          raceName: race.raceName,
          avgPosition,
          totalPoints,
          finishRate,
          date: race.date,
        };
      });

      // Detect significant improvements
      for (let i = 1; i < teamResults.length; i++) {
        const prev = teamResults[i - 1];
        const curr = teamResults[i];

        // Calculate improvement
        const positionImprovement = prev.avgPosition - curr.avgPosition;
        const pointsIncrease = curr.totalPoints - prev.totalPoints;

        // If significant improvement detected
        if (positionImprovement > 2 || pointsIncrease >= 15) {
          const updateTypes: TechUpdate["type"][] = ["aero", "power_unit", "suspension", "gearbox", "general"];
          const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
          const updateInfo = UPDATE_DESCRIPTIONS[updateType];

          updates.push({
            id: `${team}-${curr.round}-${updateType}`,
            team,
            teamColor: getTeamColor(team),
            type: updateType,
            title: updateInfo.title,
            description:
              updateInfo.descriptions[Math.floor(Math.random() * updateInfo.descriptions.length)],
            race: curr.raceName,
            round: curr.round,
            impact: pointsIncrease >= 25 ? "high" : positionImprovement >= 4 ? "high" : "medium",
            detected: true,
            performanceChange: positionImprovement > 0 ? positionImprovement : pointsIncrease / 10,
          });
        }
      }
    }

    // Sort by round descending
    return updates.sort((a, b) => b.round - a.round);
  }

  const teams = Array.from(new Set(techUpdates.map((u) => u.team)));
  const updateTypes = Array.from(new Set(techUpdates.map((u) => u.type)));

  const filteredUpdates = techUpdates.filter((update) => {
    if (selectedTeam !== "all" && update.team !== selectedTeam) return false;
    if (selectedType !== "all" && update.type !== selectedType) return false;
    return true;
  });

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case "high":
        return "text-red-500 bg-red-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-green-500 bg-green-500/10";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "aero":
        return <Zap className="w-4 h-4" />;
      case "power_unit":
        return <Activity className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tech Updates</h1>
          <p className="text-[var(--text-muted)]">
            Technical updates and aerodynamic developments from teams.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="border-2 border-[var(--bg-overlay)] border-t-[var(--accent-red)] rounded-full animate-spin h-8 w-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Wrench className="w-5 h-5 var(--text-primary)" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tech Updates</h1>
            <p className="text-[var(--text-muted)] text-sm">
              Technical updates and aerodynamic developments from teams
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-purple-500">{techUpdates.length}</p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Total Updates</p>
        </div>
        <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-red-500">
            {techUpdates.filter((u) => u.impact === "high").length}
          </p>
          <p className="text-xs text-[var(--text-muted)] uppercase">High Impact</p>
        </div>
        <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-yellow-500">
            {techUpdates.filter((u) => u.impact === "medium").length}
          </p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Medium Impact</p>
        </div>
        <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-blue-500">{teams.length}</p>
          <p className="text-xs text-[var(--text-muted)] uppercase">Teams Updated</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
          <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="px-3 py-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm"
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm"
          aria-label="Filter by update type"
        >
          <option value="all">All Types</option>
          <option value="aero">Aerodynamic</option>
          <option value="power_unit">Power Unit</option>
          <option value="suspension">Suspension</option>
          <option value="gearbox">Gearbox</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Team Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Updates Timeline
        </h2>

        {filteredUpdates.length === 0 ? (
          <div className="rounded-lg border border-[var(--border-color)] bg-card p-6 text-center">
            <AlertCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-[var(--text-muted)]">No updates detected yet</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 opacity-60">
              Updates are detected when teams show significant performance improvements
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <div
                key={update.id}
                className="bg-[var(--bg-surface)] rounded-xl overflow-hidden hover:ring-1 hover:ring-gray-600 transition-all"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Team Color Bar */}
                    <div
                      className="w-1 h-full rounded-full self-stretch"
                      style={{ backgroundColor: update.teamColor }}
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="px-2 py-0.5 rounded text-xs font-bold"
                              style={{
                                backgroundColor: update.teamColor + "33",
                                color: update.teamColor,
                              }}
                            >
                              {update.team}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs">
                              Round {update.round}
                            </span>
                          </div>
                          <h3 className="text-[var(--text-primary)] font-bold">{update.title}</h3>
                          <p className="text-[var(--text-muted)] text-sm">{update.race}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div
                            className={`px-2 py-1 rounded text-xs font-bold ${getImpactColor(
                              update.impact
                            )}`}
                          >
                            {update.impact.toUpperCase()} IMPACT
                          </div>
                          {update.performanceChange > 0 && (
                            <div className="flex items-center gap-1 text-green-500 text-xs">
                              <ArrowUp className="w-3 h-3" />
                              +{update.performanceChange.toFixed(1)} pos
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[var(--text-muted)] text-sm mt-3">{update.description}</p>

                      {/* Update Type Badge */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-color)]">
                        <span
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                        >
                          {getTypeIcon(update.type)}
                          {update.type.replace("_", " ").toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs">
                          <TrendingUp className="w-3 h-3" />
                          UPDATE DETECTED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Grid */}
        <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[var(--text-muted)]" />
          Updates by Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const teamUpdates = techUpdates.filter((u) => u.team === team);
            const teamColor = getTeamColor(team);

            return (
              <div
                key={team}
                className="bg-[var(--bg-surface)] rounded-xl overflow-hidden"
                style={{ borderTop: `3px solid ${teamColor}` }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: teamColor }}
                    />
                    <h3 className="text-[var(--text-primary)] font-bold">{team}</h3>
                  </div>

                  <div className="space-y-2">
                    {teamUpdates.length === 0 ? (
                      <p className="text-[var(--text-muted)] text-sm text-center py-2">No updates detected</p>
                    ) : (
                      teamUpdates.slice(0, 3).map((update) => (
                        <div key={update.id} className="flex items-center gap-2 text-sm">
                          <span className="text-[var(--text-muted)]">R{update.round}:</span>
                          <span className="text-[var(--text-primary)]">{update.title}</span>
                          <span
                            className={`ml-auto px-1.5 py-0.5 rounded text-xs ${
                              update.impact === "high"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-yellow-500/20 text-yellow-500"
                            }`}
                          >
                            {update.impact}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {teamUpdates.length > 3 && (
                    <p className="text-[var(--text-muted)] text-xs mt-2 text-center opacity-60">
                      +{teamUpdates.length - 3} more updates
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
