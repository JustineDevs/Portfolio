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
  const sidebarMeta = byKey.sidebar_intro?.metaJson ? JSON.parse(byKey.sidebar_intro.metaJson) : {}
  const storyParagraphs = byKey.story?.bodyMd?.split(/\n\n+/).filter(Boolean) ?? []
  const responsibilitiesParagraphs =
    byKey.responsibilities?.bodyMd?.split(/\n\n+/).filter(Boolean) ?? []
  const strengthsBody = byKey.strengths?.bodyMd?.split(/\n\n+/).filter(Boolean) ?? []
  const thinkingBody = byKey.thinking?.bodyMd?.split(/\n\n+/).filter(Boolean) ?? []
  const visionBody = byKey.vision?.bodyMd?.split(/\n\n+/).filter(Boolean) ?? []

  return (
    <PageLayout legalLinks={legalLinks}>
      <div className="flex flex-col lg:flex-row border-l border-[#d5d5d5]">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <Sidebar
          dateLabel={byKey.sidebar_intro?.bodyMd || undefined}
          heading={byKey.sidebar_intro?.title || undefined}
          subheading={byKey.sidebar_intro?.subtitle || undefined}
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
            storyTitle={byKey.story?.title || undefined}
            storyParagraphs={storyParagraphs}
            responsibilitiesTitle={byKey.responsibilities?.title || undefined}
            responsibilitiesHeading={responsibilitiesParagraphs[0] || undefined}
            responsibilitiesParagraphs={responsibilitiesParagraphs.slice(1)}
          />
          <StrengthsHowVision
            strengthsTitle={byKey.strengths?.title || undefined}
            strengthsBody={strengthsBody}
            thinkingTitle={byKey.thinking?.title || undefined}
            thinkingBody={thinkingBody}
            visionTitle={byKey.vision?.title || undefined}
            visionBody={visionBody}
          />
        </div>
      </div>
    </PageLayout>
  )
}
