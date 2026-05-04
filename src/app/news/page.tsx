import { NewsFeed } from "@/components/NewsFeed";

export default function NewsPage() {
  return (
    <div className="min-h-screen var(--bg-primary)">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <NewsFeed />
      </div>
    </div>
  );
}
