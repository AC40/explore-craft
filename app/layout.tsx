import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Image from "next/image";

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
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Explore Craft API - Document Management",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Craft API - Get Document IDs Quickly",
    description:
      "Get document IDs quickly. A local-first browser application to explore your Craft workspace through the Craft API.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Explore Craft API - Document Management",
      },
    ],
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
    icon: [
      { url: "/fav.png", type: "image/png" },
      { url: "/fav.png", sizes: "32x32", type: "image/png" },
      { url: "/fav.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/fav.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/fav.png",
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
        <div className="relative min-h-screen overflow-hidden bg-white">
          {/* Orange blob decorations */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[700px] opacity-80 pointer-events-none z-0">
            <Image
              src="/orange-blob.png"
              alt=""
              width={700}
              height={700}
              className="w-full h-full opacity-50"
              priority
            />
          </div>
          <div className="fixed top-1/2 right-0 translate-x-1/4 -translate-y-1/3 w-[600px] h-[600px] opacity-60 pointer-events-none z-0">
            <Image
              src="/orange-blob.png"
              alt=""
              width={600}
              height={600}
              className="w-full h-full opacity-50"
            />
          </div>

          <div className="relative z-10">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
