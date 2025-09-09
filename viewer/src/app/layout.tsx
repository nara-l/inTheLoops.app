import type { Metadata } from "next";
import { Inter, Crimson_Pro, Bangers } from "next/font/google";
import "./globals.css";
import { ThemeApply } from "@/components/ThemeApply";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  display: "swap",
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InTheLoops  I looped you in!",
  description: "I saved you the best bits, so you dont scroll forever.",
  openGraph: {
    title: "InTheLoops  I looped you in!",
    description: "I saved you the best bits, so you dont scroll forever.",
    type: "website",
    images: ["https://intheloops.app/og/loop-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "InTheLoops  I looped you in!",
    description: "I saved you the best bits, so you dont scroll forever.",
    images: ["https://intheloops.app/og/loop-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimson.variable} ${bangers.variable} antialiased`}>
        {/* Apply DS theme classes based on ?mode=minimal2|retro2 */}
        <Suspense fallback={null}>
          <ThemeApply />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
