import { Weather } from "@/components/Weather";

export const metadata = {
  title: "Temps F1 2026 — Meteorologia de Curses",
  description: "Condicions meteorològiques de les curses de Fórmula 1 2026. Temperatura, pluja i vent.",
};

export default function WeatherPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Weather</h1>
        <p className="text-[var(--text-secondary)]">
          Live weather conditions and track status.
        </p>
      </div>
      <Weather />
    </div>
  );
}
