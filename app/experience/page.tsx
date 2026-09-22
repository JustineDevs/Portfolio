import { getExperiencePageData } from '@/lib/content/page-data'
import ExperiencePageClient from '@/components/ExperiencePageClient'

export default async function ExperiencePage() {
  const { legalLinks, progress, assets, profile, proofOfWork } = await getExperiencePageData()
  return <ExperiencePageClient legalLinks={legalLinks} progress={progress} assets={assets} profile={profile} proofOfWork={proofOfWork} />
}
