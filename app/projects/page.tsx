import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import PageLayout from '@/components/layouts/PageLayout'
import ProjectsHero from '@/components/sections/projects/ProjectsHero'
import ProjectsGrid from '@/components/sections/projects/ProjectsGrid'
import { getProjectsPageData } from '@/lib/content/page-data'

export default async function ProjectsPage() {
  const host = headers().get('host') || ''
  const isWorkSite = host.split(':')[0] === 'work.jstn.site' || host.endsWith(':3001')

  if (isWorkSite) {
    redirect('http://localhost:3000/projects')
  }

  const { projects, legalLinks } = await getProjectsPageData()
  return (
    <PageLayout legalLinks={legalLinks}>
      <ProjectsHero />
      <ProjectsGrid projects={projects} />
    </PageLayout>
  )
}
