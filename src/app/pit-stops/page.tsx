import { PitStops } from "@/components/PitStops";

export default function PitStopsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pit Stops</h1>
        <p className="text-muted-foreground">
          Pit stop times and analysis from the 2024 season.
        </p>
      </div>
      <PitStops />
    </div>
  );
}
