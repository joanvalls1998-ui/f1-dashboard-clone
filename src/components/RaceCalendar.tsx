"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, Search, Filter } from "lucide-react";

interface Race {
  round: number;
  country: string;
  locality: string;
  officialName: string;
  date: string;
  sessionKey: number;
  winner?: string;
  winnerTeam?: string;
}

const allRaces: Race[] = [
  { round: 1, country: "Bahrain", locality: "Sakhir", officialName: "Gulf Air Bahrain Grand Prix", date: "2024-03-02", sessionKey: 9472, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 2, country: "Saudi Arabia", locality: "Jeddah", officialName: "STC Saudi Arabian Grand Prix", date: "2024-03-09", sessionKey: 9480, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 3, country: "Australia", locality: "Melbourne", officialName: "Australian Grand Prix", date: "2024-03-24", sessionKey: 9488, winner: "Carlos Sainz", winnerTeam: "Ferrari" },
  { round: 4, country: "Japan", locality: "Suzuka", officialName: "Meadow Fuji Racing Grand Prix", date: "2024-04-07", sessionKey: 9496, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 5, country: "China", locality: "Shanghai", officialName: "Lenovo Chinese Grand Prix", date: "2024-04-21", sessionKey: 9673, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 6, country: "United States", locality: "Miami", officialName: "Crypto.com Miami Grand Prix", date: "2024-05-05", sessionKey: 9507, winner: "Lando Norris", winnerTeam: "McLaren" },
  { round: 7, country: "Italy", locality: "Imola", officialName: "MSC Cruises Italian Grand Prix", date: "2024-05-19", sessionKey: 9515, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 8, country: "Monaco", locality: "Monaco", officialName: "Grand Prix de Monaco", date: "2024-05-26", sessionKey: 9523, winner: "Charles Leclerc", winnerTeam: "Ferrari" },
  { round: 9, country: "Canada", locality: "Montréal", officialName: "Pirelli Grand Prix de Québec", date: "2024-06-09", sessionKey: 9531, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 10, country: "Spain", locality: "Barcelona", officialName: "Pirelli Gran Premio de España", date: "2024-06-23", sessionKey: 9539, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 11, country: "Austria", locality: "Spielberg", officialName: "BWT Austrian Grand Prix", date: "2024-06-30", sessionKey: 9550, winner: "George Russell", winnerTeam: "Mercedes" },
  { round: 12, country: "United Kingdom", locality: "Silverstone", officialName: "Aramco British Grand Prix", date: "2024-07-07", sessionKey: 9558, winner: "Lewis Hamilton", winnerTeam: "Mercedes" },
  { round: 13, country: "Hungary", locality: "Budapest", officialName: "Rolex Hungarian Grand Prix", date: "2024-07-21", sessionKey: 9566, winner: "Oscar Piastri", winnerTeam: "McLaren" },
  { round: 14, country: "Belgium", locality: "Spa-Francorchamps", officialName: "Belgian Grand Prix", date: "2024-07-28", sessionKey: 9574, winner: "Lewis Hamilton", winnerTeam: "Mercedes" },
  { round: 15, country: "Netherlands", locality: "Zandvoort", officialName: "Heineken Dutch Grand Prix", date: "2024-08-25", sessionKey: 9582, winner: "Lando Norris", winnerTeam: "McLaren" },
  { round: 16, country: "Italy", locality: "Monza", officialName: "Pirelli Gran Premio d'Italia", date: "2024-09-01", sessionKey: 9590, winner: "Charles Leclerc", winnerTeam: "Ferrari" },
  { round: 17, country: "Azerbaijan", locality: "Baku", officialName: "Azerbaijan Grand Prix", date: "2024-09-15", sessionKey: 9598, winner: "Oscar Piastri", winnerTeam: "McLaren" },
  { round: 18, country: "Singapore", locality: "Marina Bay", officialName: "Singapore Grand Prix", date: "2024-09-22", sessionKey: 9606, winner: "Lando Norris", winnerTeam: "McLaren" },
  { round: 19, country: "United States", locality: "Austin", officialName: "Coinbase United States Grand Prix", date: "2024-10-20", sessionKey: 9617, winner: "Charles Leclerc", winnerTeam: "Ferrari" },
  { round: 20, country: "Mexico", locality: "Mexico City", officialName: "Gran Premio de la Ciudad de México", date: "2024-10-27", sessionKey: 9625, winner: "Lando Norris", winnerTeam: "McLaren" },
  { round: 21, country: "Brazil", locality: "São Paulo", officialName: "Lenovo Grande Prêmio de São Paulo", date: "2024-11-03", sessionKey: 9636, winner: "Max Verstappen", winnerTeam: "Red Bull Racing" },
  { round: 22, country: "United States", locality: "Las Vegas", officialName: "Las Vegas Grand Prix", date: "2024-11-24", sessionKey: 9644, winner: "George Russell", winnerTeam: "Mercedes" },
  { round: 23, country: "Qatar", locality: "Lusail", officialName: "Qatar Airways Qatar Grand Prix", date: "2024-12-01", sessionKey: 9655, winner: "Oscar Piastri", winnerTeam: "McLaren" },
  { round: 24, country: "Abu Dhabi", locality: "Yas Island", officialName: "Etihad Airways Abu Dhabi Grand Prix", date: "2024-12-08", sessionKey: 9662, winner: "Lando Norris", winnerTeam: "McLaren" },
];

const countries = [...new Set(allRaces.map(r => r.country))];

export function RaceCalendar() {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showPastRaces, setShowPastRaces] = useState(true);

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

  const filteredRaces = allRaces.filter(race => {
    const matchesSearch = search === "" || 
      race.officialName.toLowerCase().includes(search.toLowerCase()) ||
      race.country.toLowerCase().includes(search.toLowerCase()) ||
      race.locality.toLowerCase().includes(search.toLowerCase());
    
    const matchesCountry = !selectedCountry || race.country === selectedCountry;
    const matchesPast = !showPastRaces || isRacePast(race.date);
    
    return matchesSearch && matchesCountry && matchesPast;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Race Calendar</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search races..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
          />
        </div>

        {/* Country filter */}
        <select
          value={selectedCountry || ""}
          onChange={(e) => setSelectedCountry(e.target.value || null)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        {/* Past races toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showPastRaces}
            onChange={(e) => setShowPastRaces(e.target.checked)}
            className="rounded"
          />
          Show past races
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold">{allRaces.length}</div>
          <div className="text-xs text-muted-foreground">Total Races</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-green-500">
            {allRaces.filter(r => isRacePast(r.date)).length}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-yellow-500">
            {allRaces.filter(r => !isRacePast(r.date)).length}
          </div>
          <div className="text-xs text-muted-foreground">Upcoming</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-blue-500">24</div>
          <div className="text-xs text-muted-foreground">Circuits</div>
        </div>
      </div>

      {/* Race list */}
      <div className="grid gap-3">
        {filteredRaces.map((race) => {
          const past = isRacePast(race.date);
          return (
            <div
              key={race.sessionKey}
              className={`flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow ${
                !past ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              {/* Round number */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                {race.round}
              </div>

              {/* Race info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{race.officialName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {race.locality}, {race.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(race.date)}
                  </span>
                </div>
                {past && race.winner && (
                  <p className="text-sm mt-1">
                    <span className="text-green-500 font-medium">Winner:</span> {race.winner} ({race.winnerTeam})
                  </p>
                )}
              </div>

              {/* Flag and status */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-3xl">{getCountryFlag(race.country)}</span>
                {past ? (
                  <span className="text-xs text-green-500">✓ Completed</span>
                ) : (
                  <span className="text-xs text-blue-500">Upcoming</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRaces.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No races found matching your filters.
        </div>
      )}
    </div>
  );
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    Bahrain: "🇧🇭",
    "Saudi Arabia": "🇸🇦",
    Australia: "🇦🇺",
    Japan: "🇯🇵",
    China: "🇨🇳",
    "United States": "🇺🇸",
    Italy: "🇮🇹",
    Monaco: "🇲🇨",
    Canada: "🇨🇦",
    Spain: "🇪🇸",
    Austria: "🇦🇹",
    "United Kingdom": "🇬🇧",
    Hungary: "🇭🇺",
    Belgium: "🇧🇪",
    Netherlands: "🇳🇱",
    Azerbaijan: "🇦🇿",
    Singapore: "🇸🇬",
    Mexico: "🇲🇽",
    Brazil: "🇧🇷",
    "Las Vegas": "🇺🇸",
    Qatar: "🇶🇦",
    "Abu Dhabi": "🇦🇪",
  };
  return flags[country] || "🏁";
}
