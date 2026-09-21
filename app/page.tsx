import { headers } from 'next/headers'
import dynamic from 'next/dynamic'

// The work microsite is a separate experience. Keep its large horizontal-scroll
// bundle out of the primary portfolio route's eager import graph.
const HorizontalScrollPage = dynamic(() => import('@/components/HorizontalScrollPage'))
const HomeEntry = dynamic(() => import('@/components/HomeEntry'), { ssr: false })

export default async function Home() {
  const host = headers().get("host") || ""
  const isWorkSite = host.split(":")[0] === "work.jstn.site" || host.endsWith(":3001")

  if (isWorkSite) {
    const { getExperiencePageData } = await import('@/lib/content/page-data')
    const { proofOfWork } = await getExperiencePageData()
    return <HorizontalScrollPage workData={proofOfWork} />
  }

  return <HomeEntry />
}
