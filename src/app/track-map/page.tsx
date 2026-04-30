import { TrackMap } from "@/components/TrackMap";

export default function TrackMapPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Track Map</h1>
        <p className="text-muted-foreground">
          Interactive track with driver positions.
        </p>
      </div>
      <TrackMap />
    </div>
  );
}
