import { getFeaturedAwardCards, getFeaturedCertificateCards, getPublishedProjects } from '@/lib/content/public'
import { getPublicLegalLinks } from '@/lib/legal-links'
import HomePageClient from '@/components/HomePageClient'

export default async function Home() {
  const [projects, awards, certificates, legalLinks] = await Promise.all([
    getPublishedProjects(),
    getFeaturedAwardCards(2),
    getFeaturedCertificateCards(3),
    getPublicLegalLinks(),
  ])

  return (
    <HomePageClient
      featuredProjects={projects.slice(0, 2)}
      featuredAwards={awards.slice(0, 2)}
      featuredCertificates={certificates}
      legalLinks={legalLinks}
    />
  )
}
