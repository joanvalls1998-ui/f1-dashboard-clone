import { Swords } from "lucide-react";

export default function HeadToHeadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Head To Head</h1>
        <p className="text-muted-foreground">
          Teammate head-to-head qualifying and race comparisons.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Swords className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold">Head-to-Head Battles</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Head-to-head data will be displayed here.
        </p>
      </div>
    </div>
  );
}
