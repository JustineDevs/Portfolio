import Navbar from '@/components/Navbar'
import HeroProjectHeader from '@/components/sections/project-showcase/HeroProjectHeader'
import ResponsibilitiesNetworks from '@/components/sections/project-showcase/ResponsibilitiesNetworks'
import DescriptionOtherProjects from '@/components/sections/project-showcase/DescriptionOtherProjects'
import GithubActivitySection from '@/components/sections/GithubActivitySection'
import Footer from '@/components/Footer'
import { getProjectDetailPageData } from '@/lib/content/page-data'
import { notFound } from 'next/navigation'

export default async function ProjectShowcasePage({ params }: { params: { slug: string } }) {
  const { project, otherProjects, legalLinks } = await getProjectDetailPageData(params.slug)
  
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
