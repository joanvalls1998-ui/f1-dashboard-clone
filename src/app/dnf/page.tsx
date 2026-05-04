import { DNFTracker } from "@/components/DNFTracker";

export default function DnfPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>DNF Tracker</h1>
        <p className="text-gray-400">
          Retirements and non-finishers.
        </p>
      </div>
      <DNFTracker />
    </div>
  );
}
