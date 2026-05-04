import PredictEngine from "@/components/PredictEngine";

export const metadata = {
  title: "Prediccions F1 2026 — Resultats i Anàlisi",
  description: "Prediccions de resultats de Fórmula 1 2026. Machine learning, anàlisi estadística i pronòstics de curses.",
};

export default function PredictionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Predicción Táctica</h1>
        <p className="text-gray-400">
          Análisis táctico y predicciones de carrera.
        </p>
      </div>
      <PredictEngine raceName="Gran Premio de Emilia-Romaña" />
    </div>
  );
}
