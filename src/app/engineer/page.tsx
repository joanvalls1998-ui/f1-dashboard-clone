import EngineerDashboard from "@/components/EngineerDashboard";

export const metadata = {
  title: "Enginyer F1 — Estratègia i Dades",
  description: "Eina d'enginyer de Fórmula 1. Anàlisi tècnic, estratègia de curses i dades de rendiment.",
};

export default function EngineerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <EngineerDashboard />
      </div>
    </div>
  );
}
