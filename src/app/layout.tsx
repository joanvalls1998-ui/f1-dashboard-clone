import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import { JsonLdScript } from "@/components/JsonLdScript";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://f1-dashboard-clone.vercel.app"),
  title: "F1 Dashboard - Classificacions, Calendari i Estadístiques",
  description:
    "Explora les classificacions de la Fórmula 1, calendari de curses, estadístiques de pilots i equips, cronometratge en directe i molt més.",
  keywords: [
    "F1",
    "Fórmula 1",
    "classificació",
    "calendari",
    "pilots",
    "equips",
    "curses",
    "resulats",
  ],
  authors: [{ name: "Joan Valls" }],
  openGraph: {
    title: "F1 Dashboard - Classificacions, Calendari i Estadístiques",
    description:
      "Les millors estadístiques i dades de la Fórmula 1 en temps real.",
    url: "https://f1-dashboard-clone.vercel.app",
    siteName: "F1 Dashboard",
    locale: "ca_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "F1 Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "F1 Dashboard - Classificacions, Calendari i Estadístiques",
    description:
      "Les millors estadístiques i dades de la Fórmula 1 en temps real.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://f1-dashboard-clone.vercel.app",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f11" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className="dark" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] bg-[var(--bg-base)] text-[var(--text-primary)]`}
      >
        <SidebarWrapper>{children}</SidebarWrapper>
        <JsonLdScript />
      </body>
    </html>
  );
}
