import { PitStops } from "@/components/PitStops";
import { RacePace } from "@/components/RacePace";

export default function RacePacePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Race Pace</h1>
        <p className="text-muted-foreground">
          Race pace analysis and lap time comparisons across the grid.
        </p>
      </div>
      <RacePace />
    </div>
  );
}
