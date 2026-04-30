import { CircleDot } from "lucide-react";

export default function PitStopsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pit Stops</h1>
        <p className="text-muted-foreground">
          Pit stop times and analysis for the 2024 season.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <CircleDot className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Average Pit Stop Times</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Pit stop data will be displayed here. This feature requires additional API integration.
        </p>
      </div>
    </div>
  );
}
