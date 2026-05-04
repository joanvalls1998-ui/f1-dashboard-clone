import { SpeedHistogram } from "@/components/SpeedHistogram";

export const metadata = {
  title: "Histograma de Velocitat F1 2026",
  description: "Histograma de velocitat de Fórmula 1 2026. Distribució de velocitats per pilot i cursa.",
};

export default function SpeedHistogramPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Speed Histogram</h1>
        <p className="text-[var(--text-muted)]">
          Speed distribution analysis.
        </p>
      </div>
      <SpeedHistogram />
    </div>
  );
}
