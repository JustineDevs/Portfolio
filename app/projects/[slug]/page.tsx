import HeroProjectHeader from '@/components/sections/project-showcase/HeroProjectHeader'
import ResponsibilitiesNetworks from '@/components/sections/project-showcase/ResponsibilitiesNetworks'
import DescriptionOtherProjects from '@/components/sections/project-showcase/DescriptionOtherProjects'
import PageLayout from '@/components/layouts/PageLayout'
import { getProjectDetailPageData } from '@/lib/content/page-data'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProjectShowcasePage({ params }: { params: { slug: string } }) {
  const host = headers().get('host') || ''
  const isWorkSite = host.split(':')[0] === 'work.jstn.site' || host.endsWith(':3001')

  if (isWorkSite) {
    redirect(`http://localhost:3000/projects/${params.slug}`)
  }

  const { project, otherProjects, legalLinks } = await getProjectDetailPageData(params.slug)
  
  if (!project) {
    notFound()
  }

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <main className="bg-[#F8FAFC]">
        <HeroProjectHeader project={project} />
        <DescriptionOtherProjects project={project} />
        <ResponsibilitiesNetworks project={project} otherProjects={otherProjects} />
      </main>
    </PageLayout>
  )
}
