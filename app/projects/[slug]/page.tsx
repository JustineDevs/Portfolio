import type { Metadata } from 'next'
import HeroProjectHeader from '@/components/sections/project-showcase/HeroProjectHeader'
import ResponsibilitiesNetworks from '@/components/sections/project-showcase/ResponsibilitiesNetworks'
import DescriptionOtherProjects from '@/components/sections/project-showcase/DescriptionOtherProjects'
import PageLayout from '@/components/layouts/PageLayout'
import { getProjectDetailPageData } from '@/lib/content/page-data'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isProductionWorkSiteHost, isWorkSiteHost } from '@/lib/site-host'
import JsonLd from '@/components/seo/JsonLd'
import { absoluteUrl, pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { project } = await getProjectDetailPageData(params.slug)
  if (!project) return {}
  const keywords = Array.from(new Set([project.title, project.category, ...project.tags, ...project.technologies]))
  return pageMetadata({
    title: `${project.title} — ${project.category}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.bannerImageUrl || project.coverImageUrl || '/assets/projects/curated/hyperkit-banner-readme.png',
    type: 'article',
    keywords,
  })
}

export default async function ProjectShowcasePage({ params }: { params: { slug: string } }) {
  const host = headers().get('host') || ''
  const isWorkSite = isWorkSiteHost(host)

  if (isWorkSite && !isProductionWorkSiteHost(host)) {
    redirect(`http://localhost:3000/projects/${params.slug}`)
  }

  const { project, otherProjects, legalLinks } = await getProjectDetailPageData(params.slug)
  
  if (!project) {
    notFound()
  }

  const projectUrl = absoluteUrl(`/projects/${project.slug}`)
  const authors = project.authors.length > 0
    ? project.authors.map((author) => ({ '@type': 'Person', name: author.name, url: author.url }))
    : [{ '@type': 'Person', name: project.authorName, url: project.authorUrl || absoluteUrl('/about') }]

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        url: projectUrl,
        datePublished: project.publishedAt || undefined,
        image: project.bannerImageUrl || project.coverImageUrl ? absoluteUrl(project.bannerImageUrl || project.coverImageUrl || '') : undefined,
        author: authors,
        keywords: [...project.tags, ...project.technologies].join(', '),
        about: project.category,
        isPartOf: { '@type': 'WebSite', name: 'JSTN — Justine Lupasi', url: absoluteUrl('/') },
      }} />
      <main className="bg-[#F8FAFC]">
        <HeroProjectHeader project={project} />
        <DescriptionOtherProjects project={project} />
        <ResponsibilitiesNetworks project={project} otherProjects={otherProjects} />
      </main>
    </PageLayout>
  )
}
