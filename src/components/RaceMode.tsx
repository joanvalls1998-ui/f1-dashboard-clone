'use client';

import { useState, useEffect } from 'react';
import { Flag, Target, TrendingUp, AlertTriangle, Zap, Clock, Shield, Loader2 } from 'lucide-react';
import { getTeamColor } from '@/lib/team-colors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Favorite {
  name: string;
  type: 'driver' | 'team';
  team?: string;
  colorClass: string;
  number?: string;
  points?: string;
  pos?: string;
  image?: string;
}

interface PredictData {
  raceName?: string;
  summary?: {
    predictedWinner?: string;
    topTeams?: string[];
    weakestTeams?: string[];
    strategy?: {
      label?: string;
      stops?: number;
    };
    rainProbability?: number;
    safetyCarProbability?: number;
  };
  favoritePrediction?: {
    type?: string;
    predictedQualyPosition?: number;
    predictedRacePosition?: number;
    pointsProbability?: number;
    dnfProbability?: number;
    bestQualyPosition?: number;
    bestRacePosition?: number;
    teamPointsProbability?: number;
    teamAtLeastOneDnfProbability?: number;
  };
  raceOrder?: Array<{
    position: number;
    name: string;
    team: string;
    pointsProbability?: number;
  }>;
}

interface WeekendStage {
  key: 'preview' | 'friday' | 'saturday' | 'sunday' | 'completed';
  label: string;
  description?: string;
}

interface RaceModeProps {
  favorite?: Favorite | null;
  raceName?: string;
  predictData?: PredictData | null;
  stage?: WeekendStage;
  onNavigateHome?: () => void;
  onNavigatePredict?: () => void;
  onNavigateSessions?: () => void;
}

// ─── Team Data (from RaceControl) ───────────────────────────────────────────

interface TeamData {
  racePace: number;
  qualyPace: number;
  reliability: number;
  outlook: string;
  drivers: [string, string];
  forms: [number, number];
  aero: number;
  topSpeed: number;
  traction: number;
  tyreManagement: number;
  recentTrend: number;
}

const TEAM_DATA: Record<string, TeamData> = {
  "Mercedes": { racePace: 92, qualyPace: 91, reliability: 83, outlook: "Alta", drivers: ["George Russell", "Kimi Antonelli"], forms: [90, 88], aero: 90, topSpeed: 85, traction: 88, tyreManagement: 84, recentTrend: 4 },
  "Ferrari": { racePace: 88, qualyPace: 87, reliability: 78, outlook: "Alta", drivers: ["Charles Leclerc", "Lewis Hamilton"], forms: [89, 87], aero: 86, topSpeed: 90, traction: 84, tyreManagement: 80, recentTrend: 2 },
  "McLaren": { racePace: 84, qualyPace: 85, reliability: 82, outlook: "Alta", drivers: ["Lando Norris", "Oscar Piastri"], forms: [88, 88], aero: 87, topSpeed: 82, traction: 85, tyreManagement: 84, recentTrend: 1 },
  "Red Bull": { racePace: 80, qualyPace: 82, reliability: 74, outlook: "Media", drivers: ["Max Verstappen", "Isack Hadjar"], forms: [91, 77], aero: 88, topSpeed: 84, traction: 81, tyreManagement: 75, recentTrend: -2 },
  "Aston Martin": { racePace: 72, qualyPace: 68, reliability: 61, outlook: "Media", drivers: ["Fernando Alonso", "Lance Stroll"], forms: [88, 82], aero: 60, topSpeed: 56, traction: 58, tyreManagement: 60, recentTrend: -1 },
  "Alpine": { racePace: 66, qualyPace: 61, reliability: 58, outlook: "Media", drivers: ["Pierre Gasly", "Franco Colapinto"], forms: [82, 76], aero: 70, topSpeed: 67, traction: 69, tyreManagement: 67, recentTrend: 1 },
  "Williams": { racePace: 64, qualyPace: 60, reliability: 63, outlook: "Media", drivers: ["Carlos Sainz", "Alexander Albon"], forms: [81, 79], aero: 63, topSpeed: 68, traction: 61, tyreManagement: 63, recentTrend: -1 },
  "Audi": { racePace: 61, qualyPace: 58, reliability: 67, outlook: "Media", drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"], forms: [77, 74], aero: 64, topSpeed: 64, traction: 63, tyreManagement: 65, recentTrend: 0 },
  "Cadillac": { racePace: 59, qualyPace: 56, reliability: 60, outlook: "Media", drivers: ["Sergio Perez", "Valtteri Bottas"], forms: [78, 75], aero: 60, topSpeed: 66, traction: 60, tyreManagement: 62, recentTrend: 0 },
  "Haas": { racePace: 63, qualyPace: 59, reliability: 64, outlook: "Media", drivers: ["Esteban Ocon", "Oliver Bearman"], forms: [78, 80], aero: 69, topSpeed: 73, traction: 70, tyreManagement: 69, recentTrend: 2 },
  "Racing Bulls": { racePace: 68, qualyPace: 65, reliability: 66, outlook: "Media", drivers: ["Liam Lawson", "Arvid Lindblad"], forms: [79, 75], aero: 72, topSpeed: 70, traction: 71, tyreManagement: 68, recentTrend: 1 }
};

// ─── Race Heuristics ─────────────────────────────────────────────────────────

interface RaceHeuristics {
  safetyCar: number;
  rain: number;
  tag: 'urbano' | 'semiurbano' | 'permanente' | 'altitud' | 'circuito';
}

const RACE_HEURISTICS: Record<string, RaceHeuristics> = {
  "GP de Australia": { safetyCar: 42, rain: 24, tag: "semiurbano" },
  "GP de China": { safetyCar: 28, rain: 20, tag: "permanente" },
  "GP de Japón": { safetyCar: 24, rain: 26, tag: "permanente" },
  "GP de Baréin": { safetyCar: 26, rain: 1, tag: "permanente" },
  "GP de Arabia Saudí": { safetyCar: 47, rain: 1, tag: "urbano" },
  "GP Miami": { safetyCar: 46, rain: 18, tag: "semiurbano" },
  "GP de Canadá": { safetyCar: 50, rain: 21, tag: "semiurbano" },
  "GP de Mónaco": { safetyCar: 38, rain: 16, tag: "urbano" },
  "GP de España": { safetyCar: 20, rain: 11, tag: "permanente" },
  "GP de Austria": { safetyCar: 32, rain: 28, tag: "permanente" },
  "GP de Gran Bretaña": { safetyCar: 24, rain: 29, tag: "permanente" },
  "GP de Bélgica": { safetyCar: 33, rain: 36, tag: "permanente" },
  "GP de Hungría": { safetyCar: 27, rain: 19, tag: "permanente" },
  "GP de Países Bajos": { safetyCar: 25, rain: 23, tag: "permanente" },
  "GP de Italia": { safetyCar: 26, rain: 18, tag: "permanente" },
  "GP de España (Madrid)": { safetyCar: 41, rain: 10, tag: "urbano" },
  "GP de Azerbaiyán": { safetyCar: 48, rain: 9, tag: "urbano" },
  "GP de Singapur": { safetyCar: 57, rain: 33, tag: "urbano" },
  "GP de Estados Unidos": { safetyCar: 27, rain: 17, tag: "permanente" },
  "GP de México": { safetyCar: 29, rain: 8, tag: "altitud" },
  "GP de São Paulo": { safetyCar: 35, rain: 31, tag: "permanente" },
  "GP de Las Vegas": { safetyCar: 39, rain: 4, tag: "urbano" },
  "GP de Catar": { safetyCar: 22, rain: 2, tag: "permanente" },
  "GP de Abu Dabi": { safetyCar: 23, rain: 1, tag: "permanente" }
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function sameDriverName(a: string, b: string): boolean {
  if (!a || !b) return false;
  const aa = a.toLowerCase().trim();
  const bb = b.toLowerCase().trim();
  return aa === bb || aa.includes(bb) || bb.includes(aa);
}

function getTeamData(teamName: string): TeamData {
  return TEAM_DATA[teamName] || {
    racePace: 70, qualyPace: 67, reliability: 62, outlook: "Media",
    drivers: ["Piloto 1", "Piloto 2"], forms: [80, 78],
    aero: 70, topSpeed: 70, traction: 70, tyreManagement: 70, recentTrend: 0
  };
}

function getDriverComparison(team: string, driverName: string) {
  const teamData = getTeamData(team);
  const [driverA, driverB] = teamData.drivers;
  const [formA, formB] = teamData.forms;

  if (sameDriverName(driverName, driverA)) {
    return { primaryName: driverA, primaryForm: formA, secondaryName: driverB, secondaryForm: formB };
  }
  if (sameDriverName(driverName, driverB)) {
    return { primaryName: driverB, primaryForm: formB, secondaryName: driverA, secondaryForm: formA };
  }
  return { primaryName: driverA, primaryForm: formA, secondaryName: driverB, secondaryForm: formB };
}

function getTrendInfo(teamName: string, favorite: Favorite) {
  const teamData = getTeamData(teamName);
  let score = teamData.recentTrend || 0;

  if (favorite.type === "driver") {
    const comparison = getDriverComparison(teamName, favorite.name);
    score += (comparison.primaryForm - comparison.secondaryForm) * 0.12;
  }

  if (score >= 2) {
    return { label: "Al alza", className: "up", description: "Llega con señales positivas y mejor lectura del fin de semana." };
  }
  if (score <= -1.5) {
    return { label: "A la baja", className: "down", description: "Sigue necesitando un salto claro para estabilizar el rendimiento." };
  }
  return { label: "Estable", className: "neutral", description: "Rendimiento bastante estable, sin un giro claro todavía." };
}

function getFavoriteStrengthWindow(favorite: Favorite, teamData: TeamData) {
  let composite = teamData.racePace * 0.62 + teamData.qualyPace * 0.18 + teamData.reliability * 0.20;

  if (favorite.type === "driver") {
    const comparison = getDriverComparison(favorite.team || '', favorite.name);
    composite += (comparison.primaryForm - 80) * 0.25;
  } else {
    composite += (((teamData.forms[0] + teamData.forms[1]) / 2) - 80) * 0.15;
  }

  if (composite >= 90) return "P1-P3";
  if (composite >= 85) return "P3-P5";
  if (composite >= 80) return "P5-P7";
  if (composite >= 75) return "P7-P10";
  if (composite >= 70) return "P9-P12";
  if (composite >= 65) return "P11-P14";
  return "P14-P18";
}

function getFavoriteHomeMetrics(favorite: Favorite) {
  const teamName = favorite.type === "driver" ? (favorite.team || '') : favorite.name;
  const teamData = getTeamData(teamName);
  const trendInfo = getTrendInfo(teamName, favorite);
  const window = getFavoriteStrengthWindow(favorite, teamData);

  let formBoost = 0;
  if (favorite.type === "driver") {
    const comparison = getDriverComparison(teamName, favorite.name);
    formBoost = (comparison.primaryForm - 80) * 0.5;
  } else {
    formBoost = (((teamData.forms[0] + teamData.forms[1]) / 2) - 80) * 0.3;
  }

  const pointsProbability = Math.round(Math.max(12, Math.min(92, (teamData.racePace - 50) * 1.8 + formBoost)));
  const dnfRisk = Math.round(Math.max(8, Math.min(45, 34 - teamData.reliability * 0.27 + (100 - teamData.racePace) * 0.06)));

  return { pointsProbability, dnfRisk, trendInfo, expectedWindow: window, teamData };
}

function getRaceHeuristics(raceName: string): RaceHeuristics {
  return RACE_HEURISTICS[raceName] || { safetyCar: 30, rain: 15, tag: "circuito" };
}

function getQualyRaceBalance(favorite: Favorite, raceName: string, data: PredictData | null | undefined) {
  const local = getPredictLocalEstimate(favorite, raceName);
  const qualy = local.qualyRange;
  const race = local.raceRange;

  let label = "Equilibrado";
  let description = "No hay una diferencia muy marcada entre sábado y domingo; lo decisivo será ejecutar bien todo el fin de semana.";

  if (local.teamData.racePace > local.teamData.qualyPace + 3) {
    label = "Mejor en carrera";
    description = "El coche debería tener mejor lectura de stint largo que de una vuelta pura. El domingo puede ofrecer más que el sábado.";
  } else if (local.teamData.qualyPace > local.teamData.racePace + 3) {
    label = "Mejor a una vuelta";
    description = "El potencial en clasificación parece algo más fuerte que el ritmo largo. Convertir bien la salida será clave.";
  }

  return { label, description, qualy, race };
}

function getStrategyWindow(raceName: string, stops: number) {
  const heuristics = getRaceHeuristics(raceName);
  const tag = heuristics.tag;

  if (stops >= 2) {
    if (tag === "urbano") return "V10-16 y V28-36";
    if (tag === "semiurbano") return "V12-18 y V30-38";
    return "V14-20 y V32-40";
  }

  if (tag === "urbano") return "V18-28";
  if (tag === "semiurbano") return "V16-24";
  if (tag === "altitud") return "V17-25";
  return "V18-26";
}

function getStrategyNarrative(favorite: Favorite, raceName: string, data: PredictData | null | undefined) {
  const local = getPredictLocalEstimate(favorite, raceName);
  const summaryStrategy = data?.summary?.strategy ?? null;
  const heuristics = local.heuristics;
  const stops = Number.isFinite(summaryStrategy?.stops) ? (summaryStrategy?.stops ?? 1) : (heuristics.safetyCar >= 45 ? 2 : 1);
  const label = summaryStrategy?.label || (stops >= 2 ? "Estrategia flexible a dos paradas" : "Una parada como base");
  const window = getStrategyWindow(raceName, stops);

  let factor = "Track position";
  let note = "La lectura base es de carrera relativamente ordenada, donde el ritmo puro tendrá bastante peso.";

  if (heuristics.safetyCar >= 45) {
    factor = "Safety Car";
    note = "La estrategia puede romperse con una neutralización. Conviene mantener margen para reaccionar rápido.";
  } else if (heuristics.rain >= 28) {
    factor = "Meteorología";
    note = "La ventana estratégica puede abrirse o cerrarse rápido si cambia la pista.";
  } else if (heuristics.tag === "urbano") {
    factor = "Posición en pista";
    note = "Aquí adelantar suele costar más, así que la salida y la primera parada condicionan casi todo.";
  } else if (local.teamData.tyreManagement < 68) {
    factor = "Gestión de neumáticos";
    note = "El mayor punto de vigilancia es no pasarse de degrado en el stint medio.";
  }

  return { label, stops, window, factor, note };
}

function getPredictGridRead(favorite: Favorite, raceName: string, data: PredictData | null | undefined) {
  if (data?.summary) {
    const summary = data.summary;
    return {
      winner: summary.predictedWinner || "Sin datos",
      topTeams: Array.isArray(summary.topTeams) ? summary.topTeams.join(", ") : "Sin datos",
      weakestTeams: Array.isArray(summary.weakestTeams) ? summary.weakestTeams.join(", ") : "Sin datos"
    };
  }

  const ranking = [
    { team: "Mercedes", pace: getTeamData("Mercedes").racePace },
    { team: "Ferrari", pace: getTeamData("Ferrari").racePace },
    { team: "McLaren", pace: getTeamData("McLaren").racePace },
    { team: "Red Bull", pace: getTeamData("Red Bull").racePace },
    { team: "Aston Martin", pace: getTeamData("Aston Martin").racePace },
    { team: "Racing Bulls", pace: getTeamData("Racing Bulls").racePace },
    { team: "Alpine", pace: getTeamData("Alpine").racePace },
    { team: "Williams", pace: getTeamData("Williams").racePace },
    { team: "Haas", pace: getTeamData("Haas").racePace },
    { team: "Audi", pace: getTeamData("Audi").racePace },
    { team: "Cadillac", pace: getTeamData("Cadillac").racePace }
  ].sort((a, b) => b.pace - a.pace);

  const winner = ranking[0]?.team || "Sin datos";
  const topTeams = ranking.slice(0, 3).map(item => item.team).join(", ");
  const weakestTeams = ranking.slice(-3).map(item => item.team).join(", ");

  return { winner, topTeams, weakestTeams };
}

function getPredictLocalEstimate(favorite: Favorite, raceName: string) {
  const teamName = favorite.type === "driver" ? (favorite.team || '') : favorite.name;
  const teamData = getTeamData(teamName);
  const heuristics = getRaceHeuristics(raceName);
  const metrics = getFavoriteHomeMetrics(favorite);

  const qualyRange =
    teamData.qualyPace >= 88 ? "P2-P5" :
    teamData.qualyPace >= 82 ? "P4-P7" :
    teamData.qualyPace >= 75 ? "P6-P10" :
    teamData.qualyPace >= 68 ? "P9-P13" :
    "P12-P16";

  const raceRange = metrics.expectedWindow || "P10-P14";

  return { teamName, teamData, heuristics, qualyRange, raceRange, pointsProbability: metrics.pointsProbability, dnfRisk: metrics.dnfRisk };
}

function getWeekendSignal(favorite: Favorite, raceName: string) {
  const metrics = getFavoriteHomeMetrics(favorite);
  const heuristics = getRaceHeuristics(raceName);
  const teamName = favorite.type === "driver" ? (favorite.team || '') : favorite.name;
  const teamData = getTeamData(teamName);

  let score = 0;
  score += (metrics.pointsProbability - 50) * 0.45;
  score -= (metrics.dnfRisk - 18) * 0.65;
  score += (teamData.racePace - 70) * 0.55;
  score += (teamData.qualyPace - 68) * 0.25;
  score += (teamData.reliability - 62) * 0.30;

  if (metrics.trendInfo.label === "Al alza") score += 8;
  if (metrics.trendInfo.label === "A la baja") score -= 8;

  if (heuristics.safetyCar >= 45) score += 3;
  if (heuristics.rain >= 28) score -= 2;

  if (score >= 18) {
    return { label: "Favorable", className: "up", description: "El contexto general del GP es bastante bueno para el favorito." };
  }
  if (score <= -4) {
    return { label: "Difícil", className: "down", description: "El fin de semana exige maximizar ejecución y minimizar errores." };
  }
  return { label: "Neutro", className: "neutral", description: "Hay opciones, pero el resultado dependerá mucho de la ejecución." };
}

function formatFavoritePredictionText(favoritePrediction: PredictData['favoritePrediction']) {
  if (!favoritePrediction) {
    return { qualy: "Sin datos", race: "Sin datos", points: "Sin datos", dnf: "Sin datos" };
  }

  if (favoritePrediction.type === "driver") {
    return {
      qualy: favoritePrediction.predictedQualyPosition ? `P${favoritePrediction.predictedQualyPosition}` : "Sin datos",
      race: favoritePrediction.predictedRacePosition ? `P${favoritePrediction.predictedRacePosition}` : "Sin datos",
      points: favoritePrediction.pointsProbability != null ? `${favoritePrediction.pointsProbability}%` : "Sin datos",
      dnf: favoritePrediction.dnfProbability != null ? `${favoritePrediction.dnfProbability}%` : "Sin datos"
    };
  }

  return {
    qualy: favoritePrediction.bestQualyPosition ? `P${favoritePrediction.bestQualyPosition}` : "Sin datos",
    race: favoritePrediction.bestRacePosition ? `P${favoritePrediction.bestRacePosition}` : "Sin datos",
    points: favoritePrediction.teamPointsProbability != null ? `${favoritePrediction.teamPointsProbability}%` : "Sin datos",
    dnf: favoritePrediction.teamAtLeastOneDnfProbability != null ? `${favoritePrediction.teamAtLeastOneDnfProbability}%` : "Sin datos"
  };
}

// ─── Main RaceMode Component ──────────────────────────────────────────────────

export default function RaceMode({ 
  favorite, 
  raceName, 
  predictData, 
  stage,
  onNavigateHome,
  onNavigatePredict,
  onNavigateSessions
}: RaceModeProps) {
  const [loading, setLoading] = useState(false);

  if (!favorite) {
    return (
      <div className="bg-[#171717] rounded-xl border border-[#333] p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
        <p className="text-gray-400">No hay favorito seleccionado. Configúralo en Home.</p>
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="mt-4 px-4 py-2 bg-[#1f1f1f] text-white rounded-lg text-sm hover:bg-[#2a2a2a] transition-colors"
          >
            Ir a Home
          </button>
        )}
      </div>
    );
  }

  const metrics = getFavoriteHomeMetrics(favorite);
  const raceNameSafe = raceName ?? "Miami GP";
  const balance = getQualyRaceBalance(favorite, raceNameSafe, predictData);
  const strategy = getStrategyNarrative(favorite, raceNameSafe, predictData);
  const grid = getPredictGridRead(favorite, raceNameSafe, predictData);
  const signal = getWeekendSignal(favorite, raceNameSafe);
  const favoritePrediction = formatFavoritePredictionText(predictData?.favoritePrediction);
  const favoriteLabel = favorite.type === "driver" ? favorite.name : `el equipo ${favorite.name}`;

  // Compute quick read items
  let needsText = `Necesita ejecutar limpio y proteger su ventana competitiva (${metrics.expectedWindow}).`;

  if (metrics.dnfRisk >= 28) {
    needsText = "Necesita un fin de semana limpio y sin comprometer fiabilidad para sostener su objetivo real.";
  } else if (balance.label === "Mejor a una vuelta") {
    needsText = "Necesita cerrar un sábado limpio y defender posición desde la salida para no perder aire limpio.";
  } else if (balance.label === "Mejor en carrera") {
    needsText = "Necesita mantenerse en ventana hasta la primera parada y dejar que el stint largo construya su carrera.";
  } else if (strategy.factor === "Safety Car") {
    needsText = "Necesita mantenerse vivo en estrategia para aprovechar cualquier neutralización que rompa el guion.";
  }

  let stageText = "Antes de empezar, la lectura manda más que el resultado.";
  if (stage?.key === "friday") stageText = "Viernes abierto: filtra el ruido de tabla y fíjate en tanda larga y consistencia.";
  if (stage?.key === "saturday") stageText = "Sábado crítico: la qualy puede condicionar casi todo el domingo.";
  if (stage?.key === "sunday") stageText = "Domingo puro: la estrategia y la primera vuelta pueden cambiarlo todo.";

  const quickReadItems = [
    {
      title: "Quién llega mejor",
      text: `${grid.winner} parte como referencia inicial del GP, con ${grid.topTeams} marcando la zona alta esperada.`
    },
    {
      title: "Qué define este fin de semana",
      text: `${stageText} Señal general: ${signal.label.toLowerCase()}. Factor estratégico: ${strategy.factor}.`
    },
    {
      title: `Qué necesita ${favoriteLabel}`,
      text: needsText
    }
  ];

  const top10 = Array.isArray(predictData?.raceOrder) ? predictData.raceOrder.slice(0, 10) : [];
  const favoriteTeam = favorite.type === "driver" ? favorite.team : favorite.name;
  const favoriteName = favorite.type === "driver" ? favorite.name : null;

  // Signal badge color
  const signalColors: Record<string, string> = {
    up: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    down: 'bg-red-500/20 text-red-400 border-red-500/30',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-[#171717] rounded-xl border border-[#333] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-lg">Modo Carrera</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded border ${signalColors[signal.className] || signalColors.neutral}`}>
            {signal.label}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{raceName}</p>
        {stage && (
          <div className="mt-2 text-xs text-gray-500">
            {stage.label} · {stage.description}
          </div>
        )}
      </div>

      {/* Favorite Summary Card */}
      <div className="bg-[#171717] rounded-xl border border-[#333] p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Tu favorito</p>
            <p className="text-white font-bold text-lg">{favorite.name}</p>
            <p className="text-gray-500 text-sm">{favorite.type === 'driver' ? favorite.team : 'Equipo'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{favorite.points || '0'}</p>
            <p className="text-gray-500 text-xs">pts</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">Clasificación</p>
            <p className="text-white font-bold text-lg">{favoritePrediction.qualy}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">Carrera</p>
            <p className="text-white font-bold text-lg">{favoritePrediction.race}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">Puntos</p>
            <p className="text-white font-bold text-lg">{favoritePrediction.points}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">Abandono</p>
            <p className="text-white font-bold text-lg">{favoritePrediction.dnf}</p>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Ventana</p>
            <p className="text-white font-semibold text-sm">{metrics.expectedWindow}</p>
            <p className="text-gray-600 text-xs">Rango</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Tendencia</p>
            <p className={`font-semibold text-sm ${
              metrics.trendInfo.className === 'up' ? 'text-emerald-400' :
              metrics.trendInfo.className === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {metrics.trendInfo.label}
            </p>
            <p className="text-gray-600 text-xs">{metrics.trendInfo.description}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Balance</p>
            <p className="text-white font-semibold text-sm">{balance.label}</p>
            <p className="text-gray-600 text-xs">Qualy / carrera</p>
          </div>
        </div>
      </div>

      {/* Quick Read Card */}
      <div className="bg-[#171717] rounded-xl border border-[#333] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-semibold text-sm">Lectura rápida</span>
        </div>
        <div className="space-y-4">
          {quickReadItems.map((item, idx) => (
            <div key={idx} className="border-l-2 border-[#333] pl-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{item.title}</p>
              <p className="text-white text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Card */}
      <div className="bg-[#171717] rounded-xl border border-[#333] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-semibold text-sm">Estrategia</span>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">{strategy.label}</span>
            <span className="text-cyan-400 text-xs font-medium">{strategy.factor}</span>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">{strategy.note}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Ventana de parada: {strategy.window}</span>
        </div>
      </div>

      {/* Top 10 Estimated */}
      <div className="bg-[#171717] rounded-xl border border-[#333] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Top 10 estimado</span>
          </div>
          {predictData && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              Predicción IA
            </span>
          )}
        </div>

        {top10.length > 0 ? (
          <div className="space-y-2">
            {top10.map((driver) => {
              const badges: string[] = [];
              if (driver.position === 1) badges.push('Favorito GP');
              if (favoriteName && sameDriverName(driver.name, favoriteName)) badges.push('Tu favorito');
              if (!favoriteName && driver.team === favoriteTeam) badges.push('Equipo fav.');

              return (
                <div key={`${driver.name}-${driver.position}`} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-5 text-center">{driver.position}</span>
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: getTeamColor(driver.team) }} />
                    <div>
                      <p className="text-white text-sm">{driver.name}</p>
                      <p className="text-gray-500 text-xs">{driver.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {badges.length > 0 && (
                      <div className="flex gap-1">
                        {badges.map((badge) => (
                          <span key={badge} className="text-xs bg-[#2a2a2a] text-gray-300 px-1.5 py-0.5 rounded">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    {driver.pointsProbability != null && (
                      <span className="text-xs text-gray-500">{driver.pointsProbability}% pts</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No hay top 10 disponible.</p>
            <p className="text-gray-600 text-xs mt-1">Genera una predicción en el Ingeniero para ver el orden estimado.</p>
            {onNavigatePredict && (
              <button
                onClick={onNavigatePredict}
                className="mt-3 px-4 py-2 bg-[#1f1f1f] text-white rounded-lg text-sm hover:bg-[#2a2a2a] transition-colors"
              >
                Ir al Ingeniero
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="flex-1 px-4 py-2.5 bg-[#1f1f1f] text-white rounded-lg text-sm hover:bg-[#2a2a2a] transition-colors"
          >
            Inicio
          </button>
        )}
        {onNavigateSessions && (
          <button
            onClick={onNavigateSessions}
            className="flex-1 px-4 py-2.5 bg-[#1f1f1f] text-white rounded-lg text-sm hover:bg-[#2a2a2a] transition-colors"
          >
            Sesiones
          </button>
        )}
        {onNavigatePredict && (
          <button
            onClick={onNavigatePredict}
            className="flex-1 px-4 py-2.5 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Ingeniero
          </button>
        )}
      </div>
    </div>
  );
}
