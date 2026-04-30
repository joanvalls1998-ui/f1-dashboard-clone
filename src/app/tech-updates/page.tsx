import { Wrench } from "lucide-react";

export default function TechUpdatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tech Updates</h1>
        <p className="text-muted-foreground">
          Technical updates and aerodynamic developments from teams.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Wrench className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold">Latest Technical Updates</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Technical update data will be displayed here.
        </p>
      </div>
    </div>
  );
}
