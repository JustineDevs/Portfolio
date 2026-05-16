import PageLayout from '@/components/layouts/PageLayout'
import Sidebar from '@/components/sections/about/Sidebar'
import HeroBanner from '@/components/sections/about/HeroBanner'
import StoryResponsibilities from '@/components/sections/about/StoryResponsibilities'
import StrengthsHowVision from '@/components/sections/about/StrengthsHowVision'
import { getAboutPageData } from '@/lib/content/page-data'

export default async function AboutPage() {
  const { byKey, heroMeta, sidebarMeta, recentPosts, legalLinks } = await getAboutPageData()

  return (
    <PageLayout legalLinks={legalLinks}>
      <div className="flex flex-col lg:flex-row border-l border-[#d5d5d5]">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <Sidebar
          dateLabel={byKey.reading_map?.bodyMd || undefined}
          heading={byKey.reading_map?.title || undefined}
          subheading={byKey.reading_map?.subtitle || undefined}
          navSections={sidebarMeta.panels || []}
          recentPosts={recentPosts}
        />

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          <HeroBanner
            title={byKey.hero?.title || undefined}
            subtitle={byKey.hero?.subtitle || undefined}
            bodyMarkdown={byKey.hero?.bodyMd || ""}
            imageUrl={heroMeta.imageUrl}
          />
          <StoryResponsibilities
            storyTitle={byKey.narrative?.title || undefined}
            storyMarkdown={byKey.narrative?.bodyMd || ""}
            responsibilitiesTitle={byKey.principles?.title || undefined}
            responsibilitiesMarkdown={byKey.principles?.bodyMd || ""}
          />
          <StrengthsHowVision
            strengthsTitle={byKey.learning?.title || undefined}
            strengthsMarkdown={byKey.learning?.bodyMd || ""}
            thinkingTitle={byKey.under_the_hood?.title || undefined}
            thinkingMarkdown={byKey.under_the_hood?.bodyMd || ""}
            visionTitle={byKey.north_star?.title || undefined}
            visionMarkdown={byKey.north_star?.bodyMd || ""}
          />
        </div>
      </div>
    </PageLayout>
  )
}
