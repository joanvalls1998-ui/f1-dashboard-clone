import RaceMode from "@/components/RaceMode";

export const metadata = {
  title: "Mode Cursa F1 2026",
  description: "Mode cursa de Fórmula 1 2026. Visualització immersiva de dades en temps real durant la cursa.",
};

export default function RaceModePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <RaceMode />
      </div>
    </div>
  );
}
