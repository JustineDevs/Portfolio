import type { Metadata } from 'next'
import Link from 'next/link'
import PageLayout from '@/components/layouts/PageLayout'
import { getPublicLegalLinks } from '@/lib/legal-links'

export const metadata: Metadata = {
  title: 'License | JustineDevs Portfolio',
  description: 'GNU General Public License v3.0 for this project',
}

export default async function LicensePage() {
  const legalLinks = await getPublicLegalLinks()
  return (
    <PageLayout legalLinks={legalLinks}>
      <div className="border border-[#d5d5d5] rounded-lg bg-white p-6 sm:p-8 md:p-10 max-w-3xl mx-auto mt-6 sm:mt-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#424242] mb-4">License</h1>
        <p className="text-[#555555] text-sm sm:text-base leading-relaxed mb-6">
          This site and its source code are licensed under the{' '}
          <strong>GNU General Public License v3.0</strong> (GPL-3.0). You may
          redistribute and modify the work under the terms of that license.
        </p>
        <ul className="flex flex-col gap-3 text-sm sm:text-base">
          <li>
            <a
              href="https://www.gnu.org/licenses/gpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#424242] underline underline-offset-2 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
            >
              GNU GPLv3 — full license (gnu.org)
            </a>
          </li>
          <li>
            <a
              href="https://github.com/JustineDevs/Portfolio/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#424242] underline underline-offset-2 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
            >
              LICENSE file in the repository
            </a>
          </li>
        </ul>
        <p className="mt-8 text-xs text-[#555555]">
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
          >
            Back to home
          </Link>
        </p>
      </div>
    </PageLayout>
  )
}
