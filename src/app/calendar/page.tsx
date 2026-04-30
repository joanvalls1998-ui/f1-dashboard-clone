import { RaceCalendar } from "@/components/RaceCalendar";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Race Calendar</h1>
        <p className="text-muted-foreground">
          Complete Formula 1 race calendar for 2024 season.
        </p>
      </div>
      <RaceCalendar />
    </div>
  );
}
