import { DNFTracker } from "@/components/DNFTracker";

export const metadata = {
  title: "Abandonaments F1 2026 — DNF",
  description: "Llista d'abandonaments (DNF) de la temporada 2026 de Fórmula 1. Causes, voltes i pilots afectats.",
};

export default function DnfPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>DNF Tracker</h1>
        <p className="text-gray-400">
          Retirements and non-finishers.
        </p>
      </div>
      <DNFTracker />
    </div>
  );
}
