"use client"

import PageLayout from '@/components/layouts/PageLayout'
import ProjectsHero from '@/components/sections/projects/ProjectsHero'
import ProjectsGrid from '@/components/sections/projects/ProjectsGrid'

export default function ProjectsPage() {
  return (
    <PageLayout>
      <ProjectsHero />
      <ProjectsGrid />
    </PageLayout>
  )
}
