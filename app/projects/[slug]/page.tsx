import Navbar from '@/components/Navbar'
import HeroProjectHeader from '@/components/sections/project-showcase/HeroProjectHeader'
import ResponsibilitiesNetworks from '@/components/sections/project-showcase/ResponsibilitiesNetworks'
import DescriptionOtherProjects from '@/components/sections/project-showcase/DescriptionOtherProjects'
import ActivitySection from '@/components/sections/ActivitySection'
import Footer from '@/components/Footer'
import { getProjectBySlug, getAllProjects } from '@/lib/projects'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectShowcasePage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  
  if (!project) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        <HeroProjectHeader slug={params.slug} />
        <ResponsibilitiesNetworks slug={params.slug} />
        <DescriptionOtherProjects slug={params.slug} />
        <div className="max-w-7xl mx-auto">
          <ActivitySection />
        </div>
      </main>
      <Footer />
    </>
  )
}
