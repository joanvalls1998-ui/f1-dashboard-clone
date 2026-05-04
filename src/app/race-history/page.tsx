"use client";

import { useEffect, useState } from "react";
import { Flag, Trophy, Clock, MapPin } from "lucide-react";
import { circuitImages, teamColors } from "@/lib/f1-assets";

interface RaceResult {
  raceName: string;
  circuit: string;
  country: string;
  date: string;
  results: RaceResultRow[];
}

interface RaceResultRow {
  position: number;
  driver: string;
  abbreviation: string;
  team: string;
  nationality: string;
  points: string;
  status: string;
  time?: string;
  grid?: string;
}

const mockRaceHistory: RaceResult[] = [
  {
    raceName: "Australian Grand Prix",
    circuit: "Albert Park Circuit",
    country: "Australia",
    date: "2026-03-08",
    results: [
      { position: 1, driver: "Andrea Kimi Antonelli", abbreviation: "ANT", team: "Mercedes", nationality: "Italian", points: "25", status: "Finished", time: "1:30:45.123" },
      { position: 2, driver: "Oscar Piastri", abbreviation: "PIA", team: "McLaren", nationality: "Australian", points: "18", status: "Finished", time: "+4.231" },
      { position: 3, driver: "Charles Leclerc", abbreviation: "LEC", team: "Ferrari", nationality: "Monegasque", points: "15", status: "Finished", time: "+8.445" },
      { position: 4, driver: "George Russell", abbreviation: "RUS", team: "Mercedes", nationality: "British", points: "12", status: "Finished", time: "+12.678" },
      { position: 5, driver: "Lando Norris", abbreviation: "NOR", team: "McLaren", nationality: "British", points: "10", status: "Finished", time: "+15.234" },
      { position: 6, driver: "Lewis Hamilton", abbreviation: "HAM", team: "Ferrari", nationality: "British", points: "8", status: "Finished", time: "+18.901" },
      { position: 7, driver: "Max Verstappen", abbreviation: "VER", team: "Red Bull Racing", nationality: "Dutch", points: "6", status: "Finished", time: "+22.345" },
      { position: 8, driver: "Isack Hadjar", abbreviation: "HAD", team: "RB F1 Team", nationality: "French", points: "4", status: "Finished", time: "+25.678" },
    ],
  },
  {
    raceName: "Chinese Grand Prix",
    circuit: "Shanghai International Circuit",
    country: "China",
    date: "2026-03-15",
    results: [
      { position: 1, driver: "Andrea Kimi Antonelli", abbreviation: "ANT", team: "Mercedes", nationality: "Italian", points: "25", status: "Finished", time: "1:35:12.456" },
      { position: 2, driver: "George Russell", abbreviation: "RUS", team: "Mercedes", nationality: "British", points: "18", status: "Finished", time: "+2.123" },
      { position: 3, driver: "Charles Leclerc", abbreviation: "LEC", team: "Ferrari", nationality: "Monegasque", points: "15", status: "Finished", time: "+5.678" },
      { position: 4, driver: "Oscar Piastri", abbreviation: "PIA", team: "McLaren", nationality: "Australian", points: "12", status: "Finished", time: "+8.901" },
      { position: 5, driver: "Lewis Hamilton", abbreviation: "HAM", team: "Ferrari", nationality: "British", points: "10", status: "Finished", time: "+12.234" },
      { position: 6, driver: "Lando Norris", abbreviation: "NOR", team: "McLaren", nationality: "British", points: "8", status: "Finished", time: "+15.567" },
      { position: 7, driver: "Pierre Gasly", abbreviation: "GAS", team: "Alpine", nationality: "French", points: "6", status: "Finished", time: "+18.890" },
      { position: 8, driver: "Liam Lawson", abbreviation: " LAW", team: "RB F1 Team", nationality: "New Zealander", points: "4", status: "Finished", time: "+22.123" },
    ],
  },
  {
    raceName: "Japanese Grand Prix",
    circuit: "Suzuka Circuit",
    country: "Japan",
    date: "2026-03-29",
    results: [
      { position: 1, driver: "Oscar Piastri", abbreviation: "PIA", team: "McLaren", nationality: "Australian", points: "25", status: "Finished", time: "1:28:03.403" },
      { position: 2, driver: "Andrea Kimi Antonelli", abbreviation: "ANT", team: "Mercedes", nationality: "Italian", points: "18", status: "Finished", time: "+13.722" },
      { position: 3, driver: "Charles Leclerc", abbreviation: "LEC", team: "Ferrari", nationality: "Monegasque", points: "15", status: "Finished", time: "+15.270" },
      { position: 4, driver: "George Russell", abbreviation: "RUS", team: "Mercedes", nationality: "British", points: "12", status: "Finished", time: "+15.754" },
      { position: 5, driver: "Lando Norris", abbreviation: "NOR", team: "McLaren", nationality: "British", points: "10", status: "Finished", time: "+23.479" },
      { position: 6, driver: "Lewis Hamilton", abbreviation: "HAM", team: "Ferrari", nationality: "British", points: "8", status: "Finished", time: "+35.123" },
      { position: 7, driver: "Max Verstappen", abbreviation: "VER", team: "Red Bull Racing", nationality: "Dutch", points: "6", status: "Finished", time: "+45.678" },
      { position: 8, driver: "Isack Hadjar", abbreviation: "HAD", team: "RB F1 Team", nationality: "French", points: "4", status: "Finished", time: "+58.901" },
    ],
  },
];

export default function RaceHistoryPage() {
  const [races, setRaces] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRace, setSelectedRace] = useState<number>(0);

  useEffect(() => {
    async function fetchRaceHistory() {
      try {
        const res = await fetch("https://api.jolpi.ca/ergast/f1/2026/results.json?limit=200", { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const data = await res.json();
          const racesData = data.MRData.RaceTable.Races || [];

          // Group by race
          const grouped: RaceResult[] = racesData.map((r: any) => {
            const results: RaceResultRow[] = (r.Results || []).map((result: any) => ({
              position: parseInt(result.position),
              driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
              abbreviation: result.Driver.code,
              team: result.Constructor.name,
              nationality: result.Driver.nationality,
              points: result.points,
              status: result.status,
              time: result.Time?.time,
            }));

            return {
              raceName: r.raceName,
              circuit: r.Circuit.circuitName,
              country: r.Circuit.Location.country,
              date: r.date,
              results,
            };
          });

          setRaces(grouped);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error fetching race history:", error);
      }
      setRaces(mockRaceHistory);
      setLoading(false);
    }

    fetchRaceHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="border-2 rounded-full h-8 w-8 animate-spin" style={{ borderColor: 'var(--bg-overlay)', borderTopColor: 'var(--accent-red)' }} />
      </div>
    );
  }

  if (!races.length) return null;

  const currentRace = races[selectedRace] || races[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flag className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>2026 Race History</h1>
      </div>

      {/* Race selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {races.map((race, i) => (
          <button
            key={i}
            onClick={() => setSelectedRace(i)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              selectedRace === i
                ? "btn-primary var(--text-primary)"
                : "bg-card border hover:bg-muted"
            }`}
          >
            {race.country === "Australia" ? "AUS" :
             race.country === "China" ? "CHN" :
             race.country === "Japan" ? "JPN" :
             race.country === "Bahrain" ? "BRN" :
             race.country === "Saudi Arabia" ? "SAU" :
             race.country === "Miami" ? "MIA" :
             race.country.slice(0, 3).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Race info */}
      <div className="bg-card rounded-xl p-6 border">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{currentRace.raceName}</h2>
            <div className="flex items-center gap-2 text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              <MapPin className="w-4 h-4" />
              {currentRace.circuit}, {currentRace.country}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Clock className="w-4 h-4" />
              {new Date(currentRace.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Results table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Pos</th>
                <th className="text-left p-3 font-medium">Driver</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Team</th>
                <th className="text-center p-3 font-medium hidden sm:table-cell">Grid</th>
                <th className="text-center p-3 font-medium hidden sm:table-cell">Time</th>
                <th className="text-center p-3 font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {currentRace.results.map((result) => (
                <tr key={result.position} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <span className={`font-bold text-lg ${
                      result.position === 1 ? "text-yellow-500" :
                      result.position === 2 ? "var(--text-muted)" :
                      result.position === 3 ? "text-amber-600" : ""
                    }`}>
                      {result.position}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{result.driver}</div>
                    <div className="text-xs md:hidden" style={{ color: 'var(--text-muted)' }}>{result.team}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-5 rounded-full" style={{ backgroundColor: teamColors[result.team] || "#666" }} />
                      <span className="text-sm">{result.team}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">
                    <span className="text-sm">{result.grid || "-"}</span>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">
                    <span className="font-mono text-sm">{result.time || result.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-bold ${result.position <= 3 ? "text-cyan-400" : ""}`}>
                      {result.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
