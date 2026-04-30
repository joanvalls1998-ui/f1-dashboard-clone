import { Weather } from "@/components/Weather";

export default function WeatherPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Weather</h1>
        <p className="text-muted-foreground">
          Live weather conditions and track status.
        </p>
      </div>
      <Weather />
    </div>
  );
}
