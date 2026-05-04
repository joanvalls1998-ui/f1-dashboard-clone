import { TyreStrategy } from "@/components/TyreStrategy";

export const metadata = {
  title: "Estratègia de Pneumàtics F1 2026",
  description: "Estratègia de pneumàtics de la Fórmula 1 2026. Compostos, desgast i parades a boxes.",
};

export default function TyreStrategyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tyre Strategy</h1>
        <p className="text-[var(--text-secondary)]">
          Tyre compounds and stint analysis.
        </p>
      </div>
      <TyreStrategy />
    </div>
  );
}
