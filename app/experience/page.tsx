import dynamic from 'next/dynamic'

import { getPublicLegalLinks } from '@/lib/legal-links'

const ExperiencePageClient = dynamic(() => import('@/components/ExperiencePageClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#F8F8F8]" />,
})

export default async function ExperiencePage() {
  const legalLinks = await getPublicLegalLinks()
  return <ExperiencePageClient legalLinks={legalLinks} />
}
