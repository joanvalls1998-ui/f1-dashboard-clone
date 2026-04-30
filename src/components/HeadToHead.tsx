"use client";

import { useState } from "react";
import Image from "next/image";
import { Swords } from "lucide-react";

interface Driver {
  code: string;
  name: string;
  team: string;
  teamColor: string;
  headshot: string;
}

const drivers: Driver[] = [
  { code: "VER", name: "Max Verstappen", team: "Red Bull Racing", teamColor: "3671c6", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png" },
  { code: "NOR", name: "Lando Norris", team: "McLaren", teamColor: "ff8000", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png" },
  { code: "LEC", name: "Charles Leclerc", team: "Ferrari", teamColor: "e8002d", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png" },
  { code: "SAI", name: "Carlos Sainz", team: "Ferrari", teamColor: "e8002d", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png" },
  { code: "PIA", name: "Oscar Piastri", team: "McLaren", teamColor: "ff8000", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png" },
  { code: "PER", name: "Sergio Perez", team: "Red Bull Racing", teamColor: "3671c6", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png" },
  { code: "HAM", name: "Lewis Hamilton", team: "Mercedes", teamColor: "27f4d2", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png" },
  { code: "RUS", name: "George Russell", team: "Mercedes", teamColor: "27f4d2", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png" },
];

const comparisonData: Record<string, { wins: number; races: number }> = {
  "VER-NOR": { wins: 8, races: 24 },
  "VER-LEC": { wins: 12, races: 24 },
  "NOR-PIA": { wins: 12, races: 24 },
  "HAM-RUS": { wins: 9, races: 24 },
  "LEC-SAI": { wins: 13, races: 24 },
};

export function HeadToHead() {
  const [driver1Code, setDriver1Code] = useState("VER");
  const [driver2Code, setDriver2Code] = useState("NOR");

  const driver1 = drivers.find(d => d.code === driver1Code)!;
  const driver2 = drivers.find(d => d.code === driver2Code)!;

  const comparisonKey = [driver1Code, driver2Code].sort().join("-");
  const data = comparisonData[comparisonKey] || { wins: 0, races: 0 };

  const driver1Wins = driver1Code < driver2Code ? data.wins : data.races - data.wins;
  const driver2Wins = driver2Code > driver1Code ? data.races - data.wins : data.wins;

  const winPercentage1 = data.races > 0 ? (driver1Wins / data.races) * 100 : 50;
  const winPercentage2 = 100 - winPercentage1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Swords className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">Head to Head</h2>
      </div>

      {/* Driver selection */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <select
          value={driver1Code}
          onChange={(e) => setDriver1Code(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background text-sm max-w-[200px]"
        >
          {drivers.map(d => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>

        <span className="text-muted-foreground font-bold">VS</span>

        <select
          value={driver2Code}
          onChange={(e) => setDriver2Code(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background text-sm max-w-[200px]"
        >
          {drivers.map(d => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Comparison */}
      <div className="rounded-lg border bg-card p-6">
        {/* Driver 1 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image src={driver1.headshot} alt={driver1.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{driver1.name}</h3>
            <p className="text-sm text-muted-foreground">{driver1.team}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{driver1Wins}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-8 rounded-full overflow-hidden bg-muted mb-4">
          <div
            className="absolute left-0 top-0 h-full transition-all duration-500"
            style={{
              width: `${winPercentage1}%`,
              backgroundColor: `#${driver1.teamColor}`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {data.races > 0 ? `${data.races} races` : 'No data'}
          </div>
        </div>

        {/* Driver 2 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 text-right">
            <div className="text-2xl font-bold">{driver2Wins}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </div>
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image src={driver2.headshot} alt={driver2.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{driver2.name}</h3>
            <p className="text-sm text-muted-foreground">{driver2.team}</p>
          </div>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: `#${driver1.teamColor}` }}>
            {winPercentage1.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">{driver1.name} win rate</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: `#${driver2.teamColor}` }}>
            {winPercentage2.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">{driver2.name} win rate</div>
        </div>
      </div>
    </div>
  );
}
