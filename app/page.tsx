import { headers } from 'next/headers'
import dynamic from 'next/dynamic'
import { isWorkSiteHost } from '@/lib/site-host'
import JsonLd from '@/components/seo/JsonLd'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'

// The work microsite is a separate experience. Keep its large horizontal-scroll
// bundle out of the primary portfolio route's eager import graph.
const HorizontalScrollPage = dynamic(() => import('@/components/HorizontalScrollPage'))
const HomeEntry = dynamic(() => import('@/components/HomeEntry'), { ssr: false })

export default async function Home() {
  const host = headers().get("host") || ""
  const isWorkSite = isWorkSiteHost(host)

  if (isWorkSite) {
    const { getExperiencePageData } = await import('@/lib/content/page-data')
    const { proofOfWork } = await getExperiencePageData()
    return (
      <>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") }} />
        <HorizontalScrollPage workData={proofOfWork} />
      </>
    )
  }

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/"), description: "Portfolio of Justine Lupasi, a software developer building AI agents and blockchain infrastructure." },
          { "@type": "Person", name: "Justine Lupasi", url: absoluteUrl("/about"), jobTitle: "Software Developer", address: { "@type": "PostalAddress", addressCountry: "PH" }, sameAs: ["https://github.com/JustineDevs", "https://www.linkedin.com/in/justine-lupasi-444608295/"] },
        ],
      }} />
      <HomeEntry />
    </>
  )
}
