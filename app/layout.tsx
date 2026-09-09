import type { Metadata } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ModeProvider } from "@/components/providers/ModeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import PageTransitionProvider from "@/components/providers/PageTransitionProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SkipToContent from "@/components/ui/SkipToContent";
import { Pointer } from "@/components/ui/pointer";
import PublicSocialBar from "@/components/layouts/PublicSocialBar";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JustineDevs Portfolio",
  description: "Portfolio website showcasing projects, experience, and skills",
  icons: {
    icon: "/JSTN Logo/SVG/Abstract Symbol - irisdecent.svg",
  },
  verification: {
    google: "Fh8-b3sHLQjvG_9EwOkXGj-JB1bZNaRWSalGGTyGB6Q",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = headers().get("host") || "";
  const isWorkSite = host.split(":")[0] === "work.jstn.site" || host.endsWith(":3001");

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${isWorkSite ? "work-site-html" : ""}`}>
      <body className={`${isWorkSite ? "work-site-root" : "cursor-none"} font-sans antialiased`}>
        <ErrorBoundary>
          <ModeProvider>
            <ToastProvider>
              <PageTransitionProvider>
                {!isWorkSite ? <Pointer /> : null}
                <SkipToContent />
                {!isWorkSite ? <PublicSocialBar /> : null}
                {isWorkSite ? (
                  children
                ) : (
                  <SmoothScrollProvider>{children}</SmoothScrollProvider>
                )}
                <Analytics />
              </PageTransitionProvider>
            </ToastProvider>
          </ModeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
