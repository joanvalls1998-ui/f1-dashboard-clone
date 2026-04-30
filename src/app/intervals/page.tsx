import { Intervals } from "@/components/Intervals";

export default function IntervalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Intervals</h1>
        <p className="text-muted-foreground">
          Time gaps between drivers.
        </p>
      </div>
      <Intervals />
    </div>
  );
}
