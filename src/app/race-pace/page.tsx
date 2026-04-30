import { Flame } from "lucide-react";

export default function RacePacePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Race Pace</h1>
        <p className="text-muted-foreground">
          Race pace analysis and lap time comparisons.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold">Race Pace Analysis</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Race pace data will be displayed here.
        </p>
      </div>
    </div>
  );
}
