"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Search } from "lucide-react";

interface DNFRecord {
  driver_number: number;
  driver_name: string;
  team_name: string;
  team_color: string;
  position: number;
  lap: number;
  reason: string;
  category: string;
}

export function DNFTracker() {
  const [dnfData, setDnfData] = useState<DNFRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchDNF() {
      try {
        const response = await fetch("https://api.jolpi.ca/ergast/f1/current/last/results.json");
        const data = await response.json();

        if (!data.MRData.RaceTable.Races || data.MRData.RaceTable.Races.length === 0) {
          setDnfData([]);
          setLoading(false);
          return;
        }

        const race = data.MRData.RaceTable.Races[0];
        const results = race.Results;

        // Filter for non-finishers (status != 'Finished')
        const dnfs = results
          .filter((r: any) => r.status !== "Finished")
          .map((r: any) => {
            // Categorize the DNF reason
            const reason = r.status;
            const category = categorizeDNF(reason);

            // Determine the lap when DNF occurred (some APIs don't provide this cleanly)
            const lap = r.laps ? parseInt(r.laps) : 0;

            return {
              driver_number: parseInt(r.Driver.permanentNumber || r.Driver.code),
              driver_name: r.Driver.code,
              team_name: r.Constructor.name,
              team_color: getTeamColorRaw(r.Constructor.name),
              position: parseInt(r.position),
              lap,
              reason,
              category,
            };
          });

        setDnfData(dnfs);
      } catch (error) {
        console.error("Error fetching DNF data:", error);
        setDnfData([]);
      }
      setLoading(false);
    }

    fetchDNF();
  }, []);

  function categorizeDNF(reason: string): string {
    const lower = reason.toLowerCase();
    if (lower.includes("accident") || lower.includes("collision") || lower.includes("crash")) {
      return "ACCIDENT";
    }
    if (lower.includes("engine") || lower.includes("power unit") || lower.includes("pu") || lower.includes("mechanical") || lower.includes("gearbox") || lower.includes("transmission") || lower.includes("hydraulics") || lower.includes("brakes") || lower.includes("suspension") || lower.includes("steering") || lower.includes("throttle") || lower.includes("clerance") || lower.includes("mgu-h") || lower.includes("mgu-k") || lower.includes("ers") || lower.includes("turbo") || lower.includes("exhaust") || lower.includes("fuel") || lower.includes("oil") || lower.includes("water") || lower.includes("overheating")) {
      return "MECHANICAL";
    }
    if (lower.includes("driver") || lower.includes("pilot") || lower.includes("error") || lower.includes("mistake") || lower.includes("spin") || lower.includes("locked") || lower.includes("off track")) {
      return "DRIVER_ERROR";
    }
    if (lower.includes("weather") || lower.includes("rain") || lower.includes("wet") || lower.includes("storm") || lower.includes("lightning")) {
      return "WEATHER";
    }
    if (lower.includes("penalty") || lower.includes("disqualified") || lower.includes("dsq") || lower.includes("excluded")) {
      return "PENALTY";
    }
    if (lower.includes("retired") || lower.includes("dnf") || lower.includes("did not finish") || lower.includes("withdrawn") || lower.includes("withdrew")) {
      return "RETIRED";
    }
    return "OTHER";
  }

  function getTeamColorRaw(teamName: string): string {
    const colors: Record<string, string> = {
      'Mercedes': '27F4D2',
      'Ferrari': 'E8002D',
      'McLaren': 'FF8000',
      'Red Bull Racing': '3671C6',
      'Red Bull': '3671C6',
      'Racing Bulls': '6B3FC6',
      'RB F1 Team': '6B3FC6',
      'Aston Martin': '229971',
      'Alpine F1 Team': 'FF87BC',
      'Alpine': 'FF87BC',
      'Haas F1 Team': 'F0F0F0',
      'Williams': '64C4FF',
      'Audi': 'CC0000',
      'Cadillac F1 Team': 'C20000',
      'Cadillac': 'C20000',
      'Kick Sauber': '00FF00',
    };

    return colors[teamName] || '666666';
  }

  const categories = ["all", ...Array.from(new Set(dnfData.map(d => d.category)))];

  const filteredDNF = dnfData.filter(d => {
    const matchesSearch = search === "" ||
      d.driver_name.toLowerCase().includes(search.toLowerCase()) ||
      d.team_name.toLowerCase().includes(search.toLowerCase()) ||
      d.reason.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "MECHANICAL": return "text-orange-500 bg-orange-500/10";
      case "ACCIDENT": return "text-red-500 bg-red-500/10";
      case "DRIVER_ERROR": return "text-yellow-500 bg-yellow-500/10";
      case "WEATHER": return "text-blue-500 bg-blue-500/10";
      case "PENALTY": return "text-purple-500 bg-purple-500/10";
      case "RETIRED": return "text-gray-500 bg-gray-500/10";
      default: return "text-gray-500 bg-gray-500/10";
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">DNF Tracker</h2>
        <span className="px-2 py-0.5 text-xs font-bold bg-red-500/10 text-red-500 rounded">
          {dnfData.length} Retirements
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search driver, team or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-red-500">{dnfData.length}</div>
          <div className="text-sm text-muted-foreground">Total DNFs</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-orange-500">
            {dnfData.filter(d => d.category === "MECHANICAL").length}
          </div>
          <div className="text-sm text-muted-foreground">Mechanical</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-red-500">
            {dnfData.filter(d => d.category === "ACCIDENT").length}
          </div>
          <div className="text-sm text-muted-foreground">Accidents</div>
        </div>
        <div className="p-4 rounded-lg border bg-card text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {dnfData.filter(d => d.category === "DRIVER_ERROR").length}
          </div>
          <div className="text-sm text-muted-foreground">Driver Error</div>
        </div>
      </div>

      {/* DNF list */}
      <div className="space-y-2">
        {filteredDNF.map((dnf, index) => (
          <div
            key={`${dnf.driver_number}-${index}`}
            className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-10 rounded"
                  style={{ backgroundColor: `#${dnf.team_color}` }}
                />
                <div>
                  <div className="font-bold">#{dnf.driver_number} {dnf.driver_name}</div>
                  <div className="text-sm text-muted-foreground">{dnf.team_name}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-500">DNF</div>
                  <div className="text-xs text-muted-foreground">Lap {dnf.lap || "?"}</div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold ${getCategoryColor(dnf.category)}`}>
                  {dnf.category}
                </div>
              </div>
            </div>

            <div className="mt-2 pl-5 text-sm">
              <span className="text-muted-foreground">Reason: </span>
              <span className="font-medium">{dnf.reason}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredDNF.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No retirements in the last race. All drivers finished!
        </div>
      )}
    </div>
  );
}
