import { LiveTiming } from "@/components/LiveTiming";

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
