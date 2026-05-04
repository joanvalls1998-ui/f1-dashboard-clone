import { LiveTiming } from "@/components/LiveTiming";

export const metadata = {
  title: "Directe F1 — Cronometratge en Temps Real",
  description: "Segueix les sessions de Fórmula 1 en temps real amb cronometratge en directe, posicions i telemetry.",
};

export default function LivePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Live Timing</h1>
        <p className="text-gray-400">
          Real-time F1 session data with live positions, sector times, and telemetry.
        </p>
      </div>
      <LiveTiming />
    </div>
  );
}
