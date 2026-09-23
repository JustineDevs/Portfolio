import type { Metadata } from 'next'

import PageLayout from '@/components/layouts/PageLayout'
import ChangelogPageContent from '@/components/sections/ChangelogPageContent'
import JsonLd from '@/components/seo/JsonLd'
import { changelogEntries, changelogEntryId, latestChangelogDate, latestChangelogEntry } from '@/lib/content/changelog'
import { getPublicLegalLinks } from '@/lib/legal-links'
import { absoluteUrl, SITE_NAME } from '@/lib/seo'

export function generateMetadata(): Metadata {
  const description = `Release notes and product updates from the JSTN V2 portfolio. Latest release: ${latestChangelogEntry.version}, ${latestChangelogEntry.title}.`

  return {
    title: `Changelog and release notes | JSTN ${latestChangelogEntry.version}`,
    description,
    alternates: { canonical: absoluteUrl('/changelog') },
    openGraph: {
      type: 'website',
      url: absoluteUrl('/changelog'),
      siteName: SITE_NAME,
      title: `JSTN changelog | ${latestChangelogEntry.version}`,
      description,
    },
    twitter: {
      card: 'summary',
      title: `JSTN changelog | ${latestChangelogEntry.version}`,
      description,
    },
  }
}

export default async function ChangelogPage() {
  const legalLinks = await getPublicLegalLinks()

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': absoluteUrl('/changelog'),
        url: absoluteUrl('/changelog'),
        name: 'JSTN changelog and release notes',
        description: 'Versioned release notes and product updates from the JSTN V2 portfolio.',
        dateModified: latestChangelogDate.toISOString(),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/') },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: changelogEntries.length,
          itemListElement: changelogEntries.map((entry, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'TechArticle',
              '@id': `${absoluteUrl('/changelog')}#${changelogEntryId(entry.version)}`,
              url: `${absoluteUrl('/changelog')}#${changelogEntryId(entry.version)}`,
              headline: `${entry.version}: ${entry.title}`,
              description: entry.description,
              datePublished: new Date(entry.date).toISOString(),
              dateModified: new Date(entry.date).toISOString(),
              version: entry.version,
              author: { '@type': 'Person', name: 'Justine Lupasi', url: absoluteUrl('/about') },
            },
          })),
        },
      }} />
      <ChangelogPageContent />
    </PageLayout>
  )
}
