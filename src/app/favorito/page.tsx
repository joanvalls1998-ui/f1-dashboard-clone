import { FavoritoDashboard } from "@/components/FavoritoDashboard";

export default function FavoritoPage() {
  return (
    <div className="min-h-screen var(--bg-primary)">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <FavoritoDashboard />
      </div>
    </div>
  );
}
