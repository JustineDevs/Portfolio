import PageLayout from '@/components/layouts/PageLayout'
import ProjectsHero from '@/components/sections/projects/ProjectsHero'
import ProjectsGrid from '@/components/sections/projects/ProjectsGrid'
import { getProjectsPageData } from '@/lib/content/page-data'

export default async function ProjectsPage() {
  const { projects, legalLinks } = await getProjectsPageData()
  return (
    <PageLayout legalLinks={legalLinks}>
      <ProjectsHero />
      <ProjectsGrid projects={projects} />
    </PageLayout>
  )
}
