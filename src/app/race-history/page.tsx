import { RaceHistory } from "@/components/RaceHistory";
import { SeasonHistory } from "@/components/SeasonHistory";

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
      
      <div className="border-t pt-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Season History 2026</h2>
          <p className="text-muted-foreground">
            Complete race results for the 2026 Formula 1 season.
          </p>
        </div>
        <SeasonHistory />
      </div>
    </div>
  );
}
