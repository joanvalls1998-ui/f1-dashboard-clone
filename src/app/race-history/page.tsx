import { RaceHistory } from "@/components/RaceHistory";

export default function RaceHistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Race History</h1>
        <p className="text-muted-foreground">
          Position changes lap by lap.
        </p>
      </div>
      <RaceHistory />
    </div>
  );
}
