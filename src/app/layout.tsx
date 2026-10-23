import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OLDTAPE • Analog CRT & VHS Archive",
  description: "Interactive 3D VHS Tape Carousel with Optical CRT Barrel Distortion and Procedural Patina.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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

