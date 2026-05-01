"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ExternalLink, Clock, Star, Filter } from "lucide-react";

const RSS_URL =
  "https://news.google.com/rss/search?q=F1+formula+1&hl=es&gl=ES&ceid=ES:es";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

interface FeedData {
  items: NewsItem[];
  lastUpdated: Date;
}

const DRIVER_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "verstappen", label: "Verstappen" },
  { key: "norris", label: "Norris" },
  { key: "leclerc", label: "Leclerc" },
  { key: "hamilton", label: "Hamilton" },
  { key: "piastri", label: "Piastri" },
  { key: "russell", label: "Russell" },
  { key: "alonso", label: "Alonso" },
  { key: "sainz", label: "Sainz" },
];

function parseRSS(xml: string): NewsItem[] {
  if (typeof window === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = doc.querySelectorAll("item");

  return Array.from(items).map((item) => {
    const titleEl = item.querySelector("title");
    const linkEl = item.querySelector("link");
    const pubDateEl = item.querySelector("pubDate");
    const sourceEl = item.querySelector("source");

    // Extract source name
    let source = "Google News";
    if (sourceEl) {
      source = sourceEl.textContent || "Google News";
    } else if (item.getAttribute("source")) {
      source = item.getAttribute("source") || "Google News";
    }

    return {
      title: titleEl?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || "",
      link: linkEl?.textContent || "",
      pubDate: pubDateEl?.textContent || "",
      source,
    };
  });
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function matchesDriverFilter(title: string, filter: string): boolean {
  if (filter === "all") return true;
  const normalizedTitle = title.toLowerCase();
  return normalizedTitle.includes(filter.toLowerCase());
}

export function NewsFeed() {
  const [feed, setFeed] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverFilter, setDriverFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/news?url=${encodeURIComponent(RSS_URL)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }

      const xml = await response.text();
      const items = parseRSS(xml);

      setFeed({ items, lastUpdated: new Date() });
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filteredItems = feed?.items.filter((item) =>
    matchesDriverFilter(item.title, driverFilter)
  ) || [];

  const featuredItem = filteredItems[0];
  const quickHeadlines = filteredItems.slice(1, 8);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Noticias F1</h2>
          {lastRefresh && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(lastRefresh.toISOString())}
            </span>
          )}
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
          aria-label="Actualizar noticias"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Driver Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex gap-2">
          {DRIVER_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setDriverFilter(filter.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                driverFilter === filter.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {filter.key === "all" && <Star className="w-3 h-3 inline mr-1" />}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={fetchNews}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && !feed && (
        <div className="space-y-3">
          <div className="h-32 rounded-lg bg-muted animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Featured Headline */}
      {featuredItem && !loading && (
        <a
          href={featuredItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Destacado
              </span>
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {featuredItem.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{featuredItem.source}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(featuredItem.pubDate)}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
          </div>
        </a>
      )}

      {/* Quick Headlines */}
      {quickHeadlines.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Últimas noticias
          </h4>
          <div className="space-y-1">
            {quickHeadlines.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <span className="text-muted-foreground text-xs font-medium mt-0.5 w-4">
                  {index + 2}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <span className="truncate">{item.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(item.pubDate)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No hay noticias para el filtro seleccionado.</p>
        </div>
      )}

      {/* Footer */}
      {feed && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          Fuente: Google News • Actualización automática cada 5 minutos
        </p>
      )}
    </div>
  );
}
