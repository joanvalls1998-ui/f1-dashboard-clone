import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://f1-dashboard-clone.vercel.app";

  const routes = [
    "",
    "calendar",
    "constructors",
    "destructors",
    "dnf",
    "driver-comparison",
    "driver-stats",
    "drivers",
    "engineer",
    "favorito",
    "head-to-head",
    "home-intel",
    "intervals",
    "live",
    "news",
    "pit-stops",
    "predictions",
    "qualifying",
    "race-history",
    "race-mode",
    "race-pace",
    "season-stats",
    "sector-times",
    "speed-histogram",
    "speed-trap",
    "standings",
    "starting-grid",
    "teams",
    "tech-updates",
    "track-dna",
    "track-map",
    "tyre-strategy",
    "used-elements",
    "weather",
    "consistency",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
