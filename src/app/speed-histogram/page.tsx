import { SpeedHistogram } from "@/components/SpeedHistogram";

export default function SpeedHistogramPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Speed Histogram</h1>
        <p className="text-muted-foreground">
          Speed distribution analysis.
        </p>
      </div>
      <SpeedHistogram />
    </div>
  );
}
