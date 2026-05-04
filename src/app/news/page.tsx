import { NewsFeed } from "@/components/NewsFeed";

export const metadata = {
  title: "Notícies F1 2026 — Última Hora",
  description: "Notícies i actualitat de la Fórmula 1 2026. Últimes novetats, resultats i anàlisi.",
};

export default function NewsPage() {
  return (
    <div className="min-h-screen var(--bg-primary)">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <NewsFeed />
      </div>
    </div>
  );
}
