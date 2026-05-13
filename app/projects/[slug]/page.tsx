import Navbar from '@/components/Navbar'
import HeroProjectHeader from '@/components/sections/project-showcase/HeroProjectHeader'
import ResponsibilitiesNetworks from '@/components/sections/project-showcase/ResponsibilitiesNetworks'
import DescriptionOtherProjects from '@/components/sections/project-showcase/DescriptionOtherProjects'
import GithubActivitySection from '@/components/sections/GithubActivitySection'
import Footer from '@/components/Footer'
import { getOtherPublishedProjects, getPublishedProjectBySlug } from '@/lib/content/public'
import { getPublicLegalLinks } from '@/lib/legal-links'
import { notFound } from 'next/navigation'

export default async function ProjectShowcasePage({ params }: { params: { slug: string } }) {
  const [project, otherProjects, legalLinks] = await Promise.all([
    getPublishedProjectBySlug(params.slug),
    getOtherPublishedProjects(params.slug, 2),
    getPublicLegalLinks(),
  ])
  
  if (!project) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        <HeroProjectHeader project={project} />
        <ResponsibilitiesNetworks project={project} />
        <DescriptionOtherProjects project={project} otherProjects={otherProjects} />
        <div className="max-w-7xl mx-auto">
          <GithubActivitySection />
        </div>
      </main>
      <Footer legalLinks={legalLinks} />
    </>
  )
}
