import { NewsFeed } from "@/components/NewsFeed";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#090909]">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <NewsFeed />
      </div>
    </div>
  );
}
