import dynamic from 'next/dynamic'
import { getPublishedAwards, getPublishedProjects } from '@/lib/content/public'
import { getPublicLegalLinks } from '@/lib/legal-links'

const HomePageClient = dynamic(() => import('@/components/HomePageClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#F8F8F8]" />,
})

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
