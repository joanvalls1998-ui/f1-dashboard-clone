import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  themeColor: "#18181b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
