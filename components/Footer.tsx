'use client'

import Link from 'next/link'
import Image from 'next/image'
import CornerDot from '@/components/ui/CornerDot'
import NeumorphicSocialButton from '@/components/ui/NeumorphicSocialButton'
import HeartButton from '@/components/ui/HeartButton'
import { useToast } from '@/components/providers/ToastProvider'
import type { PublicLegalLinks } from '@/lib/legal-links-shared'
import { isSafeLegalHref } from '@/lib/legal-links-shared'

const resourceLinkClass =
  'text-[#555555] text-[13px] xs:text-[14px] hover:text-[#424242] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded'

function trimEnv(value: string | undefined) {
  const t = value?.trim()
  return t && t.length > 0 ? t : null
}

function pickVisibleUrl(merged: string | null | undefined, env: string | undefined): string | null {
  if (typeof merged === 'string') {
    const t = merged.trim()
    if (t && isSafeLegalHref(t)) return t
  }
  const e = trimEnv(env)
  return e && isSafeLegalHref(e) ? e : null
}

function FooterLegalAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={resourceLinkClass}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={resourceLinkClass}>
      {children}
    </a>
  )
}

export default function Footer({ legalLinks }: { legalLinks?: PublicLegalLinks }) {
  const { info } = useToast()
  const privacyUrl = pickVisibleUrl(legalLinks?.privacyPolicyUrl, process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL)
  const termsUrl = pickVisibleUrl(legalLinks?.termsUrl, process.env.NEXT_PUBLIC_TERMS_URL)

  return (
    <footer className="w-full overflow-x-hidden">
      <div className="relative border border-[#d5d5d5] flex flex-col lg:flex-row min-w-0 rounded-b-lg overflow-hidden">
          <CornerDot position="tl" className="hidden sm:block" />
          <CornerDot position="tr" className="hidden sm:block" />
          
          <div className="lg:w-[60%] shrink-0 min-w-0 border-b lg:border-b-0 border-[#d5d5d5] p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 flex items-center overflow-x-hidden">
            <div className="relative w-full max-w-[280px] xs:max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] h-[120px] xs:h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[240px] overflow-hidden">
              <Image 
                src="/JSTN Logo/SVG/Logo Header - B.svg" 
                alt="JSTN Logo" 
                fill 
                sizes="(max-width: 1024px) 90vw, 750px"
                loading="lazy"
                className="object-contain object-left" 
                unoptimized
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20">
              <div>
                <h3 className="text-[16px] xs:text-[17px] sm:text-[18px] font-bold text-[#424242] mb-3 xs:mb-4">Resources</h3>
                <nav className="flex flex-col gap-2 xs:gap-3" aria-label="Resources">
                  <a 
                    href="https://github.com/justinedevs/portfolio-v2/issues" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={resourceLinkClass}
                    aria-label="Report a bug or provide feedback on GitHub"
                  >
                    Bug Report / Feedback
                  </a>
                  <button
                    onClick={() => {
                      window.location.href = '/projects'
                    }}
                    className={`text-left ${resourceLinkClass}`}
                    aria-label="View project categories"
                  >
                    Categories
                  </button>
                  <button
                    onClick={() => {
                      info('Tags feature coming soon!')
                    }}
                    className={`text-left ${resourceLinkClass}`}
                    aria-label="View project tags"
                  >
                    Tags
                  </button>
                  {privacyUrl ? (
                    <FooterLegalAnchor href={privacyUrl}>Privacy Policy</FooterLegalAnchor>
                  ) : null}
                  {termsUrl ? (
                    <FooterLegalAnchor href={termsUrl}>Terms</FooterLegalAnchor>
                  ) : null}
                </nav>
              </div>

              <div>
                <h3 className="text-[16px] xs:text-[17px] sm:text-[18px] font-bold text-[#424242] mb-3 xs:mb-4">Social</h3>
                <NeumorphicSocialButton />
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[48px] xs:h-[52px] sm:h-[56px] flex flex-col xs:flex-row items-center justify-between px-3 xs:px-4 sm:px-6 gap-1 xs:gap-2 py-2 xs:py-0">
          <p className="text-[#555555] text-[10px] xs:text-[11px] sm:text-[12px] font-medium text-center xs:text-left">
            © 2026 JSTN Resources.{' '}
            <Link
              href="/license"
              className="underline underline-offset-2 decoration-[#555555] hover:text-[#424242] hover:decoration-[#424242] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
            >
              All rights reserved.
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <HeartButton />
            <p className="text-[#555555] text-[10px] xs:text-[11px] sm:text-[12px] font-medium text-center xs:text-right">
              Created by @Justinedevs
            </p>
          </div>
      </div>
    </footer>
  );
}
