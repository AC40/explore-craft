import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Explore Craft API - Get Document IDs Quickly",
  description:
    "Get document IDs quickly. A local-first browser application to explore your Craft workspace through the Craft API. Everything runs in your browser—no data ever leaves your device.",
  keywords: [
    "Craft",
    "Craft API",
    "document IDs",
    "local-first",
    "browser application",
    "workspace explorer",
    "privacy",
  ],
  authors: [{ name: "Aaron Richter", url: "https://aaronrichter.tech" }],
  creator: "Aaron Richter",
  publisher: "Aaron Richter",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://explore-craft.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Explore Craft API",
    title: "Explore Craft API - Get Document IDs Quickly",
    description:
      "Get document IDs quickly. A local-first browser application to explore your Craft workspace through the Craft API. Everything runs in your browser—no data ever leaves your device.",
    images: [
      {
        url: "/img/get-document-ids.png",
        width: 1200,
        height: 630,
        alt: "Explore Craft API - Document Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Craft API - Get Document IDs Quickly",
    description:
      "Get document IDs quickly. A local-first browser application to explore your Craft workspace through the Craft API.",
    images: ["/img/get-document-ids.png"],
    creator: "@aaronrichter",
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
  alternates: {
    canonical: "/",
  },
  category: "productivity",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
