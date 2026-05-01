"use client";

import { useEffect, useState } from "react";
import { Trophy, XCircle, Clock, Flag } from "lucide-react";
import Image from "next/image";
import { driverImages, teamColors, getTeamColor } from "@/lib/f1-assets";

interface DriverResult {
  position: number;
  abbreviation: string;
  fullName: string;
  team: string;
  points: number;
  status: string;
  laps?: number;
  time?: string;
  fastestLap?: boolean;
}

interface RaceInfo {
  raceName: string;
  circuit: string;
  location: string;
  country: string;
  date: string;
}

export default function LastRace() {
  const [results, setResults] = useState<DriverResult[]>([]);
  const [raceInfo, setRaceInfo] = useState<RaceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLastRace() {
      try {
        // Fetch last race results from Ergast
        const response = await fetch("https://api.jolpi.ca/ergast/f1/current/last/results.json");
        const data = await response.json();
        
        if (!data.MRData.RaceTable.Races || data.MRData.RaceTable.Races.length === 0) {
          // Fallback to 2026 data if current season has no results
          const response2026 = await fetch("https://api.jolpi.ca/ergast/f1/2026/3/results.json");
          const data2026 = await response2026.json();
          
          if (data2026.MRData.RaceTable.Races && data2026.MRData.RaceTable.Races.length > 0) {
            const race = data2026.MRData.RaceTable.Races[0];
            setRaceInfo({
              raceName: race.raceName,
              circuit: race.Circuit.circuitName,
              location: race.Circuit.Location.locality,
              country: race.Circuit.Location.country,
              date: race.date
            });
            
            const processedResults = race.Results.slice(0, 10).map((r: any, idx: number) => ({
              position: parseInt(r.position),
              abbreviation: r.Driver.code,
              fullName: `${r.Driver.givenName} ${r.Driver.familyName}`,
              team: r.Constructor.name,
              points: idx < 10 ? [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][idx] : 0,
              status: r.status === "Finished" ? "Finished" : "DNF",
              laps: parseInt(r.laps),
              time: r.Time?.time || null,
              fastestLap: r.FastestLap?.rank === "1"
            }));
            setResults(processedResults);
          }
          setLoading(false);
          return;
        }
        
        const race = data.MRData.RaceTable.Races[0];
        setRaceInfo({
          raceName: race.raceName,
          circuit: race.Circuit.circuitName,
          location: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
          date: race.date
        });
        
        const processedResults = race.Results.slice(0, 10).map((r: any, idx: number) => ({
          position: parseInt(r.position),
          abbreviation: r.Driver.code,
          fullName: `${r.Driver.givenName} ${r.Driver.familyName}`,
          team: r.Constructor.name,
          points: parseInt(r.points),
          status: r.status === "Finished" ? "Finished" : "DNF",
          laps: parseInt(r.laps),
          time: r.Time?.time || null,
          fastestLap: r.FastestLap?.rank === "1"
        }));
        setResults(processedResults);
      } catch (error) {
        console.error("Error fetching last race:", error);
        // Fallback to Japan GP 2026
        const fallbackResults: DriverResult[] = [
          { position: 1, abbreviation: "ANT", fullName: "Kimi Antonelli", team: "Mercedes", points: 25, status: "Finished", fastestLap: false },
          { position: 2, abbreviation: "PIA", fullName: "Oscar Piastri", team: "McLaren", points: 18, status: "Finished", fastestLap: false },
          { position: 3, abbreviation: "LEC", fullName: "Charles Leclerc", team: "Ferrari", points: 15, status: "Finished", fastestLap: false },
          { position: 4, abbreviation: "RUS", fullName: "George Russell", team: "Mercedes", points: 12, status: "Finished", fastestLap: false },
          { position: 5, abbreviation: "NOR", fullName: "Lando Norris", team: "McLaren", points: 10, status: "Finished", fastestLap: false },
        ];
        setResults(fallbackResults);
        setRaceInfo({
          raceName: "Japanese Grand Prix",
          circuit: "Suzuka Circuit",
          location: "Suzuka",
          country: "Japan",
          date: "2026-04-06"
        });
      }
      setLoading(false);
    }
    
    fetchLastRace();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#171717] rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const winner = results[0];

  return (
    <div className="bg-[#171717] rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-green-500" />
            Last Race
          </h2>
          {raceInfo && (
            <p className="text-sm text-gray-400 mt-1">
              {raceInfo.raceName.replace(" Grand Prix", " GP")} • {raceInfo.location}
            </p>
          )}
        </div>
        {raceInfo && (
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(raceInfo.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </p>
          </div>
        )}
      </div>

      {/* Winner highlight */}
      {winner && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500">
                {driverImages[winner.abbreviation as keyof typeof driverImages] ? (
                  <img
                    src={driverImages[winner.abbreviation as keyof typeof driverImages]}
                    alt={winner.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    {winner.abbreviation}
                  </div>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-black" />
              </div>
            </div>
            <div>
              <p className="text-yellow-500 text-sm font-medium">WINNER</p>
              <p className="text-white font-bold text-lg">{winner.fullName}</p>
              <p className="text-gray-400 text-sm" style={{ color: getTeamColor(winner.team) }}>
                {winner.team}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-black text-white">{winner.points}</p>
              <p className="text-xs text-gray-500">POINTS</p>
              {winner.time && (
                <p className="text-sm text-gray-400 mt-1">{winner.time}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results table */}
      <div className="space-y-2">
        {results.slice(1, 7).map((driver) => (
          <div
            key={driver.position}
            className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors"
          >
            <span className={`w-6 text-center font-bold ${
              driver.position === 2 ? "text-gray-400" :
              driver.position === 3 ? "text-amber-600" :
              "text-gray-500"
            }`}>
              {driver.position}
            </span>
            
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
              {driverImages[driver.abbreviation as keyof typeof driverImages] ? (
                <img
                  src={driverImages[driver.abbreviation as keyof typeof driverImages]}
                  alt={driver.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold">
                  {driver.abbreviation[0]}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {driver.fullName}
                {driver.fastestLap && (
                  <span className="ml-2 text-xs text-green-500 font-normal">FL</span>
                )}
              </p>
              <p className="text-xs text-gray-500 truncate">{driver.team}</p>
            </div>
            
            <div className="text-right">
              <p className="text-white text-sm font-bold">{driver.points} pts</p>
              {driver.status !== "Finished" && (
                <p className="text-xs text-red-500">{driver.status}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-4 text-center">
        <a href="/race-history" className="text-sm text-gray-400 hover:text-white transition-colors">
          View full results →
        </a>
      </div>
    </div>
  );
}
