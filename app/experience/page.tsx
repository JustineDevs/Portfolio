import { getPublicLegalLinks } from '@/lib/legal-links'
import ExperiencePageClient from '@/components/ExperiencePageClient'

export default async function ExperiencePage() {
  const legalLinks = await getPublicLegalLinks()
  return <ExperiencePageClient legalLinks={legalLinks} />
}
