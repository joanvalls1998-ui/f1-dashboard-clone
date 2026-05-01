export default function PitStopsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pit Stop Times</h1>
        <p className="text-muted-foreground">
          Historical and live pit stop data for all drivers.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          Pit stop data available during live sessions via OpenF1 API.
        </p>
      </div>
    </div>
  );
}
