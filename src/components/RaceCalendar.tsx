"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Search, XCircle } from "lucide-react";

interface Race {
  round: number;
  country: string;
  locality: string;
  officialName: string;
  date: string;
  sessionKey: number;
  winner?: string;
  winnerTeam?: string;
  cancelled?: boolean;
}

const allRaces: Race[] = [
  { round: 1, country: "Australia", locality: "Melbourne", officialName: "Australian Grand Prix", date: "2026-03-08", sessionKey: 11234, winner: "Oscar Piastri", winnerTeam: "McLaren" },
  { round: 2, country: "China", locality: "Shanghai", officialName: "Chinese Grand Prix", date: "2026-03-15", sessionKey: 11245, winner: "Lando Norris", winnerTeam: "McLaren" },
  { round: 3, country: "Japan", locality: "Suzuka", officialName: "Japanese Grand Prix", date: "2026-03-29", sessionKey: 11253, winner: "Kimi Antonelli", winnerTeam: "Mercedes" },
  { round: 4, country: "Bahrain", locality: "Sakhir", officialName: "Bahrain Grand Prix", date: "2026-04-12", sessionKey: 11261, cancelled: true },
  { round: 5, country: "Saudi Arabia", locality: "Jeddah", officialName: "Saudi Arabian Grand Prix", date: "2026-04-19", sessionKey: 11269, cancelled: true },
  { round: 6, country: "United States", locality: "Miami", officialName: "Miami Grand Prix", date: "2026-05-03", sessionKey: 11280 },
  { round: 7, country: "Canada", locality: "Montreal", officialName: "Canadian Grand Prix", date: "2026-05-24", sessionKey: 11291 },
  { round: 8, country: "Monaco", locality: "Monaco", officialName: "Monaco Grand Prix", date: "2026-06-07", sessionKey: 11299 },
  { round: 9, country: "Spain", locality: "Barcelona", officialName: "Spanish Grand Prix", date: "2026-06-14", sessionKey: 11307 },
  { round: 10, country: "Austria", locality: "Spielberg", officialName: "Austrian Grand Prix", date: "2026-06-28", sessionKey: 11315 },
  { round: 11, country: "United Kingdom", locality: "Silverstone", officialName: "British Grand Prix", date: "2026-07-05", sessionKey: 11326 },
  { round: 12, country: "Belgium", locality: "Spa", officialName: "Belgian Grand Prix", date: "2026-07-19", sessionKey: 11334 },
  { round: 13, country: "Hungary", locality: "Budapest", officialName: "Hungarian Grand Prix", date: "2026-07-26", sessionKey: 11342 },
  { round: 14, country: "Netherlands", locality: "Zandvoort", officialName: "Dutch Grand Prix", date: "2026-08-23", sessionKey: 11353 },
  { round: 15, country: "Italy", locality: "Monza", officialName: "Italian Grand Prix", date: "2026-09-06", sessionKey: 11361 },
  { round: 16, country: "Azerbaijan", locality: "Baku", officialName: "Azerbaijan Grand Prix", date: "2026-09-13", sessionKey: 11369 },
  { round: 17, country: "Singapore", locality: "Marina Bay", officialName: "Singapore Grand Prix", date: "2026-09-26", sessionKey: 11377 },
  { round: 18, country: "United States", locality: "Austin", officialName: "United States Grand Prix", date: "2026-10-11", sessionKey: 11388 },
  { round: 19, country: "Mexico", locality: "Mexico City", officialName: "Mexican Grand Prix", date: "2026-10-25", sessionKey: 11396 },
  { round: 20, country: "Brazil", locality: "São Paulo", officialName: "Brazilian Grand Prix", date: "2026-11-08", sessionKey: 11412 },
  { round: 21, country: "United States", locality: "Las Vegas", officialName: "Las Vegas Grand Prix", date: "2026-11-22", sessionKey: 11420 },
  { round: 22, country: "Qatar", locality: "Lusail", officialName: "Qatar Grand Prix", date: "2026-11-29", sessionKey: 11428 },
  { round: 23, country: "Abu Dhabi", locality: "Yas Marina", officialName: "Abu Dhabi Grand Prix", date: "2026-12-06", sessionKey: 11436 },
];

const countries = Array.from(new Set(allRaces.map(r => r.country)));

export function RaceCalendar() {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showPastRaces, setShowPastRaces] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);
  const [races, setRaces] = useState<Race[]>(allRaces);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const updatedRaces = [...allRaces];
        
        for (let i = 0; i < updatedRaces.length; i++) {
          const race = updatedRaces[i];
          if (new Date(race.date) < new Date() && !race.cancelled) {
            try {
              const posRes = await fetch(`https://api.openf1.org/v1/position?session_key=${race.sessionKey}`);
              const drvRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${race.sessionKey}`);
              
              if (posRes.ok && drvRes.ok) {
                const positions = await posRes.json();
                const drivers = await drvRes.json();
                
                if (positions.length > 0 && drivers.length > 0) {
                  const finalPositions: Record<number, number> = {};
                  for (const p of positions) {
                    const dn = p.driver_number;
                    if (!(dn in finalPositions) || p.date > String(finalPositions[dn])) {
                      finalPositions[dn] = p.position;
                    }
                  }
                  
                  const winnerNum = Object.entries(finalPositions).sort((a, b) => a[1] - b[1])[0]?.[0];
                  const winner = drivers.find((d: any) => d.driver_number === parseInt(winnerNum));
                  if (winner) {
                    updatedRaces[i] = {
                      ...race,
                      winner: winner.full_name || winner.name_acronym,
                      winnerTeam: winner.team_name
                    };
                  }
                }
              }
            } catch (e) {
              // Keep existing data if fetch fails
            }
          }
        }
        
        setRaces(updatedRaces);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResults();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isRacePast = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const filteredRaces = races.filter(race => {
    const matchesSearch = search === "" || 
      race.officialName.toLowerCase().includes(search.toLowerCase()) ||
      race.country.toLowerCase().includes(search.toLowerCase()) ||
      race.locality.toLowerCase().includes(search.toLowerCase());
    
    const matchesCountry = !selectedCountry || race.country === selectedCountry;
    const matchesPast = !showPastRaces || isRacePast(race.date);
    const matchesCancelled = showCancelled || !race.cancelled;
    
    return matchesSearch && matchesCountry && matchesPast && matchesCancelled;
  });

  const nextRace = races.find(r => !isRacePast(r.date) && !r.cancelled);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Race Calendar 2026</h2>
        {loading && <span className="text-xs text-muted-foreground">Updating results...</span>}
      </div>

      {nextRace && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/5 p-4">
          <div className="text-sm text-green-500 mb-1 font-medium">Next Race</div>
          <div className="font-semibold text-lg">{nextRace.officialName}</div>
          <div className="text-sm text-muted-foreground">{nextRace.country} • {formatDate(nextRace.date)}</div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search races..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-sm"
          />
        </div>
        <select
          value={selectedCountry || ""}
          onChange={(e) => setSelectedCountry(e.target.value || null)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPastRaces}
            onChange={(e) => setShowPastRaces(e.target.checked)}
          />
          Past
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showCancelled}
            onChange={(e) => setShowCancelled(e.target.checked)}
          />
          Cancelled
        </label>
      </div>

      {/* Race List */}
      <div className="space-y-2">
        {filteredRaces.map(race => (
          <div
            key={race.sessionKey}
            className={`rounded-lg border p-4 ${
              race.cancelled 
                ? "border-red-500/30 bg-red-500/5 opacity-60" 
                : !isRacePast(race.date) 
                  ? "border-green-500/50 bg-green-500/5" 
                  : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${
                  race.cancelled ? "text-red-500/50" : "text-muted-foreground"
                }`}>
                  {race.round}
                </div>
                <div>
                  <div className={`font-semibold ${race.cancelled ? "line-through text-muted-foreground" : ""}`}>
                    {race.officialName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {race.locality}, {race.country}
                    {race.cancelled && (
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-3 h-3" /> Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-sm ${race.cancelled ? "text-red-500/50" : ""}`}>
                  <Clock className="w-3 h-3" />
                  {formatDate(race.date)}
                </div>
                {race.winner && (
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">✓</span> {race.winner} ({race.winnerTeam})
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
