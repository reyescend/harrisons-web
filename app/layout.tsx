import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harrisonministries.org"),
  title: {
    default: "Carter & Tori Harrison",
    template: "%s | Harrison Ministries",
  },
  description: "Worship leaders, speakers, and ministers passionate about helping people encounter Jesus and walk in His purpose.",
  alternates: {
    canonical: "https://harrisonministries.org",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Ministry",
  creator: "Harrison Ministries",
  publisher: "Harrison Ministries",
  themeColor: "#0B0B0B",
  icons: {
    icon: "/websiteicon.png",
    shortcut: "/websiteicon.png",
    apple: "/websiteicon.png",
  },
  openGraph: {
    title: "Carter & Tori Harrison",
    description: "Worship • Teaching • Ministry",
    url: "https://harrisonministries.org",
    siteName: "Harrison Ministries",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Carter & Tori Harrison",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carter & Tori Harrison",
    description: "Worship • Teaching • Ministry",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/hero.jpg.png" />
        <link rel="preload" as="image" href="/verticalhero.png" media="(max-width: 767px)" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
