import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SocialLinksBar from '@/components/ui/SocialLinksBar'
import AsciiBackground from '@/components/ui/AsciiBackground'
import type { PublicLegalLinks } from '@/lib/legal-links-shared'

interface PageLayoutProps {
  children: React.ReactNode
  legalLinks?: PublicLegalLinks
}

export default function PageLayout({ children, legalLinks }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F8] relative overflow-x-hidden">
      <AsciiBackground />
      
      <SocialLinksBar />
      <Navbar />

      <main id="main-content" className="w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] 3xl:max-w-[1600px] mx-auto pb-4 xs:pb-6 sm:pb-8 relative z-10 overflow-x-hidden">
        {children}
        <Footer legalLinks={legalLinks} />
      </main>
    </div>
  )
}
