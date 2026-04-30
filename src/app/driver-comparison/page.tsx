import { DriverComparison } from "@/components/DriverComparison";

export default function DriverComparisonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Comparison</h1>
        <p className="text-muted-foreground">
          Compare lap times between drivers.
        </p>
      </div>
      <DriverComparison />
    </div>
  );
}
