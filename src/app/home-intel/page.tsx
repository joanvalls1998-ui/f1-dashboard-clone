import { HomeIntel } from "@/components/HomeIntel";

export const metadata = {
  title: "Intel·ligència F1 — Anàlisi Avançada",
  description: "Intel·ligència de dades de Fórmula 1. Anàlisi avançada, prediccions i insights de la temporada 2026.",
};

export default function HomeIntelPage() {
  return (
    <div className="min-h-screen var(--bg-primary)">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <HomeIntel />
      </div>
    </div>
  );
}
