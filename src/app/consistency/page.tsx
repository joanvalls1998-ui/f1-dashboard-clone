import { Activity } from "lucide-react";

export default function ConsistencyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Consistency</h1>
        <p className="text-muted-foreground">
          Driver consistency analysis throughout the season.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Activity className="w-6 h-6 text-cyan-500" />
          <h2 className="text-xl font-semibold">Consistency Metrics</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Consistency data will be displayed here.
        </p>
      </div>
    </div>
  );
}
