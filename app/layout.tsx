import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ModeProvider } from '@/components/providers/ModeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import PageTransitionProvider from '@/components/providers/PageTransitionProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import SkipToContent from '@/components/ui/SkipToContent';
import PixelCursor from '@/components/ui/PixelCursor';
import './globals.css'

export const metadata: Metadata = {
  title: 'JustineDevs Portfolio',
  description: 'Portfolio website showcasing projects, experience, and skills',
  icons: {
    icon: '/JSTN Logo/SVG/Abstract Symbol - irisdecent.svg',
  },
  verification: {
    google: 'Fh8-b3sHLQjvG_9EwOkXGj-JB1bZNaRWSalGGTyGB6Q',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
<body className="font-sans antialiased cursor-none">
          <ErrorBoundary>
            <ModeProvider>
              <SmoothScrollProvider>
                <ToastProvider>
                  <PageTransitionProvider>
                    <PixelCursor />
                    <SkipToContent />
                    {children}
                  </PageTransitionProvider>
                </ToastProvider>
              </SmoothScrollProvider>
            </ModeProvider>
          </ErrorBoundary>
          <Analytics />
          <SpeedInsights />
        </body>
    </html>
  )
}
