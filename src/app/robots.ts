import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/", // no indexar rutes API
      },
    ],
    sitemap: "https://f1-dashboard-clone.vercel.app/sitemap.xml",
    host: "https://f1-dashboard-clone.vercel.app",
  };
}
