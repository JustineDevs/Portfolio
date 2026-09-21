import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { getPublicLegalLinks } from '@/lib/legal-links'

export const metadata: Metadata = {
  title: 'License | JustineDevs Portfolio',
  description: 'GNU General Public License v3.0 for this project',
}

export default async function LicensePage() {
  const legalLinks = await getPublicLegalLinks()
  return <LegalPage title="License" eyebrow="Project information" description="The portfolio source code is distributed under the GNU General Public License v3.0." legalLinks={legalLinks} sections={[{ title: "License", body: "You may redistribute and modify the source code under the terms of the GNU General Public License v3.0." }, { title: "Read the full license", links: [{ label: "GNU GPLv3 — full license", href: "https://www.gnu.org/licenses/gpl-3.0.html" }, { label: "License file in the repository", href: "https://github.com/JustineDevs/Portfolio/blob/main/LICENSE" }] }]} />
}
