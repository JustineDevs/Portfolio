import PageLayout from '@/components/layouts/PageLayout'
import ProjectsHero from '@/components/sections/projects/ProjectsHero'
import ProjectsGrid from '@/components/sections/projects/ProjectsGrid'
import { getPublishedProjects } from '@/lib/content/public'
import { getPublicLegalLinks } from '@/lib/legal-links'

export default async function ProjectsPage() {
  const [projects, legalLinks] = await Promise.all([getPublishedProjects(), getPublicLegalLinks()])
  return (
    <PageLayout legalLinks={legalLinks}>
      <ProjectsHero />
      <ProjectsGrid projects={projects} />
    </PageLayout>
  )
}
