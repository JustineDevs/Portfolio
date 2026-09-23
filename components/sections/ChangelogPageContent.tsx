import { ArrowUpRight, Check, GitCommitHorizontal } from 'lucide-react'

import { changelogEntries, changelogEntryId } from '@/lib/content/changelog'

export default function ChangelogPageContent() {
  return (
    <div className="border-x border-b border-[#d5d5d5] bg-[#f8f8f8] text-[#424242]">
      <header className="border-b border-[#d5d5d5] bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1342FF]">Release archive / V2</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-[42px] font-medium leading-[0.98] tracking-[-0.055em] text-[#383838] sm:text-[64px]">Changelog</h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] text-[#58606d] sm:text-[17px]">
                A living record of the systems, surfaces, and small decisions that shape JSTN.
              </p>
            </div>
            <div className="border-l-2 border-[#1342FF] pl-4 text-[11px] leading-[1.7] text-[#6a7280]">
              <span className="font-mono text-[#424242]">{changelogEntries.length}</span> releases in the V2 line.
              <br />Built in public, refined with intent.
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28" aria-label="Release notes">
        <div className="space-y-20 sm:space-y-28">
          {changelogEntries.map((entry, index) => (
            <article id={changelogEntryId(entry.version)} key={entry.version} className="relative scroll-mt-24 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${index === 0 ? 'border-[#1342FF] bg-[#1342FF] text-white' : 'border-[#d5d5d5] bg-white text-[#424242]'}`}>
                    {index === 0 ? <span className="h-1.5 w-1.5 rounded-full bg-[#A8CEFF]" aria-hidden="true" /> : null}
                    {entry.version}
                  </span>
                </div>
                <time className="mt-3 block text-[11px] font-medium text-[#6a7280]" dateTime={new Date(entry.date).toISOString().slice(0, 10)}>
                  {entry.date}
                </time>
                {index < changelogEntries.length - 1 ? <div className="mt-8 hidden h-12 w-px bg-[#d5d5d5] lg:block" aria-hidden="true" /> : null}
              </aside>

              <div className="min-w-0 border-t border-[#d5d5d5] pt-6 lg:pt-0 lg:border-t-0">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6a7280]">Release {entry.version}</p>
                    <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#383838] sm:text-[38px]">{entry.title}</h2>
                  </div>
                  {index === 0 ? <GitCommitHorizontal className="mt-1 h-5 w-5 shrink-0 text-[#1342FF]" aria-label="Latest release" /> : null}
                </div>
                <p className="mt-5 max-w-2xl text-[14px] leading-[1.8] text-[#58606d] sm:text-[16px]">{entry.description}</p>

                <ul className="mt-7 space-y-3 border-l-2 border-[#A8CEFF] pl-5 text-[13px] leading-[1.65] text-[#424242] sm:text-[14px]">
                  {entry.highlights.map((highlight) => <li key={highlight} className="relative">{highlight}</li>)}
                </ul>

                {entry.changed?.length ? (
                  <details className="group mt-8 border border-[#d5d5d5] bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#424242] marker:hidden sm:px-5">
                      <span>What changed</span><ArrowUpRight className="h-4 w-4 rotate-45 text-[#6a7280] transition-transform duration-300 group-open:rotate-90" aria-hidden="true" />
                    </summary>
                    <ul className="space-y-2 border-t border-[#d5d5d5] px-5 py-4 text-[13px] leading-[1.65] text-[#6a7280]">
                      {entry.changed.map((change) => <li key={change} className="flex gap-2"><span className="mt-1 text-[#1342FF]">—</span>{change}</li>)}
                    </ul>
                  </details>
                ) : null}

                {entry.verification?.length ? (
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6a7280]">
                    <span className="inline-flex items-center gap-1.5 text-[#424242]"><Check className="h-3.5 w-3.5 text-[#1342FF]" aria-hidden="true" /> Verified</span>
                    {entry.verification.map((command) => <code key={command} className="bg-[#eef0f2] px-2 py-1 font-mono normal-case tracking-normal text-[#58606d]">{command}</code>)}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
