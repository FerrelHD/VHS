import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OLDTAPE • Analog CRT & VHS Archive",
  description: "Interactive 3D VHS Tape Carousel with Optical CRT Barrel Distortion and Procedural Patina.",
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

