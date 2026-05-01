"use client";

import { useState, useEffect } from "react";
import { generatePrediction } from "@/lib/rc-data/predict-engine";
import type { PredictionResult } from "@/lib/rc-data/predict-engine";

interface PredictEngineProps {
  raceName: string;
  favoriteName?: string;
}

export default function PredictEngine({
  raceName,
  favoriteName = "Fernando Alonso"
}: PredictEngineProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrediction() {
      setLoading(true);
      setError(null);
      try {
        const result = await generatePrediction(favoriteName, raceName);
        setPrediction(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al generar predicción");
      } finally {
        setLoading(false);
      }
    }
    loadPrediction();
  }, [raceName, favoriteName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-muted-foreground">Generando predicciones tácticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-destructive">
          <p className="text-lg">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="space-y-8">
      {/* Circuit Info */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{prediction.circuit.venue}</h2>
            <p className="text-muted-foreground">Ronda {prediction.circuit.round}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Prob. Lluvia</p>
            <p className="text-lg font-semibold">{prediction.circuit.rainProbability}%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p className="font-medium capitalize">{prediction.circuit.type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Adelantamientos</p>
            <p className="font-medium">{prediction.circuit.overtaking}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Safety Car</p>
            <p className="font-medium">{prediction.circuit.safetyCarProbability}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Degradación</p>
            <p className="font-medium">{prediction.circuit.degradation}</p>
          </div>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-2">Estrategia Recomendada</h3>
        <p className="text-xl">{prediction.summary.strategy.label}</p>
        <p className="text-muted-foreground mt-1">
          Paradas: <span className="font-medium">{prediction.summary.strategy.stops}</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-6 border">
          <h4 className="text-sm text-muted-foreground mb-1">Ganador Previsto</h4>
          <p className="text-xl font-bold">{prediction.summary.predictedWinner || "N/A"}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h4 className="text-sm text-muted-foreground mb-1">Pole Position</h4>
          <p className="text-xl font-bold">{prediction.summary.predictedPole || "N/A"}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h4 className="text-sm text-muted-foreground mb-1">Favorito</h4>
          <p className="text-xl font-bold">{prediction.favorite.name}</p>
          <p className="text-sm text-muted-foreground">{prediction.favorite.team}</p>
        </div>
      </div>

      {/* Top & Weakest Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-6 border">
          <h4 className="text-sm text-muted-foreground mb-2">Equipos Más Fuertes</h4>
          <ul className="space-y-1">
            {prediction.summary.topTeams.map((team, i) => (
              <li key={team} className="font-medium">{i + 1}. {team}</li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h4 className="text-sm text-muted-foreground mb-2">Equipos Más Débiles</h4>
          <ul className="space-y-1">
            {prediction.summary.weakestTeams.map((team, i) => (
              <li key={team} className="font-medium">{i + 1}. {team}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Qualifying Order */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Orden de Clasificación</h3>
        <div className="space-y-2">
          {prediction.qualyOrder.slice(0, 10).map((driver) => (
            <div key={driver.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                  {driver.position}
                </span>
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-muted-foreground">{driver.team}</p>
                </div>
              </div>
              <span className="text-muted-foreground">{driver.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Race Order */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Orden de Carrera</h3>
        <div className="space-y-2">
          {prediction.raceOrder.map((driver) => (
            <div key={driver.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                  {driver.position}
                </span>
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-muted-foreground">{driver.team}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{driver.score}</p>
                <p className="text-xs text-muted-foreground">
                  Pts: {driver.pointsProbability}% | DNF: {driver.dnfProbability}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Summary */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Resumen por Equipos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="pb-2">Equipo</th>
                <th className="pb-2">Mejor Qualy</th>
                <th className="pb-2">Mejor Carrera</th>
                <th className="pb-2">Prom. Qualy</th>
                <th className="pb-2">Prom. Carrera</th>
                <th className="pb-2">Prob. Puntos</th>
                <th className="pb-2">Prob. DNF</th>
              </tr>
            </thead>
            <tbody>
              {prediction.teamSummary.map((team) => (
                <tr key={team.team} className="border-b last:border-0">
                  <td className="py-2 font-medium">{team.team}</td>
                  <td className="py-2">{team.bestQualy}</td>
                  <td className="py-2">{team.bestRace}</td>
                  <td className="py-2">{team.averageQualy}</td>
                  <td className="py-2">{team.averageRace}</td>
                  <td className="py-2">{team.averagePointsProbability}%</td>
                  <td className="py-2">{team.atLeastOneDnfProbability}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center">
        Generado: {new Date(prediction.generatedAt).toLocaleString("es-ES")} | Modo: {prediction.mode}
      </p>
    </div>
  );
}
