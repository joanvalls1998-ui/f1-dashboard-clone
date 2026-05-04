import { TeamsList } from "@/components/TeamsList";

export const metadata = {
  title: "Equips F1 2026 — Informació i Estadístiques",
  description: "Informació i estadístiques dels equips de Fórmula 1 2026. Plantilles, punts i victòries.",
};

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">2026 Season</p>
        <h1 className="text-3xl font-extrabold mt-1" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Teams
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          All F1 teams with detailed statistics and information.
        </p>
      </div>
      <TeamsList />
    </div>
  );
}
