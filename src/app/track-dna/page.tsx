"use client";

import { useEffect, useState } from "react";
import { Dna, MapPin, Flag, Route, Gauge, TrendingUp, AlertTriangle, Timer, Award } from "lucide-react";
import { circuitImages, teamColors, getTeamColor } from "@/lib/f1-assets";

interface CircuitData {
  round: number;
  name: string;
  country: string;
  city: string;
  date: string;
  circuit: string;
  circuitId: string;
  status: "completed" | "upcoming" | "cancelled";
  lat: number;
  long: number;
  locality: string;
  countryCode: string;
}

interface TrackDNA {
  circuitId: string;
  name: string;
  country: string;
  corners: number;
  length: number; // km
  drsZones: number;
  topSpeed: number; // km/h
  brakingZones: number;
  elevationChange: number; // meters
  hardestCorner: string;
  longestStraight: number; // meters
  notableHistory: string;
  asphaltType: string;
  firstGP: number;
}

const TRACK_DNA_DATA: Record<string, TrackDNA> = {
  "albert_park": {
    circuitId: "albert_park",
    name: "Albert Park",
    country: "Australia",
    corners: 14,
    length: 5.278,
    drsZones: 2,
    topSpeed: 320,
    brakingZones: 4,
    elevationChange: 14,
    hardestCorner: "Turn 11 (long right-hander)",
    longestStraight: 850,
    notableHistory: "First night race in F1 history. Hosted first Australian GP in 1985.",
    asphaltType: "Smooth asphalt with good grip",
    firstGP: 1996,
  },
  "shanghai": {
    circuitId: "shanghai",
    name: "Shanghai International Circuit",
    country: "China",
    corners: 16,
    length: 5.451,
    drsZones: 2,
    topSpeed: 327,
    brakingZones: 8,
    elevationChange: 7,
    hardestCorner: "Turn 1 (heavy braking from high speed)",
    longestStraight: 1175,
    notableHistory: "Features the longest straight in F1. Known for tire degradation.",
    asphaltType: "Medium roughness, high degradation",
    firstGP: 2004,
  },
  "suzuka": {
    circuitId: "suzuka",
    name: "Suzuka Circuit",
    country: "Japan",
    corners: 18,
    length: 5.807,
    drsZones: 1,
    topSpeed: 310,
    brakingZones: 9,
    elevationChange: 40,
    hardestCorner: "130R (high-speed sweeping corner)",
    longestStraight: 650,
    notableHistory: "Honda's home circuit. S-curve section is unique in F1.",
    asphaltType: "Smooth, high grip levels",
    firstGP: 1987,
  },
  "bahrain": {
    circuitId: "bahrain",
    name: "Bahrain International Circuit",
    country: "Bahrain",
    corners: 15,
    length: 5.412,
    drsZones: 2,
    topSpeed: 330,
    brakingZones: 6,
    elevationChange: 30,
    hardestCorner: "Turn 10 (long right-hander)",
    longestStraight: 1090,
    notableHistory: "First F1 night race in Middle East. Inaugural race was controversial.",
    asphaltType: "Smooth with low abrasion",
    firstGP: 2004,
  },
  "jeddah": {
    circuitId: "jeddah",
    name: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",
    corners: 27,
    length: 6.174,
    drsZones: 2,
    topSpeed: 322,
    brakingZones: 10,
    elevationChange: 0,
    hardestCorner: "Turn 13 (high-speed corner complex)",
    longestStraight: 2100,
    notableHistory: "Second fastest street circuit. Added in 2021.",
    asphaltType: "Smooth street circuit",
    firstGP: 2021,
  },
  "miami": {
    circuitId: "miami",
    name: "Miami International Autodrome",
    country: "Miami",
    corners: 19,
    length: 5.412,
    drsZones: 3,
    topSpeed: 320,
    brakingZones: 7,
    elevationChange: 8,
    hardestCorner: "Turn 17 (tight hairpin)",
    longestStraight: 1040,
    notableHistory: "New street circuit in Hard Rock Stadium. First US night race.",
    asphaltType: "Street circuit with good grip",
    firstGP: 2022,
  },
  "monaco": {
    circuitId: "monaco",
    name: "Circuit de Monaco",
    country: "Monaco",
    corners: 19,
    length: 3.337,
    drsZones: 1,
    topSpeed: 280,
    brakingZones: 6,
    elevationChange: 85,
    hardestCorner: "Casino Square (slow hairpin)",
    longestStraight: 350,
    notableHistory: "The crown jewel of F1. Prestige outweighs overtaking opportunities.",
    asphaltType: "Smooth but low grip due to street use",
    firstGP: 1929,
  },
  "catalunya": {
    circuitId: "catalunya",
    name: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    corners: 16,
    length: 4.675,
    drsZones: 2,
    topSpeed: 310,
    brakingZones: 7,
    elevationChange: 33,
    hardestCorner: "Turn 5 (fast right-hander)",
    longestStraight: 1047,
    notableHistory: "Home of F1 pre-season testing for decades.",
    asphaltType: "Medium roughness, high tire wear",
    firstGP: 1991,
  },
  "villeneuve": {
    circuitId: "villeneuve",
    name: "Circuit Gilles Villeneuve",
    country: "Canada",
    corners: 14,
    length: 4.361,
    drsZones: 2,
    topSpeed: 315,
    brakingZones: 5,
    elevationChange: 0,
    hardestCorner: "Turn 10 (the Wall of Champions)",
    longestStraight: 800,
    notableHistory: "Wall of Champions. Famous for controversial incidents.",
    asphaltType: "Rough with good grip",
    firstGP: 1978,
  },
  "red_bull_ring": {
    circuitId: "red_bull_ring",
    name: "Red Bull Ring",
    country: "Austria",
    corners: 10,
    length: 4.318,
    drsZones: 2,
    topSpeed: 365,
    brakingZones: 3,
    elevationChange: 65,
    hardestCorner: "Turn 3 (急右ターン)",
    longestStraight: 1200,
    notableHistory: "Formerly A1-Ring. Home of Red Bull.",
    asphaltType: "Smooth, medium grip",
    firstGP: 1970,
  },
  "silverstone": {
    circuitId: "silverstone",
    name: "Silverstone Circuit",
    country: "Britain",
    corners: 18,
    length: 5.891,
    drsZones: 2,
    topSpeed: 340,
    brakingZones: 9,
    elevationChange: 45,
    hardestCorner: "Copse (high-speed corner)",
    longestStraight: 770,
    notableHistory: "Home of British F1. Birthplace of modern F1 in 1950.",
    asphaltType: "Smooth with high grip",
    firstGP: 1950,
  },
  "spa": {
    circuitId: "spa",
    name: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    corners: 19,
    length: 7.004,
    drsZones: 1,
    topSpeed: 345,
    brakingZones: 6,
    elevationChange: 100,
    hardestCorner: "Eau Rouge-Raidillon (iconic compression)",
    longestStraight: 1100,
    notableHistory: "Longest circuit on the calendar. Weather is unpredictable.",
    asphaltType: "Smooth with high speed corners",
    firstGP: 1950,
  },
  "zandvoort": {
    circuitId: "zandvoort",
    name: "Circuit Zandvoort",
    country: "Netherlands",
    corners: 14,
    length: 4.259,
    drsZones: 1,
    topSpeed: 320,
    brakingZones: 5,
    elevationChange: 35,
    hardestCorner: "Turn 3 (banked corner)",
    longestStraight: 650,
    notableHistory: "Return in 2021 with banked corners. Dutch home GP.",
    asphaltType: "Smooth with high grip",
    firstGP: 1952,
  },
  "monza": {
    circuitId: "monza",
    name: "Autodromo Nazionale di Monza",
    country: "Italy",
    corners: 11,
    length: 5.793,
    drsZones: 2,
    topSpeed: 370,
    brakingZones: 4,
    elevationChange: 15,
    hardestCorner: "Turn 1 (Variante Alta)",
    longestStraight: 1920,
    notableHistory: "Temple of Speed. Most historic F1 circuit.",
    asphaltType: "Smooth, low downforce advantage",
    firstGP: 1950,
  },
  "baku": {
    circuitId: "baku",
    name: "Baku City Circuit",
    country: "Azerbaijan",
    corners: 20,
    length: 6.003,
    drsZones: 2,
    topSpeed: 340,
    brakingZones: 8,
    elevationChange: 0,
    hardestCorner: "Turn 15-16 (tight complex)",
    longestStraight: 2200,
    notableHistory: "Longest straight in F1. Narrow old city section.",
    asphaltType: "Smooth street circuit",
    firstGP: 2016,
  },
  "marina_bay": {
    circuitId: "marina_bay",
    name: "Marina Bay Street Circuit",
    country: "Singapore",
    corners: 19,
    length: 4.94,
    drsZones: 2,
    topSpeed: 310,
    brakingZones: 10,
    elevationChange: 0,
    hardestCorner: "Turn 17 (technical chicane)",
    longestStraight: 780,
    notableHistory: "First F1 night race. Extremely hot and humid.",
    asphaltType: "Smooth street circuit",
    firstGP: 2008,
  },
  "americas": {
    circuitId: "americas",
    name: "Circuit of the Americas",
    country: "United States",
    corners: 20,
    length: 5.513,
    drsZones: 2,
    topSpeed: 330,
    brakingZones: 11,
    elevationChange: 40,
    hardestCorner: "Turn 1 (_elevation corner)",
    longestStraight: 1000,
    notableHistory: "Purpose-built for F1. 1st US GP in 2012.",
    asphaltType: "Smooth with good grip",
    firstGP: 2012,
  },
  "rodriguez": {
    circuitId: "rodriguez",
    name: "Autódromo Hermanos Rodríguez",
    country: "Mexico",
    corners: 17,
    length: 4.304,
    drsZones: 2,
    topSpeed: 340,
    brakingZones: 6,
    elevationChange: 45,
    hardestCorner: "Periférico (high-speed oval section)",
    longestStraight: 1200,
    notableHistory: "Home of Mexican F1. Stadium section is unique.",
    asphaltType: "Medium roughness",
    firstGP: 1963,
  },
  "interlagos": {
    circuitId: "interlagos",
    name: "Autódromo José Carlos Pace",
    country: "Brazil",
    corners: 15,
    length: 4.309,
    drsZones: 2,
    topSpeed: 325,
    brakingZones: 7,
    elevationChange: 55,
    hardestCorner: "Curva do Lago (tight downhill)",
    longestStraight: 860,
    notableHistory: "Interlagos. Legendary championship deciders.",
    asphaltType: "Rough with low grip",
    firstGP: 1972,
  },
  "vegas": {
    circuitId: "vegas",
    name: "Las Vegas Street Circuit",
    country: "Las Vegas",
    corners: 17,
    length: 6.12,
    drsZones: 3,
    topSpeed: 335,
    brakingZones: 8,
    elevationChange: 0,
    hardestCorner: "Turn 14 (tight right-hander)",
    longestStraight: 1900,
    notableHistory: "New addition in 2023. F1's return to Vegas.",
    asphaltType: "Smooth street circuit",
    firstGP: 2023,
  },
  "lusail": {
    circuitId: "lusail",
    name: "Lusail International Circuit",
    country: "Qatar",
    corners: 16,
    length: 5.38,
    drsZones: 2,
    topSpeed: 325,
    brakingZones: 5,
    elevationChange: 0,
    hardestCorner: "Turn 12 (long right-hander)",
    longestStraight: 1060,
    notableHistory: "Night race in the desert. Joined in 2021.",
    asphaltType: "Smooth with medium grip",
    firstGP: 2021,
  },
  "yas_marina": {
    circuitId: "yas_marina",
    name: "Yas Marina Circuit",
    country: "Abu Dhabi",
    corners: 16,
    length: 5.281,
    drsZones: 2,
    topSpeed: 320,
    brakingZones: 6,
    elevationChange: 0,
    hardestCorner: "Turn 8 (tight hairpin)",
    longestStraight: 1200,
    notableHistory: "Twilight race. Season finale venue.",
    asphaltType: "Smooth with good grip",
    firstGP: 2009,
  },
};

// Map circuit names to circuit IDs
function getCircuitId(circuitName: string, country: string): string {
  const nameLower = circuitName.toLowerCase();
  const countryLower = country.toLowerCase();

  if (nameLower.includes("albert") || countryLower.includes("australia")) return "albert_park";
  if (nameLower.includes("shanghai") || countryLower.includes("china")) return "shanghai";
  if (nameLower.includes("suzuka") || countryLower.includes("japan")) return "suzuka";
  if (nameLower.includes("bahrain") || countryLower.includes("bahrain")) return "bahrain";
  if (nameLower.includes("jeddah") || countryLower.includes("saudi")) return "jeddah";
  if (nameLower.includes("miami") || countryLower.includes("miami")) return "miami";
  if (nameLower.includes("monaco") || countryLower.includes("monaco")) return "monaco";
  if (nameLower.includes("catalunya") || countryLower.includes("spain")) return "catalunya";
  if (nameLower.includes("villeneuve") || countryLower.includes("canada")) return "villeneuve";
  if (nameLower.includes("red bull ring") || countryLower.includes("austria")) return "red_bull_ring";
  if (nameLower.includes("silverstone") || countryLower.includes("britain")) return "silverstone";
  if (nameLower.includes("spa") || countryLower.includes("belgium")) return "spa";
  if (nameLower.includes("zandvoort") || countryLower.includes("netherlands")) return "zandvoort";
  if (nameLower.includes("monza") || countryLower.includes("italy")) return "monza";
  if (nameLower.includes("baku") || countryLower.includes("azerbaijan")) return "baku";
  if (nameLower.includes("marina bay") || countryLower.includes("singapore")) return "marina_bay";
  if (nameLower.includes("americas") || countryLower.includes("united states")) return "americas";
  if (nameLower.includes("rodriguez") || countryLower.includes("mexico")) return "rodriguez";
  if (nameLower.includes("interlagos") || countryLower.includes("brazil")) return "interlagos";
  if (nameLower.includes("vegas") || countryLower.includes("las vegas")) return "vegas";
  if (nameLower.includes("lusail") || countryLower.includes("qatar")) return "lusail";
  if (nameLower.includes("yas marina") || countryLower.includes("abu dhabi")) return "yas_marina";

  return "unknown";
}

export default function TrackDnaPage() {
  const [circuits, setCircuits] = useState<CircuitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  useEffect(() => {
    async function loadCircuits() {
      try {
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026.json", {
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;

        const circuitData: CircuitData[] = races.map((race: any) => ({
          round: parseInt(race.round),
          name: race.raceName.replace(" Grand Prix", " GP"),
          country: race.Circuit.Location.country,
          city: race.Circuit.Location.locality,
          date: new Date(race.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          circuit: race.Circuit.circuitName,
          circuitId: getCircuitId(race.Circuit.circuitName, race.Circuit.Location.country),
          status: new Date(race.date) < new Date() ? "completed" : "upcoming",
          lat: parseFloat(race.Circuit.Location.lat),
          long: parseFloat(race.Circuit.Location.long),
          locality: race.Circuit.Location.locality,
          countryCode: race.Circuit.Location.country,
        }));

        setCircuits(circuitData);
      } catch (e) {
        console.error("Failed to load circuits:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCircuits();
  }, []);

  const completedRaces = circuits.filter((c) => c.status === "completed");
  const upcomingRaces = circuits.filter((c) => c.status === "upcoming");

  const getTrackDNA = (circuitId: string): TrackDNA | null => {
    return TRACK_DNA_DATA[circuitId] || null;
  };

  const getCategoryColor = (topSpeed: number): string => {
    if (topSpeed >= 350) return "text-red-500";
    if (topSpeed >= 330) return "text-orange-500";
    if (topSpeed >= 310) return "text-yellow-500";
    return "text-green-500";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Track DNA</h1>
          <p className="text-muted-foreground">Track characteristics and circuit analysis.</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Dna className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Track DNA</h1>
            <p className="text-muted-foreground text-sm">Circuit characteristics and analysis for 2026 season</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-green-500">{circuits.length}</p>
          <p className="text-xs text-gray-500 uppercase">Total Circuits</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-blue-500">{completedRaces.length}</p>
          <p className="text-xs text-gray-500 uppercase">Completed</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-yellow-500">{upcomingRaces.length}</p>
          <p className="text-xs text-gray-500 uppercase">Upcoming</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-red-500">370</p>
          <p className="text-xs text-gray-500 uppercase">Max Speed (km/h)</p>
        </div>
      </div>

      {/* Track DNA Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Route className="w-5 h-5 text-green-500" />
          Circuit Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {circuits.map((circuit) => {
            const dna = getTrackDNA(circuit.circuitId);
            const isSelected = selectedTrack === circuit.circuitId;

            return (
              <div
                key={circuit.round}
                className={`bg-[#1a1a1a] rounded-xl overflow-hidden transition-all cursor-pointer ${
                  isSelected ? "ring-2 ring-green-500" : "hover:ring-1 hover:ring-gray-600"
                }`}
                onClick={() => setSelectedTrack(isSelected ? null : circuit.circuitId)}
                role="button"
                tabIndex={0}
                aria-label={`${circuit.country} track details`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedTrack(isSelected ? null : circuit.circuitId);
                  }
                }}
              >
                {/* Header */}
                <div className="p-4 border-b border-[#333]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#E10600] text-white text-xs font-bold">
                          R{circuit.round}
                        </span>
                        <span className="text-xs text-gray-500">{circuit.date}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mt-1">{circuit.country}</h3>
                      <p className="text-gray-500 text-sm">{circuit.city}</p>
                    </div>
                    {circuit.status === "completed" ? (
                      <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-medium">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* DNA Stats */}
                {dna ? (
                  <div className="p-4 space-y-3">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded bg-[#252525]">
                        <p className="text-lg font-bold text-white">{dna.corners}</p>
                        <p className="text-xs text-gray-500">Corners</p>
                      </div>
                      <div className="text-center p-2 rounded bg-[#252525]">
                        <p className="text-lg font-bold text-white">{dna.length.toFixed(2)}km</p>
                        <p className="text-xs text-gray-500">Length</p>
                      </div>
                      <div className="text-center p-2 rounded bg-[#252525]">
                        <p className={`text-lg font-bold ${getCategoryColor(dna.topSpeed)}`}>
                          {dna.topSpeed}
                        </p>
                        <p className="text-xs text-gray-500">Max km/h</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Gauge className="w-3 h-3" /> DRS Zones
                        </span>
                        <span className="text-white font-medium">{dna.drsZones}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Braking Zones
                        </span>
                        <span className="text-white font-medium">{dna.brakingZones}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Elevation
                        </span>
                        <span className="text-white font-medium">{dna.elevationChange}m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Timer className="w-3 h-3" /> Longest Straight
                        </span>
                        <span className="text-white font-medium">{dna.longestStraight}m</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-[#333] space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Hardest Corner
                          </p>
                          <p className="text-white font-medium text-sm">{dna.hardestCorner}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Asphalt
                          </p>
                          <p className="text-white font-medium text-sm">{dna.asphaltType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Award className="w-3 h-3" /> Notable History
                          </p>
                          <p className="text-gray-400 text-sm">{dna.notableHistory}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Flag className="w-3 h-3" />
                          First F1 GP: {dna.firstGP}
                        </div>
                      </div>
                    )}

                    {!isSelected && (
                      <p className="text-xs text-gray-600 text-center mt-2">
                        Click for more details
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-gray-500 text-sm text-center">
                      DNA data not available for this circuit
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
