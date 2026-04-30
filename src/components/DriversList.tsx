"use client";

import Image from "next/image";
import { useState } from "react";
import { User, Search, Filter } from "lucide-react";

interface Driver {
  number: number;
  code: string;
  name: string;
  team: string;
  teamColor: string;
  country: string;
  countryCode: string;
  headshot: string;
  podiums: number;
  wins: number;
  championships: number;
  points: number;
}

const drivers: Driver[] = [
  { number: 1, code: "VER", name: "Max Verstappen", team: "Red Bull Racing", teamColor: "3671c6", country: "Netherlands", countryCode: "NED", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png", podiums: 103, wins: 62, championships: 3, points: 2286 },
  { number: 16, code: "LEC", name: "Charles Leclerc", team: "Ferrari", teamColor: "e8002d", country: "Monaco", countryCode: "MON", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png", podiums: 38, wins: 6, championships: 0, points: 834 },
  { number: 4, code: "NOR", name: "Lando Norris", team: "McLaren", teamColor: "ff8000", country: "United Kingdom", countryCode: "GBR", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png", podiums: 23, wins: 4, championships: 0, points: 649 },
  { number: 55, code: "SAI", name: "Carlos Sainz", team: "Ferrari", teamColor: "e8002d", country: "Spain", countryCode: "ESP", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png", podiums: 22, wins: 3, championships: 0, points: 840 },
  { number: 81, code: "PIA", name: "Oscar Piastri", team: "McLaren", teamColor: "ff8000", country: "Australia", countryCode: "AUS", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png", podiums: 8, wins: 2, championships: 0, points: 272 },
  { number: 11, code: "PER", name: "Sergio Perez", team: "Red Bull Racing", teamColor: "3671c6", country: "Mexico", countryCode: "MEX", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png", podiums: 40, wins: 6, championships: 0, points: 1036 },
  { number: 14, code: "ALO", name: "Fernando Alonso", team: "Aston Martin", teamColor: "229971", country: "Spain", countryCode: "ESP", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png", podiums: 106, wins: 32, championships: 2, points: 2084 },
  { number: 44, code: "HAM", name: "Lewis Hamilton", team: "Mercedes", teamColor: "27f4d2", country: "United Kingdom", countryCode: "GBR", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png", podiums: 197, wins: 105, championships: 7, points: 3593 },
  { number: 63, code: "RUS", name: "George Russell", team: "Mercedes", teamColor: "27f4d2", country: "United Kingdom", countryCode: "GBR", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png", podiums: 13, wins: 2, championships: 0, points: 329 },
  { number: 31, code: "OCO", name: "Esteban Ocon", team: "Alpine", teamColor: "ff87bc", country: "France", countryCode: "FRA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png", podiums: 4, wins: 1, championships: 0, points: 173 },
  { number: 10, code: "GAS", name: "Pierre Gasly", team: "Alpine", teamColor: "ff87bc", country: "France", countryCode: "FRA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png", podiums: 4, wins: 1, championships: 0, points: 256 },
  { number: 18, code: "STR", name: "Lance Stroll", team: "Aston Martin", teamColor: "229971", country: "Canada", countryCode: "CAN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png", podiums: 3, wins: 0, championships: 0, points: 74 },
  { number: 22, code: "TSU", name: "Yuki Tsunoda", team: "RB", teamColor: "6692ff", country: "Japan", countryCode: "JPN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png", podiums: 0, wins: 0, championships: 0, points: 60 },
  { number: 3, code: "RIC", name: "Daniel Ricciardo", team: "RB", teamColor: "6692ff", country: "Australia", countryCode: "AUS", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png.transform/1col/image.png", podiums: 8, wins: 1, championships: 0, points: 229 },
  { number: 27, code: "HUL", name: "Nico Hulkenberg", team: "Haas F1 Team", teamColor: "b6babd", country: "Germany", countryCode: "GER", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png", podiums: 0, wins: 0, championships: 0, points: 47 },
  { number: 24, code: "ZHO", name: "Zhou Guanyu", team: "Kick Sauber", teamColor: "52e252", country: "China", countryCode: "CHN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png.transform/1col/image.png", podiums: 0, wins: 0, championships: 0, points: 12 },
  { number: 77, code: "BOT", name: "Valtteri Bottas", team: "Kick Sauber", teamColor: "52e252", country: "Finland", countryCode: "FIN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png", podiums: 20, wins: 0, championships: 0, points: 104 },
  { number: 20, code: "MAG", name: "Kevin Magnussen", team: "Haas F1 Team", teamColor: "b6babd", country: "Denmark", countryCode: "DEN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png.transform/1col/image.png", podiums: 1, wins: 0, championships: 0, points: 78 },
  { number: 2, code: "SAR", name: "Logan Sargeant", team: "Williams", teamColor: "64c4ff", country: "United States", countryCode: "USA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png.transform/1col/image.png", podiums: 0, wins: 0, championships: 0, points: 1 },
  { number: 23, code: "ALB", name: "Alex Albon", team: "Williams", teamColor: "64c4ff", country: "Thailand", countryCode: "THA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png", podiums: 2, wins: 0, championships: 0, points: 76 },
];

const teams = Array.from(new Set(drivers.map(d => d.team)));

export function DriversList() {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"points" | "wins" | "name">("points");

  const filteredDrivers = drivers
    .filter(driver => {
      const matchesSearch = search === "" || 
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.code.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = !selectedTeam || driver.team === selectedTeam;
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "wins") return b.wins - a.wins;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">All Drivers</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
          />
        </div>

        <select
          value={selectedTeam || ""}
          onChange={(e) => setSelectedTeam(e.target.value || null)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="points">Sort by Points</option>
          <option value="wins">Sort by Wins</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Driver grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.code}
            className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Driver number badge */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                style={{ backgroundColor: `#${driver.teamColor}` }}
              >
                {driver.number}
              </div>

              {/* Driver image */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                <Image
                  src={driver.headshot}
                  alt={driver.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Driver info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{driver.name}</h3>
                <p className="text-sm text-muted-foreground">{driver.code}</p>
                <p className="text-xs text-muted-foreground">{driver.team}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="font-bold text-lg">{driver.points}</div>
                <div className="text-xs text-muted-foreground">PTS</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-yellow-500">{driver.wins}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-500">{driver.podiums}</div>
                <div className="text-xs text-muted-foreground">Pod</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-500">{driver.championships}</div>
                <div className="text-xs text-muted-foreground">Titles</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No drivers found matching your filters.
        </div>
      )}
    </div>
  );
}
