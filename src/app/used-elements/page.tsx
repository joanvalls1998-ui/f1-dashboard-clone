import { Wrench } from "lucide-react";

export default function UsedElementsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Used Elements</h1>
        <p className="text-muted-foreground">
          Track evolution and used elements throughout the season.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Wrench className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold">Used Elements Analysis</h2>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Used elements data will be displayed here.
        </p>
      </div>
    </div>
  );
}
