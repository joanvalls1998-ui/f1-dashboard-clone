export default function RacePacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Race Pace</h1>
        <p className="text-muted-foreground">
          Race pace analysis showing lap times and performance during the race.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          Race pace data available during live sessions via OpenF1 API.
        </p>
      </div>
    </div>
  );
}
