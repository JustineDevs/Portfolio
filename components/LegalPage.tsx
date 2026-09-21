import Link from 'next/link'

import PageLayout from '@/components/layouts/PageLayout'
import type { PublicLegalLinks } from '@/lib/legal-links-shared'

interface LegalPageSection {
  title: string
  body?: string
  items?: string[]
  links?: { label: string; href: string }[]
}

interface LegalPageProps {
  title: string
  eyebrow: string
  description: string
  sections: LegalPageSection[]
  legalLinks?: PublicLegalLinks
}

export default function LegalPage({
  title,
  eyebrow,
  description,
  sections,
  legalLinks,
}: LegalPageProps) {
  return (
    <PageLayout legalLinks={legalLinks}>
      <article className="legal-page w-full overflow-hidden border-x border-b border-[#d5d5d5] bg-white">
        <header className="border-b border-[#d5d5d5] bg-[#fafafa] px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6a7280]">{eyebrow}</p>
          <h1 className="text-3xl font-medium tracking-[-0.04em] text-[#222] sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#58606d] sm:text-base">{description}</p>
        </header>

        <div className="divide-y divide-[#e5e5e5]">
          {sections.map((section) => (
            <section key={section.title} className="px-5 py-6 sm:px-8 sm:py-7 md:px-10">
              <h2 className="text-base font-medium text-[#222] sm:text-lg">{section.title}</h2>
              {section.body ? <p className="mt-3 max-w-3xl text-sm leading-7 text-[#58606d]">{section.body}</p> : null}
              {section.items ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#58606d]">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {section.links ? (
                <div className="mt-4 flex flex-col items-start gap-2 text-sm">
                  {section.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="rounded text-[#424242] underline underline-offset-2 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2">
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <nav aria-label="Legal pages" className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#d5d5d5] px-5 py-5 text-xs text-[#6a7280] sm:px-8 md:px-10">
          <Link href="/" className="rounded underline underline-offset-2 hover:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2">Home</Link>
          <Link href="/privacy" className="rounded underline underline-offset-2 hover:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2">Privacy</Link>
          <Link href="/terms" className="rounded underline underline-offset-2 hover:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2">Terms</Link>
          <Link href="/license" className="rounded underline underline-offset-2 hover:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2">License</Link>
        </nav>
      </article>
    </PageLayout>
  )
}
