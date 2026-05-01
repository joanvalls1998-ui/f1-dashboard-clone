import { DriverStatComparison } from "@/components/DriverStatComparison";

export default function DriverComparisonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Comparison</h1>
        <p className="text-muted-foreground">
          Compare drivers by their stats, photos, and championship positions.
        </p>
      </div>
      <DriverStatComparison />
    </div>
  );
}
