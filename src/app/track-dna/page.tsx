import { Dna } from "lucide-react";

export default function TrackDnaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Track DNA</h1>
        <p className="text-muted-foreground">
          Track characteristics and circuit analysis.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Dna className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold">Track DNA Analysis</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Track DNA data will be displayed here.
        </p>
      </div>
    </div>
  );
}
