import EngineerDashboard from "@/components/EngineerDashboard";

export default function EngineerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <EngineerDashboard />
      </div>
    </div>
  );
}
