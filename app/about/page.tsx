import PageLayout from '@/components/layouts/PageLayout'
import Sidebar from '@/components/sections/about/Sidebar'
import HeroBanner from '@/components/sections/about/HeroBanner'
import StoryResponsibilities from '@/components/sections/about/StoryResponsibilities'
import StrengthsHowVision from '@/components/sections/about/StrengthsHowVision'
import { getPublishedPageSections } from '@/lib/content/public'
import { getPublicLegalLinks } from '@/lib/legal-links'

export default async function AboutPage() {
  const [sections, legalLinks] = await Promise.all([
    getPublishedPageSections('about'),
    getPublicLegalLinks(),
  ])
  const byKey = Object.fromEntries(sections.map((section) => [section.sectionKey, section]))
  const heroMeta = byKey.hero?.metaJson ? JSON.parse(byKey.hero.metaJson) : {}
  const sidebarMeta = byKey.reading_map?.metaJson ? JSON.parse(byKey.reading_map.metaJson) : {}

  return (
    <PageLayout legalLinks={legalLinks}>
      <div className="flex flex-col lg:flex-row border-l border-[#d5d5d5]">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <Sidebar
          dateLabel={byKey.reading_map?.bodyMd || undefined}
          heading={byKey.reading_map?.title || undefined}
          subheading={byKey.reading_map?.subtitle || undefined}
          navSections={sidebarMeta.panels || []}
        />

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          <HeroBanner
            title={byKey.hero?.title || undefined}
            subtitle={byKey.hero?.subtitle || undefined}
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
