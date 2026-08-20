import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getThemeInitScript } from "@/lib/theme";
import { CommandPalette } from "@/components/search/CommandPalette";
import { buildSearchIndex } from "@/lib/search-index";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif for hero/H1-scale headings only — gives the site a distinct,
// "designed" identity instead of reading as a stock shadcn scaffold, and
// leans into the "textbook" positioning.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: {
    default: "System Design Prep",
    template: "%s · System Design Prep",
  },
  description: "A personal system design textbook and interview trainer — Hinglish explanations, Indian-context examples, and interview-ready answers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const searchDocs = buildSearchIndex();

  return (
    <html
      lang="en"
      // The init script below sets the "dark" class before hydration runs,
      // which will not match this server-rendered markup (which has no
      // theme class at all) — that's expected, not a bug, so we silence
      // React's hydration warning for just this attribute.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider delay={200}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CommandPalette docs={searchDocs} />
        </TooltipProvider>
      </body>
    </html>
  );
}
