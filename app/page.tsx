import { getHomePageData } from '@/lib/content/page-data'
import HomePageClient from '@/components/HomePageClient'

export default async function Home() {
  const { featuredProjects, featuredAwards, featuredCertificates, legalLinks } = await getHomePageData()

  return (
    <HomePageClient
      featuredProjects={featuredProjects}
      featuredAwards={featuredAwards}
      featuredCertificates={featuredCertificates}
      legalLinks={legalLinks}
    />
  )
}
