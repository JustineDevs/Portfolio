import LegalPage from '@/components/LegalPage'
import { getPublicLegalLinks } from '@/lib/legal-links'
import { getLegalPageData } from '@/lib/content/legal-page-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'License | JustineDevs portfolio',
  description: 'GNU General Public License v3.0 for the JustineDevs portfolio project.',
  path: '/license',
})

export default async function LicensePage() {
  const [legalLinks, content] = await Promise.all([getPublicLegalLinks(), getLegalPageData("license")])
  return <LegalPage {...content} legalLinks={legalLinks} />
}
