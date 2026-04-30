import { Bomb } from "lucide-react";

export default function DestructorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Destructors Championship</h1>
        <p className="text-muted-foreground">
          Championship for drivers with the most incidents and retirements.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Bomb className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold">Destructors Leaderboard</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Destructors data will be displayed here.
        </p>
      </div>
    </div>
  );
}
