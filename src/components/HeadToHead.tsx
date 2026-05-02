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
  { code: "NOR", name: "Lando Norris", team: "McLaren", teamColor: "ff8700", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png" },
  { code: "LEC", name: "Charles Leclerc", team: "Ferrari", teamColor: "ff1800", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png" },
  { code: "HAM", name: "Lewis Hamilton", team: "Ferrari", teamColor: "ff1800", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png" },
  { code: "PIA", name: "Oscar Piastri", team: "McLaren", teamColor: "ff8700", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png" },
  { code: "RUS", name: "George Russell", team: "Mercedes", teamColor: "27f4d2", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png" },
  { code: "ANT", name: "Kimi Antonelli", team: "Mercedes", teamColor: "27f4d2", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png.transform/1col/image.png" },
  { code: "HAD", name: "Isack Hadjar", team: "Red Bull Racing", teamColor: "3671c6", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png" },
  { code: "ALO", name: "Fernando Alonso", team: "Aston Martin", teamColor: "0072ff", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png" },
  { code: "STR", name: "Lance Stroll", team: "Aston Martin", teamColor: "0072ff", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png" },
  { code: "GAS", name: "Pierre Gasly", team: "Alpine", teamColor: "ff87bc", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png" },
  { code: "OCO", name: "Esteban Ocon", team: "Haas F1 Team", teamColor: "b6babd", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png" },
  { code: "BEA", name: "Oliver Bearman", team: "Haas F1 Team", teamColor: "b6babd", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLVBEA01_Oliver_Bearman/olvbea01.png.transform/1col/image.png" },
  { code: "SAI", name: "Carlos Sainz", team: "Williams", teamColor: "64c4ff", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png" },
  { code: "ALB", name: "Alexander Albon", team: "Williams", teamColor: "64c4ff", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png" },
  { code: "PER", name: "Sergio Perez", team: "Cadillac", teamColor: "c80029", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png" },
  { code: "BOT", name: "Valtteri Bottas", team: "Cadillac", teamColor: "c80029", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png" },
  { code: "HUL", name: "Nico Hulkenberg", team: "Audi", teamColor: "c80029", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png" },
  { code: "BOR", name: "Gabriel Bortoleto", team: "Audi", teamColor: "c80029", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png" },
  { code: "LAW", name: "Liam Lawson", team: "RB F1 Team", teamColor: "203f94", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIAMLAW01_Liam_Lawson/liamlaw01.png.transform/1col/image.png" },
  { code: "LIN", name: "Arvid Lindblad", team: "RB F1 Team", teamColor: "203f94", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ARVLIN01_Arvid_Lindblad/arvlin01.png.transform/1col/image.png" },
  { code: "COL", name: "Franco Colapinto", team: "Alpine", teamColor: "ff87bc", headshot: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/1col/image.png" },
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

  const driver1 = drivers.find(d => d.code === driver1Code);
  const driver2 = drivers.find(d => d.code === driver2Code);

  if (!driver1 || !driver2) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Driver data not available
      </div>
    );
  }

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
