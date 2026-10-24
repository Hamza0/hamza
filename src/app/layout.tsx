import Navbar from "@/components/navbar";
import { AnalyticsPreferences } from "@/components/analytics-preferences";
import { ContactProvider } from "@/components/contact-provider";
import { contactFormAvailable } from "@/lib/contact/config";
import fs from "node:fs";
import path from "node:path";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { SOCIAL_PREVIEW } from "@/lib/social-metadata";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const analyticsPaths = ["/", "/projects/production-operations-platform", "/blog", "/privacy", ...fs.readdirSync(path.join(process.cwd(), "content")).filter(file => file.endsWith(".mdx")).map(file => `/blog/${file.slice(0, -4)}`)];

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: SOCIAL_PREVIEW.title,
    template: `%s | ${DATA.name}`,
  },
  description: SOCIAL_PREVIEW.description,
  openGraph: {
    title: SOCIAL_PREVIEW.title,
    description: SOCIAL_PREVIEW.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_CA",
    type: "website",
    images: [SOCIAL_PREVIEW.image],
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
  twitter: {
    title: SOCIAL_PREVIEW.title,
    description: SOCIAL_PREVIEW.description,
    card: "summary_large_image",
    images: [SOCIAL_PREVIEW.image],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <ContactProvider available={contactFormAvailable()}>
            <div className="max-w-2xl mx-auto py-12 sm:py-24 px-6">
            {children}
            <Navbar />
            <AnalyticsPreferences production={process.env.NODE_ENV === "production" && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production")} paths={analyticsPaths} />
            </div>
            </ContactProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
