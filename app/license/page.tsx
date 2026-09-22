import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { getPublicLegalLinks } from '@/lib/legal-links'
import { getLegalPageData } from '@/lib/content/legal-page-data'

export const metadata: Metadata = {
  title: 'License | JustineDevs Portfolio',
  description: 'GNU General Public License v3.0 for this project',
}

export default async function LicensePage() {
  const [legalLinks, content] = await Promise.all([getPublicLegalLinks(), getLegalPageData("license")])
  return <LegalPage {...content} legalLinks={legalLinks} />
}
