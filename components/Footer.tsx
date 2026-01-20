'use client'

import Link from 'next/link'
import Image from 'next/image'
import CornerDot from '@/components/ui/CornerDot'
import NeumorphicSocialButton from '@/components/ui/NeumorphicSocialButton'
import HeartButton from '@/components/ui/HeartButton'
import { useToast } from '@/components/providers/ToastProvider'

export default function Footer() {
  const { info } = useToast()
  return (
    <footer className="w-full overflow-x-hidden">
      <div className="relative border border-[#d5d5d5] flex flex-col lg:flex-row rounded-b-lg overflow-hidden">
          <CornerDot position="tl" className="hidden sm:block" />
          <CornerDot position="tr" className="hidden sm:block" />
          
          <div className="lg:w-[60%] shrink-0 border-b lg:border-b-0 border-[#d5d5d5] p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 flex items-center overflow-x-hidden">
            <div className="relative w-full max-w-[280px] xs:max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] h-[120px] xs:h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[240px] overflow-hidden">
              <Image 
                src="/JSTN Logo/SVG/Logo Header - B.svg" 
                alt="JSTN Logo" 
                fill 
                className="object-contain object-left" 
                priority
              />
            </div>
          </div>

          <div className="flex-1 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20">
              <div>
                <h3 className="text-[16px] xs:text-[17px] sm:text-[18px] font-bold text-[#424242] mb-3 xs:mb-4">Resources</h3>
                <nav className="flex flex-col gap-2 xs:gap-3">
                  <a 
                    href="https://github.com/justinedevs/portfolio-v2/issues" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#555555] text-[13px] xs:text-[14px] hover:text-[#424242] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
                    aria-label="Report a bug or provide feedback on GitHub"
                  >
                    Bug Report / Feedback
                  </a>
                  <button
                    onClick={() => {
                      window.location.href = '/projects'
                    }}
                    className="text-left text-[#555555] text-[13px] xs:text-[14px] hover:text-[#424242] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
                    aria-label="View project categories"
                  >
                    Categories
                  </button>
                  <button
                    onClick={() => {
                      info('Tags feature coming soon!')
                    }}
                    className="text-left text-[#555555] text-[13px] xs:text-[14px] hover:text-[#424242] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 rounded"
                    aria-label="View project tags"
                  >
                    Tags
                  </button>
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
            © 2026 JSTN Resources. All rights reserved.
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
