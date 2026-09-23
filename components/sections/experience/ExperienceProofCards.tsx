"use client";

import { ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { RatingBadge } from "@/components/foundations/rating-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { ExperiencePageData } from "@/lib/content/page-data";
import type { PublicAwardCard, PublicCertificateCard } from "@/lib/content/types";

type ProofData = ExperiencePageData["proofOfWork"];
type ProofFilter = "awards" | "proof" | "testimonials" | "certificates";

const filters: Array<{ id: ProofFilter; label: string }> = [
  { id: "awards", label: "Awards" },
  { id: "proof", label: "Proof of Work" },
  { id: "testimonials", label: "Testimonials" },
  { id: "certificates", label: "Certificates" },
];

function DiscordLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 fill-current">
      <path d="M19.54 5.13A16.46 16.46 0 0 0 15.5 3.87l-.5 1.02a15.2 15.2 0 0 0-6 0l-.5-1.02a16.52 16.52 0 0 0-4.04 1.26C1.9 9.04 1.2 12.84 1.55 16.59a16.6 16.6 0 0 0 4.96 2.52l1.2-1.64a10.2 10.2 0 0 1-1.9-.92l.46-.35c3.66 1.7 7.62 1.7 11.24 0l.47.35c-.61.36-1.25.67-1.9.92l1.2 1.64a16.55 16.55 0 0 0 4.96-2.52c.41-4.35-.7-8.11-2.7-11.46ZM8.24 14.4c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2 2 .99 2 2.2-.9 2.2-2 2.2Zm7.52 0c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2 2 .99 2 2.2-.9 2.2-2 2.2Z" />
    </svg>
  );
}

function ProofOfWork({ payload }: { payload: ProofData }) {
  const item = payload.items[0];
  if (!item) return <EmptyProofState label="No published proof of work yet." />;

  return (
    <div aria-label="Proof of work" className="py-3">
      <div className="grid gap-8 md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,2fr)] md:gap-12">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#5865f2] text-white"><DiscordLogo /></span>
          <div className="min-w-0 pt-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#1342FF]">Proof of work</p>
            <p className="mt-2 text-sm font-medium text-[#383838]">{item.brandName}</p>
          </div>
        </div>

        <div className="relative min-w-0 pr-10">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-[#383838] sm:text-3xl">{item.title}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#666666]">
            {item.brandLogoUrl ? <Image src={item.brandLogoUrl} alt={item.brandName} width={120} height={24} unoptimized className="h-5 w-auto object-contain" /> : null}
            <span aria-hidden="true">·</span>
            <span>{item.startedAt || "Ongoing"}{item.endedAt ? ` — ${item.endedAt}` : " — Present"}</span>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#666666]">{item.summary}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#858585]">
            <span>Community</span><span>Moderation</span><span>Web3</span>
          </div>
          {item.href ? <a href={item.href} className="absolute right-0 top-1 text-[#1342FF] transition-transform hover:translate-x-1" aria-label={`View proof for ${item.title}`}><ArrowRight aria-hidden="true" className="size-5" /></a> : null}
        </div>
      </div>
    </div>
  );
}

function EmptyProofState({ label }: { label: string }) {
  return <p className="py-8 text-sm text-[#858585]">{label}</p>;
}

function AwardMark({ award }: { award: PublicAwardCard }) {
  return <RatingBadge title={award.eventName || "Award"} subtitle={award.year || "Award"} rating={5} aria-label={`${award.eventName || "Award"} ${award.year}`} className="origin-top-left scale-[0.55]" />;
}

export function AwardsList({ awards, compact = false }: { awards: PublicAwardCard[]; compact?: boolean }) {
  if (awards.length === 0) return <EmptyProofState label="No published awards yet." />;

  return (
    <div aria-label="Competition awards" className={`grid gap-6 py-2 ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
      {awards.map((award) => (
          <a key={award.slug} href={award.proofUrl || undefined} className="group flex min-w-0 items-start gap-4 transition-opacity hover:opacity-75">
            <span className="h-[52px] w-[76px] shrink-0 overflow-visible"><AwardMark award={award} /></span>
            <div className="min-w-0">
              <div className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-[#858585]">{award.eventName}</div>
              <h2 className="mt-1 text-base font-semibold leading-5 tracking-[-0.02em] text-[#383838]">{award.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#666666]">{award.description}</p>
            </div>
          </a>
      ))}
    </div>
  );
}

function Testimonials({ payload }: { payload: ProofData }) {
  if (payload.testimonials.length === 0) return <EmptyProofState label="No published testimonials yet." />;

  return (
    <div className="relative mx-auto max-w-7xl">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="px-2 py-2">
              {payload.testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.key} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-muted/50 flex h-full min-h-[320px] flex-col justify-between rounded-4xl p-6 ring-0 select-none">
                    <div>
                      {testimonial.brandLogoUrl ? <div className="mb-4 flex h-9 items-center"><Image src={testimonial.brandLogoUrl} alt="Project One Percent" width={160} height={32} unoptimized className="h-7 w-auto object-contain" /></div> : null}
                      <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed md:text-base">{testimonial.quote}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="border-border h-12 w-12 border"><AvatarImage src={testimonial.avatarUrl || "/Avatar-shun.jpg"} alt={testimonial.title || "Collaborator"} /><AvatarFallback className="bg-muted text-muted-foreground">{(testimonial.title || "C").charAt(0)}</AvatarFallback></Avatar>
                  <div><p className="text-foreground font-medium">{testimonial.title || `Collaborator ${index + 1}`}</p><p className="text-muted-foreground mt-0.5 text-sm">{testimonial.label}</p></div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {payload.testimonials.length > 1 ? <div className="mt-10 flex w-full justify-center gap-2"><CarouselPrevious className="bg-muted hover:bg-muted/50 relative inset-0 size-10 rounded-xl border transition-colors" /><CarouselNext className="bg-muted hover:bg-muted/50 relative inset-0 size-10 rounded-xl transition-colors" /></div> : null}
          </Carousel>
    </div>
  );
}

export function CertificatesTable({ certificates, compact = false }: { certificates: PublicCertificateCard[]; compact?: boolean }) {
  if (certificates.length === 0) return <EmptyProofState label="No published certificates yet." />;

  if (compact) {
    return (
      <div aria-label="Certificates" className="mt-6 divide-y divide-[#d9dde3] border-y border-[#d9dde3]">
        {certificates.map((certificate, index) => (
          <a key={certificate.slug} href={certificate.proofUrl || undefined} className="flex min-w-0 items-center gap-3 py-3 transition-opacity hover:opacity-70">
            <span className="shrink-0 text-[11px] text-[#657080]">({String(index + 1).padStart(3, "0")})</span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#111318] text-white">
              {certificate.logoUrl ? <Image src={certificate.logoUrl} alt="" width={16} height={16} unoptimized className="size-4 object-contain" /> : <BadgeCheck aria-hidden="true" className="size-4" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-[#111318]">{certificate.title}</span>
              <span className="block truncate text-xs text-[#9aa2ad]">{certificate.issuer || certificate.description}</span>
            </span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f8f8f8] py-12 text-[#424242] sm:py-16">
      <div className="space-y-10">
        <div className="grid grid-cols-[minmax(4rem,0.65fr)_minmax(12rem,1.2fr)_minmax(16rem,2fr)_minmax(3rem,0.35fr)] items-center border-b border-[#d5d5d5] pb-3 text-sm text-[#858585] sm:text-base">
          <span aria-hidden="true" />
          <span>Name</span>
          <span>Issuer</span>
          <span className="text-right">Year</span>
        </div>

        <div>
          {certificates.map((certificate, index) => (
            <a key={certificate.slug} href={certificate.proofUrl || undefined} className="grid grid-cols-[minmax(4rem,0.65fr)_minmax(12rem,1.2fr)_minmax(16rem,2fr)_minmax(3rem,0.35fr)] items-center border-b border-[#d5d5d5] py-5 transition-opacity hover:opacity-70">
              <span className="text-sm text-[#666666]">({String(index + 1).padStart(3, "0")})</span>
              <span className="flex min-w-0 items-center gap-3 text-base font-medium text-[#424242] sm:text-lg">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#424242] text-white">
                  {certificate.logoUrl ? <Image src={certificate.logoUrl} alt="" width={16} height={16} unoptimized className="size-4 object-contain" /> : <BadgeCheck aria-hidden="true" className="size-4" />}
                </span>
                <span className="truncate">{certificate.title}</span>
              </span>
              <span className="pr-4 text-sm leading-6 text-[#666666] sm:text-base">{certificate.issuer || certificate.description}</span>
              <span className="text-right text-sm text-[#424242] sm:text-base">—</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExperienceProofCards({ payload }: { payload: ProofData }) {
  const [filter, setFilter] = useState<ProofFilter>("awards");

  return (
    <div className="px-5 py-8 sm:px-10 lg:px-16"><div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Experience proof filters">{filters.map((item) => <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} onClick={() => setFilter(item.id)} className={`min-h-9 rounded-full px-4 py-2 text-xs font-medium transition-colors ${filter === item.id ? "bg-[#383838] text-white" : "bg-[#f2f4f7] text-[#666666] hover:bg-[#e7e9ec] hover:text-[#383838]"}`}>{item.label}</button>)}</div>
      {filter === "awards" ? <AwardsList awards={payload.awards} /> : null}
      {filter === "proof" ? <ProofOfWork payload={payload} /> : null}
      {filter === "testimonials" ? <Testimonials payload={payload} /> : null}
      {filter === "certificates" ? <CertificatesTable certificates={payload.certificates} /> : null}
    </div></div>
  );
}
