import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import PageLayout from '@/components/layouts/PageLayout'
import ProjectsGrid from '@/components/sections/projects/ProjectsGrid'
import { getProjectsPageData } from '@/lib/content/page-data'
import { isProductionWorkSiteHost, isWorkSiteHost } from '@/lib/site-host'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Projects — AI Agents, Blockchain & Developer Tools',
  description: 'Explore Justine Lupasi\'s software projects across AI agents, blockchain infrastructure, smart-contract tooling, and practical web products.',
  path: '/projects',
  keywords: ['AI agent developer portfolio', 'blockchain developer portfolio', 'smart contract developer', 'developer tools'],
})

export default async function ProjectsPage() {
  const host = headers().get('host') || ''
  const isWorkSite = isWorkSiteHost(host)

  if (isWorkSite && !isProductionWorkSiteHost(host)) {
    redirect('http://localhost:3000/projects')
  }

  const { projects, legalLinks } = await getProjectsPageData()
  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <ProjectsGrid projects={projects} />
    </PageLayout>
  )
}
