"use client"

import CornerDot from '@/components/ui/CornerDot'
import MarkdownContent from '@/components/content/MarkdownContent'
import HighlightGrid from '@/components/ui/highlight-grid'

interface StoryResponsibilitiesProps {
  storyTitle?: string
  storyMarkdown?: string
  responsibilitiesTitle?: string
  responsibilitiesMarkdown?: string
}

export default function StoryResponsibilities({
  storyTitle = "",
  storyMarkdown = "",
  responsibilitiesTitle = "",
  responsibilitiesMarkdown = "",
}: StoryResponsibilitiesProps) {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      
<div className="grid grid-cols-1 lg:grid-cols-2">
          <HighlightGrid rows={[[{ label: 'how-i-work' }]]} preview={<div className="flex min-h-[140px] items-center justify-center p-4 text-center"><h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#424242]">{storyTitle}</h2></div>} className="border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
            <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">{storyTitle}</h2>
              <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]"><MarkdownContent markdown={storyMarkdown} /></div>
            </div>
          </HighlightGrid>

          <HighlightGrid rows={[[{ label: 'principles' }]]} preview={<div className="flex min-h-[140px] items-center justify-center p-4 text-center"><h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#424242]">{responsibilitiesTitle}</h2></div>}>
            <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">{responsibilitiesTitle}</h2>
              <div className="space-y-4 xs:space-y-5 sm:space-y-6"><MarkdownContent markdown={responsibilitiesMarkdown} /></div>
            </div>
          </HighlightGrid>
        </div>
    </section>
  )
}
