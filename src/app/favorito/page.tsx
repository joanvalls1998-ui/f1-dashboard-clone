import { FavoritoDashboard } from "@/components/FavoritoDashboard";

export const metadata = {
  title: "Pilot Favorit F1 2026",
  description: "Selecciona i segueix el teu pilot favorit de la temporada 2026 de Fórmula 1.",
};

export default function FavoritoPage() {
  return (
    <div className="min-h-screen var(--bg-primary)">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <FavoritoDashboard />
      </div>
    </div>
  );
}
