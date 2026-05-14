import { getExperiencePageData } from '@/lib/content/page-data'
import ExperiencePageClient from '@/components/ExperiencePageClient'

export default async function ExperiencePage() {
  const { legalLinks, proofOfWork } = await getExperiencePageData()
  return <ExperiencePageClient legalLinks={legalLinks} proofOfWork={proofOfWork} />
}
