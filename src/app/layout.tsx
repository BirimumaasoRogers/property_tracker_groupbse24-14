import type { Metadata } from "next";
import {Lato} from "next/font/google"
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/sonner";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Property Tracking System",
  description:
    "A comprehensive geofencing solution designed to help College students track their personal devices. The application allows users to set geofences, receive notifications when devices leave designated areas, and view real-time device locations on a user-friendly dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable}antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
