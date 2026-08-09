import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Bite Baithak — Every bite deserves a baithak",
  description:
    "Small-batch nankhatai, ghee cookies, jam rolls and namkeen, baked for the long unhurried sit-down.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      {/*
        NOTE: do not add `display: flex` to <body>. ScrollTrigger skips pin
        spacing entirely when a pinned element's parent is a flex container
        (see ScrollTrigger.js — "if the parent is display: flex, don't apply
        pinSpacing by default"), which silently breaks the BoxScene pin.
      */}
      <body className="min-h-full bg-espresso text-cream">{children}</body>
    </html>
  );
}
