import { headers } from 'next/headers'
import { getExperiencePageData, getHomePageData } from '@/lib/content/page-data'
import HomePageClient from '@/components/HomePageClient'
import HorizontalScrollPage from '@/components/HorizontalScrollPage'

export default async function Home() {
  const host = headers().get("host") || ""
  const isWorkSite = host.split(":")[0] === "work.jstn.site" || host.endsWith(":3001")

  if (isWorkSite) {
    const { proofOfWork } = await getExperiencePageData()
    return <HorizontalScrollPage workData={proofOfWork} />
  }

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
