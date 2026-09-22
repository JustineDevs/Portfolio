import type { Metadata } from 'next'

import PageLayout from '@/components/layouts/PageLayout'
import ChangelogPageContent from '@/components/sections/ChangelogPageContent'
import { getPublicLegalLinks } from '@/lib/legal-links'

export const metadata: Metadata = {
  title: 'Changelog | JSTN',
  description: 'Release notes and product updates from the JSTN V2 portfolio.',
}

export default async function ChangelogPage() {
  const legalLinks = await getPublicLegalLinks()

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <ChangelogPageContent />
    </PageLayout>
  )
}
