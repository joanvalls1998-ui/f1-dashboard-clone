import { drivers2026, driverByName, teamByName } from "./grid";
import { performanceState } from "./performance";
import { manualAdjustmentsState } from "./manual-adjustments";
import { getCircuitProfile, raceOptions } from "./circuits";

// ============================================================
// TypeScript Interfaces
// ============================================================

interface TeamPerformance {
  qualyPace: number;
  racePace: number;
  reliability: number;
  aero: number;
  topSpeed: number;
  traction: number;
  tyreManagement: number;
  streetTrack: number;
  wetPerformance: number;
  upgradeMomentum: number;
  recentTrend: number;
  baseVariance: number;
  [key: string]: number;
}

interface DriverPerformance {
  form: number;
  qualySkill: number;
  raceSkill: number;
  tyreSaving: number;
  wetWeather: number;
  streetCraft: number;
  starts: number;
  defence: number;
  attack: number;
  consistency: number;
  aggression: number;
  risk: number;
  recentTrend: number;
  confidence: number;
  [key: string]: number;
}

interface CircuitWeights {
  qualyImportance: number;
  racePaceImportance: number;
  reliabilityStress: number;
  tyreManagement: number;
  traction: number;
  aero: number;
  topSpeed: number;
  streetTrack: number;
}

interface CircuitProfile {
  round: number;
  venue: string;
  officialVenue: string;
  start: string;
  end: string;
  type: string;
  overtaking: number;
  baseRainChance: number;
  baseSafetyCarChance: number;
  degradation: number;
  weights: CircuitWeights;
}

interface DriverPrediction {
  name: string;
  number: string;
  shortCode: string;
  team: string;
  teamKey: string;
  colorClass: string;
  qualyScore: number;
  raceScore: number;
  dnfProbability: number;
  teamPerf: TeamPerformance;
  driverPerf: DriverPerformance;
}

interface PositionedDriver extends DriverPrediction {
  position: number;
  raceScoreAdjusted?: number;
  pointsProbability?: number;
}

interface TeamSummary {
  team: string;
  bestQualy: number;
  bestRace: number;
  averageQualy: number;
  averageRace: number;
  averagePointsProbability: number;
  atLeastOneDnfProbability: number;
  averageRaceScore: number;
}

interface StrategyRecommendation {
  label: string;
  stops: number | string;
}

interface FavoriteDriverPrediction {
  type: "driver";
  name: string;
  team: string;
  predictedQualyPosition: number | null;
  predictedRacePosition: number | null;
  pointsProbability: number;
  dnfProbability: number;
  qualyScore: number;
  raceScore: number;
}

interface FavoriteTeamPrediction {
  type: "team";
  name: string;
  drivers: Array<{
    name: string;
    predictedQualyPosition: number | null;
    predictedRacePosition: number;
    pointsProbability: number;
    dnfProbability: number;
  }>;
  bestQualyPosition: number | null;
  bestRacePosition: number | null;
  teamPointsProbability: number;
  teamAtLeastOneDnfProbability: number;
}

interface Favorite {
  type: "driver" | "team";
  name: string;
  team?: string;
}

export interface PredictionResult {
  mode: string;
  generatedAt: string;
  raceName: string;
  circuit: {
    round: number;
    venue: string;
    officialVenue: string;
    start: string;
    end: string;
    type: string;
    overtaking: number;
    rainProbability: number;
    safetyCarProbability: number;
    degradation: number;
  };
  favorite: Favorite;
  favoritePrediction: FavoriteDriverPrediction | FavoriteTeamPrediction;
  adjustments: {
    teams: Record<string, any>;
    drivers: Record<string, any>;
    newsSignalsCount: number;
    updatedAt: string | null;
  };
  summary: {
    predictedWinner: string | null;
    predictedPole: string | null;
    topTeams: string[];
    weakestTeams: string[];
    rainProbability: number;
    safetyCarProbability: number;
    strategy: StrategyRecommendation;
  };
  qualyOrder: Array<{
    position: number;
    name: string;
    number: string;
    team: string;
    score: number;
  }>;
  raceOrder: Array<{
    position: number;
    name: string;
    number: string;
    team: string;
    score: number;
    pointsProbability: number;
    dnfProbability: number;
  }>;
  teamSummary: Array<{
    team: string;
    bestQualy: number;
    bestRace: number;
    averageQualy: number;
    averageRace: number;
    averagePointsProbability: number;
    atLeastOneDnfProbability: number;
  }>;
}

// ============================================================
// Utility Functions
// ============================================================

function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function mergeNumericObjects(base: Record<string, any> = {}, ...layers: Array<Record<string, any> | undefined>): Record<string, any> {
  const result: Record<string, any> = { ...base };
  for (const layer of layers) {
    if (!layer) continue;
    for (const [key, value] of Object.entries(layer)) {
      if (typeof value === "number" && !Number.isNaN(value)) {
        const previous = typeof result[key] === "number" ? result[key] : 0;
        result[key] = clamp(previous + value, 0, 100);
      } else if (!(key in result)) {
        result[key] = value;
      }
    }
  }
  return result;
}

// ============================================================
// Performance Functions
// ============================================================

function getEffectiveTeamPerformance(teamName: string, runtimeAdjustmentsState: any): TeamPerformance | null {
  const base = (performanceState?.teams as any)?.[teamName] as TeamPerformance | undefined;
  if (!base) return null;
  const internalAdjustments = (performanceState?.manualAdjustments?.teams as any)?.[teamName] || {};
  const externalAdjustments = (runtimeAdjustmentsState?.teams as any)?.[teamName] || {};
  return mergeNumericObjects(base, internalAdjustments, externalAdjustments) as TeamPerformance;
}

function getEffectiveDriverPerformance(driverName: string, runtimeAdjustmentsState: any): DriverPerformance | null {
  const base = (performanceState?.drivers as any)?.[driverName] as DriverPerformance | undefined;
  if (!base) return null;
  const internalAdjustments = (performanceState?.manualAdjustments?.drivers as any)?.[driverName] || {};
  const externalAdjustments = (runtimeAdjustmentsState?.drivers as any)?.[driverName] || {};
  return mergeNumericObjects(base, internalAdjustments, externalAdjustments) as DriverPerformance;
}

// ============================================================
// Circuit Analysis Functions
// ============================================================

function getStreetFactor(type: string): number {
  if (type === "urbano") return 1;
  if (type === "semiurbano") return 0.6;
  return 0;
}

function getWetFactor(rainChance: number): number {
  if (rainChance >= 30) return 1;
  if (rainChance >= 18) return 0.55;
  return 0;
}

function getTeamFit(teamPerf: TeamPerformance, circuit: CircuitProfile): number {
  const w = circuit.weights;
  const totalWeight = w.aero + w.topSpeed + w.traction + w.tyreManagement + w.streetTrack;
  if (!totalWeight) return 0;
  return (teamPerf.aero * w.aero + teamPerf.topSpeed * w.topSpeed + teamPerf.traction * w.traction + teamPerf.tyreManagement * w.tyreManagement + teamPerf.streetTrack * w.streetTrack) / totalWeight;
}

// ============================================================
// Scoring Functions
// ============================================================

function computeQualyScore(
  driver: any,
  teamPerf: TeamPerformance,
  driverPerf: DriverPerformance,
  circuit: CircuitProfile
): number {
  const streetFactor = getStreetFactor(circuit.type);
  const wetFactor = getWetFactor(circuit.baseRainChance);
  const teamFit = getTeamFit(teamPerf, circuit);
  const streetAdj = streetFactor * ((teamPerf.streetTrack + driverPerf.streetCraft) / 2);
  const wetAdj = wetFactor * ((teamPerf.wetPerformance + driverPerf.wetWeather) / 2);
  return round(
    teamPerf.qualyPace * 0.46 + teamFit * 0.16 + driverPerf.qualySkill * 0.14 +
    driverPerf.form * 0.10 + driverPerf.confidence * 0.05 + streetAdj * 0.05 +
    wetAdj * 0.04 + teamPerf.upgradeMomentum * 0.35 + teamPerf.recentTrend * 0.45 + driverPerf.recentTrend * 0.55, 3);
}

function computeRaceScore(
  driver: any,
  teamPerf: TeamPerformance,
  driverPerf: DriverPerformance,
  circuit: CircuitProfile
): number {
  const streetFactor = getStreetFactor(circuit.type);
  const wetFactor = getWetFactor(circuit.baseRainChance);
  const teamFit = getTeamFit(teamPerf, circuit);
  const streetAdj = streetFactor * ((teamPerf.streetTrack + driverPerf.streetCraft) / 2);
  const wetAdj = wetFactor * ((teamPerf.wetPerformance + driverPerf.wetWeather) / 2);
  return round(
    teamPerf.racePace * 0.34 + teamFit * 0.12 + teamPerf.reliability * 0.14 +
    teamPerf.tyreManagement * 0.11 + driverPerf.raceSkill * 0.11 +
    driverPerf.form * 0.06 + driverPerf.consistency * 0.05 + driverPerf.tyreSaving * 0.03 +
    driverPerf.starts * 0.02 + streetAdj * 0.01 + wetAdj * 0.01 +
    teamPerf.upgradeMomentum * 0.40 + teamPerf.recentTrend * 0.50 + driverPerf.recentTrend * 0.50, 3);
}

function computeDnfProbability(
  teamPerf: TeamPerformance,
  driverPerf: DriverPerformance,
  circuit: CircuitProfile
): number {
  const streetFactor = getStreetFactor(circuit.type);
  const mechanicalRisk = 26 - teamPerf.reliability * 0.18;
  const circuitStress = circuit.weights.reliabilityStress * 7;
  const driverRisk = (driverPerf.risk - 20) * 0.45;
  const streetRisk = streetFactor === 1 ? 2.5 : streetFactor > 0 ? 1.2 : 0;
  const weatherRisk = circuit.baseRainChance * 0.03;
  const consistencyRelief = driverPerf.consistency > 70 ? (driverPerf.consistency - 70) * 0.12 : 0;
  return round(clamp(mechanicalRisk + circuitStress + driverRisk + streetRisk + weatherRisk - consistencyRelief, 6, 45), 1);
}

function computePointsProbability(
  predictedRacePosition: number,
  teamPerf: TeamPerformance,
  driverPerf: DriverPerformance,
  circuit: CircuitProfile,
  dnfProbability: number
): number {
  const baseByPosition: Record<number, number> = {1:99,2:98,3:96,4:93,5:89,6:84,7:78,8:72,9:65,10:56,11:44,12:34,13:26,14:20,15:15,16:11,17:8,18:6,19:5,20:4,21:3,22:2};
  let probability = baseByPosition[predictedRacePosition] ?? 2;
  probability -= dnfProbability * 0.35;
  probability += (teamPerf.reliability - 70) * 0.18;
  probability += (driverPerf.consistency - 75) * 0.12;
  if (predictedRacePosition >= 11 && predictedRacePosition <= 13) {
    probability += circuit.overtaking * 0.08;
    probability += circuit.baseSafetyCarChance * 0.10;
  }
  return round(clamp(probability, 1, 99), 1);
}

// ============================================================
// Strategy Function
// ============================================================

function computeStrategy(circuit: CircuitProfile): StrategyRecommendation {
  const { degradation, overtaking, baseSafetyCarChance: safetyCar, baseRainChance: rain } = circuit;
  if (rain >= 40) return { label: "Estrategia abierta por posible lluvia", stops: "Variable" };
  if (degradation >= 67) return { label: safetyCar >= 40 ? "Dos paradas con ventana flexible por Safety Car" : "Dos paradas buscando proteger neumáticos", stops: 2 };
  if (degradation >= 58 && overtaking >= 45) return { label: "Dos paradas para aprovechar ritmo y aire limpio", stops: 2 };
  if (overtaking <= 25) return { label: "Una parada priorizando posición en pista", stops: 1 };
  return { label: safetyCar >= 45 ? "Una parada flexible con opción de reaccionar al Safety Car" : "Una parada como estrategia base", stops: 1 };
}

// ============================================================
// Prediction Builders
// ============================================================

function buildDriverPredictions(circuit: CircuitProfile, runtimeAdjustmentsState: any): DriverPrediction[] {
  return drivers2026.map((driver: any) => {
    const teamPerf = getEffectiveTeamPerformance(driver.team, runtimeAdjustmentsState);
    const driverPerf = getEffectiveDriverPerformance(driver.name, runtimeAdjustmentsState);
    return {
      name: driver.name,
      number: driver.number,
      shortCode: driver.shortCode,
      team: driver.team,
      teamKey: driver.teamKey,
      colorClass: driver.colorClass,
      qualyScore: computeQualyScore(driver, teamPerf!, driverPerf!, circuit),
      raceScore: computeRaceScore(driver, teamPerf!, driverPerf!, circuit),
      dnfProbability: computeDnfProbability(teamPerf!, driverPerf!, circuit),
      teamPerf: teamPerf!,
      driverPerf: driverPerf!
    };
  });
}

function assignPositions<T extends Record<string, any>>(list: T[], scoreKey: string): (T & { position: number })[] {
  const sorted = [...list].sort((a: T, b: T) => {
    const aVal = a[scoreKey];
    const bVal = b[scoreKey];
    return bVal !== aVal ? bVal - aVal : a.name.localeCompare(a.name, "es");
  });
  return sorted.map((item: T, index: number) => ({ ...item, position: index + 1 }));
}

function buildRacePredictions(circuit: CircuitProfile, runtimeAdjustmentsState: any) {
  const base = buildDriverPredictions(circuit, runtimeAdjustmentsState);
  const qualyOrder = assignPositions(base, "qualyScore");
  const raceSeed = base.map((driver: any) => {
    const qualyReference = qualyOrder.find((q: any) => q.name === driver.name);
    const overtakingFactor = circuit.overtaking / 100;
    const qualyCarry = (23 - (qualyReference?.position ?? 12)) * 0.18 * (1 - overtakingFactor);
    return { ...driver, raceScoreAdjusted: round(driver.raceScore + qualyCarry, 3) };
  });
  const raceOrder = assignPositions(raceSeed, "raceScoreAdjusted").map((driver: any) => ({
    ...driver,
    pointsProbability: computePointsProbability(driver.position, driver.teamPerf, driver.driverPerf, circuit, driver.dnfProbability)
  }));
  return { qualyOrder, raceOrder };
}

function buildTeamSummary(raceOrder: PositionedDriver[], qualyOrder: PositionedDriver[]): TeamSummary[] {
  const teamMap = new Map<string, any>();
  for (const driver of raceOrder) {
    if (!teamMap.has(driver.team)) {
      teamMap.set(driver.team, {
        team: driver.team,
        racePositions: [],
        qualyPositions: [],
        pointsProbabilities: [],
        dnfProbabilities: [],
        averageRaceScore: 0
      });
    }
    const team = teamMap.get(driver.team);
    const qualyDriver = qualyOrder.find((q: any) => q.name === driver.name);
    team.racePositions.push(driver.position);
    team.qualyPositions.push(qualyDriver?.position || 22);
    team.pointsProbabilities.push(driver.pointsProbability);
    team.dnfProbabilities.push(driver.dnfProbability);
    team.averageRaceScore += driver.raceScoreAdjusted;
  }
  const teams: TeamSummary[] = Array.from(teamMap.values()).map((team: any) => ({
    team: team.team,
    bestQualy: Math.min(...team.qualyPositions),
    bestRace: Math.min(...team.racePositions),
    averageQualy: round(team.qualyPositions.reduce((a: number, b: number) => a + b, 0) / team.qualyPositions.length, 2),
    averageRace: round(team.racePositions.reduce((a: number, b: number) => a + b, 0) / team.racePositions.length, 2),
    averagePointsProbability: round(team.pointsProbabilities.reduce((a: number, b: number) => a + b, 0) / team.pointsProbabilities.length, 1),
    atLeastOneDnfProbability: round(100 * (1 - team.dnfProbabilities.reduce((acc: number, p: number) => acc * (1 - p / 100), 1)), 1),
    averageRaceScore: round(team.averageRaceScore / team.racePositions.length, 3)
  }));
  return teams.sort((a: TeamSummary, b: TeamSummary) => {
    return b.averageRaceScore !== a.averageRaceScore ? b.averageRaceScore - a.averageRaceScore : a.team.localeCompare(b.team, "es");
  });
}

// ============================================================
// Favorite Resolution
// ============================================================

function resolveFavorite(bodyFavorite: any): Favorite {
  const fallbackDriver = driverByName["Fernando Alonso"];
  if (!bodyFavorite || typeof bodyFavorite !== "object") {
    return { type: "driver", name: fallbackDriver.name, team: fallbackDriver.team };
  }
  if (bodyFavorite.type === "team" && teamByName[bodyFavorite.name]) {
    return { type: "team", name: bodyFavorite.name };
  }
  if (bodyFavorite.name && driverByName[bodyFavorite.name]) {
    const d = driverByName[bodyFavorite.name];
    return { type: "driver", name: d.name, team: d.team };
  }
  return { type: "driver", name: fallbackDriver.name, team: fallbackDriver.team };
}

function buildFavoritePrediction(
  favorite: Favorite,
  qualyOrder: PositionedDriver[],
  raceOrder: PositionedDriver[]
): FavoriteDriverPrediction | FavoriteTeamPrediction {
  if (favorite.type === "driver") {
    const driverQualy = qualyOrder.find((q: any) => q.name === favorite.name);
    const driverRace = raceOrder.find((r: any) => r.name === favorite.name);
    return {
      type: "driver",
      name: favorite.name,
      team: favorite.team!,
      predictedQualyPosition: driverQualy?.position ?? null,
      predictedRacePosition: driverRace?.position ?? null,
      pointsProbability: driverRace?.pointsProbability ?? 1,
      dnfProbability: driverRace?.dnfProbability ?? 0,
      qualyScore: driverQualy?.qualyScore ?? 0,
      raceScore: driverRace?.raceScoreAdjusted ?? 0
    };
  }
  const teamDrivers = raceOrder.filter((d: any) => d.team === favorite.name);
  const teamQualy = qualyOrder.filter((d: any) => d.team === favorite.name);
  const teamRace = raceOrder.filter((d: any) => d.team === favorite.name);
  const pointsAtLeastOneScores = teamRace.length ? 100 * (1 - teamRace.map((d: any) => 1 - (d.pointsProbability / 100)).reduce((a: number, b: number) => a * b, 1)) : 0;
  const dnfAtLeastOne = teamRace.length ? 100 * (1 - teamRace.map((d: any) => 1 - (d.dnfProbability / 100)).reduce((a: number, b: number) => a * b, 1)) : 0;
  return {
    type: "team",
    name: favorite.name,
    drivers: teamRace.map((d: any) => ({
      name: d.name,
      predictedQualyPosition: teamQualy.find((q: any) => q.name === d.name)?.position ?? null,
      predictedRacePosition: d.position,
      pointsProbability: d.pointsProbability,
      dnfProbability: d.dnfProbability
    })),
    bestQualyPosition: teamQualy.length ? Math.min(...teamQualy.map((d: any) => d.position)) : null,
    bestRacePosition: teamRace.length ? Math.min(...teamRace.map((d: any) => d.position)) : null,
    teamPointsProbability: round(pointsAtLeastOneScores, 1),
    teamAtLeastOneDnfProbability: round(dnfAtLeastOne, 1)
  };
}

// ============================================================
// Main Export Function
// ============================================================

export async function generatePrediction(
  favoriteName: string,
  raceName: string
): Promise<PredictionResult> {
  // Inline manualAdjustmentsState directly (instead of getRuntimeAdjustmentsState())
  const runtimeAdjustmentsState = manualAdjustmentsState;

  const favorite = resolveFavorite({ name: favoriteName });
  const circuit = getCircuitProfile(raceName);

  if (!circuit) {
    throw new Error(`Carrera no reconocida: ${raceName}. Available races: ${raceOptions.join(", ")}`);
  }

  const { qualyOrder, raceOrder } = buildRacePredictions(circuit, runtimeAdjustmentsState);
  const teamSummary = buildTeamSummary(raceOrder, qualyOrder);
  const strategy = computeStrategy(circuit);
  const favoritePrediction = buildFavoritePrediction(favorite, qualyOrder, raceOrder);
  const topTeams = teamSummary.slice(0, 3).map((t: TeamSummary) => t.team);
  const weakestTeams = teamSummary.slice(-3).map((t: TeamSummary) => t.team);

  return {
    mode: "semideterministic_v3_edge_config",
    generatedAt: new Date().toISOString(),
    raceName,
    circuit: {
      round: circuit.round,
      venue: circuit.venue,
      officialVenue: circuit.officialVenue,
      start: circuit.start,
      end: circuit.end,
      type: circuit.type,
      overtaking: circuit.overtaking,
      rainProbability: circuit.baseRainChance,
      safetyCarProbability: circuit.baseSafetyCarChance,
      degradation: circuit.degradation
    },
    favorite,
    favoritePrediction,
    adjustments: {
      teams: runtimeAdjustmentsState?.teams || {},
      drivers: runtimeAdjustmentsState?.drivers || {},
      newsSignalsCount: Array.isArray(runtimeAdjustmentsState?.newsSignals) ? runtimeAdjustmentsState.newsSignals.length : 0,
      updatedAt: runtimeAdjustmentsState?.meta?.updatedAt || null
    },
    summary: {
      predictedWinner: raceOrder[0]?.name || null,
      predictedPole: qualyOrder[0]?.name || null,
      topTeams,
      weakestTeams,
      rainProbability: circuit.baseRainChance,
      safetyCarProbability: circuit.baseSafetyCarChance,
      strategy
    },
    qualyOrder: qualyOrder.map((d: any) => ({
      position: d.position,
      name: d.name,
      number: d.number,
      team: d.team,
      score: round(d.qualyScore, 2)
    })),
    raceOrder: raceOrder.map((d: any) => ({
      position: d.position,
      name: d.name,
      number: d.number,
      team: d.team,
      score: round(d.raceScoreAdjusted, 2),
      pointsProbability: d.pointsProbability,
      dnfProbability: d.dnfProbability
    })),
    teamSummary: teamSummary.map((t: TeamSummary) => ({
      team: t.team,
      bestQualy: t.bestQualy,
      bestRace: t.bestRace,
      averageQualy: t.averageQualy,
      averageRace: t.averageRace,
      averagePointsProbability: t.averagePointsProbability,
      atLeastOneDnfProbability: t.atLeastOneDnfProbability
    }))
  };
}
