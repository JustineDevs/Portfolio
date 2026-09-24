import { headers } from 'next/headers'
import dynamic from 'next/dynamic'
import { isWorkSiteHost } from '@/lib/site-host'
import JsonLd from '@/components/seo/JsonLd'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'
import { getHomePageData } from '@/lib/content/home-page-data'

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

  const homePageData = await getHomePageData()

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/"), description: "Portfolio of Justine Lupasi, a software developer building AI agents and blockchain infrastructure." },
          { "@type": "Person", name: "Justine Lupasi", url: absoluteUrl("/about"), jobTitle: "Software Developer", address: { "@type": "PostalAddress", addressCountry: "PH" }, sameAs: ["https://github.com/JustineDevs", "https://www.linkedin.com/in/justine-lupasi-444608295/"] },
        ],
      }} />
      {/*
       * This no-JavaScript fallback gives crawlers and link unfurlers a real
       * heading and concise description while the interactive portfolio
       * entry experience hydrates. HomeEntry removes it after hydration.
       */}
      <section id="home-seo-fallback" className="home-seo-fallback" aria-label="Portfolio introduction">
        <h1>Justine Lupasi — software developer building AI agents and blockchain products</h1>
        <p>Explore Justine Lupasi&apos;s portfolio of AI-native agents, blockchain infrastructure, developer tools, and practical web products from Metro Manila, Philippines.</p>
        <nav aria-label="Portfolio sections">
          <a href="/about">About</a>
          <a href="/projects">Projects</a>
          <a href="/experience">Experience</a>
          <a href="/blog">Writing</a>
        </nav>
      </section>
      <HomeEntry initialData={homePageData} />
    </>
  )
}
