import { StartingGrid } from "@/components/StartingGrid";

export default function StartingGridPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Starting Grid</h1>
        <p className="text-muted-foreground">
          Race starting grid.
        </p>
      </div>
      <StartingGrid />
    </div>
  );
}
