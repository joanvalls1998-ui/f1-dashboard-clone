"use client";

import Image from "next/image";
import { useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";

const mockDrivers2024 = [
  { position: 1, number: 1, name: "Max Verstappen", team: "Red Bull Racing", teamColor: "3671c6", points: 437, wins: 19, podiums: 21, fastestLaps: 4, country: "NED", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png" },
  { position: 2, number: 4, name: "Lando Norris", team: "McLaren", teamColor: "ff8000", points: 374, wins: 4, podiums: 15, fastestLaps: 2, country: "GBR", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png" },
  { position: 3, number: 16, name: "Charles Leclerc", team: "Ferrari", teamColor: "e8002d", points: 356, wins: 3, podiums: 13, fastestLaps: 3, country: "MON", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png" },
  { position: 4, number: 55, name: "Carlos Sainz", team: "Ferrari", teamColor: "e8002d", points: 290, wins: 2, podiums: 9, fastestLaps: 1, country: "ESP", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png" },
  { position: 5, number: 81, name: "Oscar Piastri", team: "McLaren", teamColor: "ff8000", points: 272, wins: 2, podiums: 8, fastestLaps: 1, country: "AUS", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png" },
  { position: 6, number: 11, name: "Sergio Perez", team: "Red Bull Racing", teamColor: "3671c6", points: 234, wins: 1, podiums: 10, fastestLaps: 1, country: "MEX", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png" },
  { position: 7, number: 14, name: "Fernando Alonso", team: "Aston Martin", teamColor: "229971", points: 181, wins: 0, podiums: 7, fastestLaps: 0, country: "ESP", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png" },
  { position: 8, number: 44, name: "Lewis Hamilton", team: "Mercedes", teamColor: "27f4d2", points: 117, wins: 0, podiums: 4, fastestLaps: 0, country: "GBR", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png" },
  { position: 9, number: 63, name: "George Russell", team: "Mercedes", teamColor: "27f4d2", points: 115, wins: 2, podiums: 5, fastestLaps: 3, country: "GBR", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png" },
  { position: 10, number: 31, name: "Esteban Ocon", team: "Alpine", teamColor: "ff87bc", points: 62, wins: 0, podiums: 1, fastestLaps: 0, country: "FRA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png" },
  { position: 11, number: 10, name: "Pierre Gasly", team: "Alpine", teamColor: "ff87bc", points: 49, wins: 0, podiums: 1, fastestLaps: 0, country: "FRA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png" },
  { position: 12, number: 18, name: "Lance Stroll", team: "Aston Martin", teamColor: "229971", points: 41, wins: 0, podiums: 1, fastestLaps: 0, country: "CAN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png" },
  { position: 13, number: 22, name: "Yuki Tsunoda", team: "RB", teamColor: "6692ff", points: 30, wins: 0, podiums: 0, fastestLaps: 0, country: "JPN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png" },
  { position: 14, number: 3, name: "Daniel Ricciardo", team: "RB", teamColor: "6692ff", points: 12, wins: 0, podiums: 0, fastestLaps: 0, country: "AUS", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png.transform/1col/image.png" },
  { position: 15, number: 87, name: "Nico Hulkenberg", team: "Haas F1 Team", teamColor: "b6babd", points: 8, wins: 0, podiums: 0, fastestLaps: 0, country: "GER", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png" },
  { position: 16, number: 27, name: "Nico Hulkenberg", team: "Haas F1 Team", teamColor: "b6babd", points: 41, wins: 0, podiums: 1, fastestLaps: 0, country: "GER", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png" },
  { position: 17, number: 24, name: "Zhou Guanyu", team: "Kick Sauber", teamColor: "52e252", points: 4, wins: 0, podiums: 0, fastestLaps: 0, country: "CHN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png.transform/1col/image.png" },
  { position: 18, number: 77, name: "Valtteri Bottas", team: "Kick Sauber", teamColor: "52e252", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "FIN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png" },
  { position: 19, number: 20, name: "Kevin Magnussen", team: "Haas F1 Team", teamColor: "b6babd", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "DEN", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png.transform/1col/image.png" },
  { position: 20, number: 2, name: "Logan Sargeant", team: "Williams", teamColor: "64c4ff", points: 0, wins: 0, podiums: 0, fastestLaps: 0, country: "USA", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png.transform/1col/image.png" },
];

type SortKey = 'position' | 'points' | 'wins' | 'podiums' | 'fastestLaps';

export function DriverStandings() {
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedDrivers = [...mockDrivers2024].sort((a, b) => {
    return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">2024 Driver Standings</h2>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-yellow-500">19</div>
          <div className="text-xs text-muted-foreground">Race Wins</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-green-500">4</div>
          <div className="text-xs text-muted-foreground">Teams</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-blue-500">15</div>
          <div className="text-xs text-muted-foreground">Fastest Laps</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold text-purple-500">671</div>
          <div className="text-xs text-muted-foreground">Total Points</div>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        {[
          { key: 'position' as SortKey, label: 'Position' },
          { key: 'points' as SortKey, label: 'Points' },
          { key: 'wins' as SortKey, label: 'Wins' },
          { key: 'podiums' as SortKey, label: 'Podiums' },
          { key: 'fastestLaps' as SortKey, label: 'Fastest Laps' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-2 py-1 rounded ${
              sortKey === key 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {label} {sortKey === key && (sortAsc ? '↑' : '↓')}
          </button>
        ))}
      </div>

      {/* Driver list */}
      <div className="grid gap-3">
        {sortedDrivers.map((driver) => (
          <div
            key={driver.number}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            {/* Position */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0 ${
                driver.position === 1
                  ? 'bg-yellow-500 text-black'
                  : driver.position === 2
                  ? 'bg-gray-400 text-black'
                  : driver.position === 3
                  ? 'bg-amber-600 text-white'
                  : 'bg-muted'
              }`}
            >
              {driver.position}
            </div>

            {/* Driver headshot */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
              <Image
                src={driver.headshot}
                alt={driver.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Driver info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{driver.name}</h3>
                <span className="text-xs text-muted-foreground">#{driver.number}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{driver.team}</p>
            </div>

            {/* Team color bar */}
            <div
              className="w-1 h-10 rounded-full shrink-0"
              style={{ backgroundColor: `#${driver.teamColor}` }}
            />

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm shrink-0">
              <div className="text-center">
                <div className="font-bold">{driver.points}</div>
                <div className="text-xs text-muted-foreground">PTS</div>
              </div>
              {driver.wins > 0 && (
                <div className="text-center text-green-500">
                  <TrendingUp className="w-4 h-4 mx-auto" />
                  <div className="text-xs font-bold">{driver.wins}</div>
                </div>
              )}
              <div className="text-center hidden md:block">
                <div className="text-muted-foreground">{driver.podiums}</div>
                <div className="text-xs text-muted-foreground">Pod</div>
              </div>
              {driver.fastestLaps > 0 && (
                <div className="text-center text-yellow-500 hidden md:block">
                  <div className="text-xs">⚡</div>
                  <div className="text-xs font-bold">{driver.fastestLaps}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
