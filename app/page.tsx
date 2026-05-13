import { getPublishedAwards, getPublishedProjects } from '@/lib/content/public'
import { getPublicLegalLinks } from '@/lib/legal-links'
import HomePageClient from '@/components/HomePageClient'

export default async function Home() {
  const [projects, awards, legalLinks] = await Promise.all([
    getPublishedProjects(),
    getPublishedAwards(),
    getPublicLegalLinks(),
  ])

  return (
    <HomePageClient
      featuredProjects={projects.slice(0, 2)}
      featuredAwards={awards.slice(0, 2)}
      legalLinks={legalLinks}
    />
  )
}
