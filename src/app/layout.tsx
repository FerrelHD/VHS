import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vhs-portfolio.vercel.app"
  ),
  title: "OLDTAPE • Analog CRT & VHS Archive",
  description: "Interactive 3D VHS Tape Carousel with Optical CRT Barrel Distortion and Procedural Patina by Ferrel Rashad Akeyla.",
  authors: [{ name: "Ferrel Rashad Akeyla", url: "https://github.com/FerrelHD" }],
  creator: "Ferrel Rashad Akeyla",
  publisher: "Ferrel Rashad Akeyla",
  keywords: [
    "Cyberpunk Edgerunners",
    "VHS Archive",
    "Three.js",
    "CRT Shader",
    "Analog Portfolio",
    "Creative Developer",
    "Ferrel Rashad Akeyla",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "OLDTAPE • Analog CRT & VHS Archive",
    title: "OLDTAPE • Analog CRT & VHS Archive",
    description: "Interactive 3D VHS Tape Carousel with Optical CRT Barrel Distortion and Procedural Patina.",
    images: [
      {
        url: "/tapes/ep-01-front.webp",
        width: 1200,
        height: 630,
        alt: "OLDTAPE Cyberpunk Edgerunners VHS Tape Carousel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OLDTAPE • Analog CRT & VHS Archive",
    description: "Interactive 3D VHS Tape Carousel with Optical CRT Barrel Distortion and Procedural Patina.",
    creator: "@FerrelHD",
    images: ["/tapes/ep-01-front.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full bg-crt-dark overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}

