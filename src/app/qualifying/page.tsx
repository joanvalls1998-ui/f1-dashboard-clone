import { QualifyingAnalysis } from "@/components/QualifyingAnalysis";

export const metadata = {
  title: "Classificació F1 2026 — Qualifying",
  description: "Resultats de classificació (qualifying) de la Fórmula 1 2026. Grid, Q1, Q2, Q3 i posicions de sortida.",
};

export default function QualifyingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Qualifying Analysis</h1>
        <p className="text-gray-400">
          Q1, Q2, Q3 results.
        </p>
      </div>
      <QualifyingAnalysis />
    </div>
  );
}
