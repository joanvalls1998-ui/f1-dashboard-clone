import { DriverStatComparison } from "@/components/DriverStatComparison";

export const metadata = {
  title: "Comparativa de Pilots F1 2026",
  description: "Compara pilots de Fórmula 1 2026. Estadístiques, rendiment i dades cara a cara.",
};

export default function DriverComparisonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Comparison</h1>
        <p className="text-[var(--text-secondary)]">
          Compare drivers by their stats, photos, and championship positions.
        </p>
      </div>
      <DriverStatComparison />
    </div>
  );
}
