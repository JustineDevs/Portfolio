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
import { TooltipProvider } from "@/components/ui/tooltip";
import UnderConstructionPage from "@/components/UnderConstructionPage";
import { isProductionWorkSiteHost, isWorkSiteHost } from "@/lib/site-host";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Justine Lupasi",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Justine Lupasi", url: "https://github.com/JustineDevs" }],
  creator: "Justine Lupasi",
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_PH",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: SOCIAL_IMAGE, alt: "JSTN — Justine Lupasi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
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
  const isWorkSite = isWorkSiteHost(host);
  const isWorkSiteUnderConstruction = isProductionWorkSiteHost(host);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${isWorkSite ? "work-site-html" : ""}`}>
      <body className={`${isWorkSite ? "work-site-root" : "cursor-none"} font-sans antialiased`}>
        <TooltipProvider>
        <ErrorBoundary>
          <ModeProvider>
            <ToastProvider>
              <PageTransitionProvider>
                {!isWorkSite ? <Pointer /> : null}
                <SkipToContent />
                {!isWorkSite ? <PublicSocialBar /> : null}
                {isWorkSiteUnderConstruction ? <UnderConstructionPage /> : (
                  <SmoothScrollProvider>{children}</SmoothScrollProvider>
                )}
                <Analytics />
              </PageTransitionProvider>
            </ToastProvider>
          </ModeProvider>
        </ErrorBoundary>
        </TooltipProvider>
      </body>
    </html>
  );
}
