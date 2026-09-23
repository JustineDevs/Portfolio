import type { Metadata } from 'next'
import { getExperiencePageData } from '@/lib/content/page-data'
import ExperiencePageClient from '@/components/ExperiencePageClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Experience — AI, Blockchain & Software Development',
  description: 'A record of Justine Lupasi\'s experience building AI agents, blockchain infrastructure, developer tools, and production web products.',
  path: '/experience',
  keywords: ['software developer experience', 'AI agent developer', 'blockchain developer Philippines', 'developer tools'],
})

export default async function ExperiencePage() {
  const { legalLinks, progress, assets, profile, proofOfWork } = await getExperiencePageData()
  return <ExperiencePageClient legalLinks={legalLinks} progress={progress} assets={assets} profile={profile} proofOfWork={proofOfWork} />
}
