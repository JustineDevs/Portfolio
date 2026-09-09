'use client'

import { useEffect, useRef } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { Trophy } from 'lucide-react'
import AwwwardsNav from '@/components/ui/awwwards-nav'
import ExpandableScreen from '@/components/ui/expandable-screen'
import NeumorphicSocialButton from '@/components/ui/NeumorphicSocialButton'
import PaymentMethodsCarousel from '@/components/ui/payment-methods-carousel'
import {
  BashIcon,
  BunIcon,
  ClaudeIcon,
  CloudflareIcon,
  DockerIcon,
  GitHubIcon,
  GitIcon,
  GoIcon,
  JavaScriptIcon,
  NamecheapIcon,
  NextJsIcon,
  NodeIcon,
  NpmIcon,
  OpenAIIcon,
  PnpmIcon,
  PythonBrandIcon,
  ReactIcon,
  RustIcon,
  SolidityIcon,
  SqlIcon,
  TailwindIcon,
  TypeScriptIcon,
} from '@/components/ui/TechIcons'
import type { ExperiencePageData } from '@/lib/content/page-data'

const PANEL_COUNT = 4

const services = [
  ['Starter', '1–3 core features, basic auth, a simple database, and a single deployment.', '1–3 weeks · $1,500–$4,000'],
  ['Growth', '3–7 workflows, roles, integrations, and a production-ready handoff.', '3–8 weeks · $4,000–$12,000'],
  ['Pro / Platform', 'Complex workflows, AI agents, multiple integrations, and operational tooling.', '6–12+ weeks · $12,000–$30,000+'],
]

const featuredProjects = [
  ['Universal Music', 'E-commerce guitar shop'],
  ['Go-Mirofish', 'Decision support system'],
  ['Ambios AI', 'AI product experience'],
  ['HyperKit', 'Developer platform'],
  ['Premortem', 'Planning and risk workflow'],
]

const experience = [
  ['Project One Percent', 'Discord Moderator', 'Community operations · 2023–2026'],
]

const education = [
  ['National University Dasmariñas', 'Bachelor of Science in Information Technology', 'Undergraduate · 2nd Year'],
  ['Far East Asia Pacific Institute of Tourism Science and Technology', 'Senior High School · ICT', '2022–2024 · Graduated'],
]

const techStack = [
  ['TypeScript', TypeScriptIcon],
  ['JavaScript', JavaScriptIcon],
  ['React', ReactIcon],
  ['Next.js', NextJsIcon],
  ['Node.js', NodeIcon],
  ['Python', PythonBrandIcon],
  ['Rust', RustIcon],
  ['Solidity', SolidityIcon],
  ['Tailwind', TailwindIcon],
  ['Docker', DockerIcon],
  ['Git', GitIcon],
  ['GitHub', GitHubIcon],
  ['Go', GoIcon],
  ['Bash', BashIcon],
  ['SQL', SqlIcon],
  ['npm', NpmIcon],
  ['pnpm', PnpmIcon],
  ['Bun', BunIcon],
  ['Cloudflare', CloudflareIcon],
  ['Namecheap', NamecheapIcon],
  ['OpenAI', OpenAIIcon],
  ['Claude', ClaudeIcon],
] as const

type HorizontalScrollPageProps = {
  workData: ExperiencePageData['proofOfWork']
}

export default function HorizontalScrollPage({ workData }: HorizontalScrollPageProps): JSX.Element {
  const lenisRef = useRef<LenisRef>(null)
  const isAdvancing = useRef(false)
  const testimonial = workData.testimonials[0]

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      if (Math.abs(delta) < 2 || isAdvancing.current) return

      event.preventDefault()

      const currentPanel = Math.round(window.scrollX / window.innerWidth)
      const nextPanel = Math.max(0, Math.min(PANEL_COUNT - 1, currentPanel + (delta > 0 ? 1 : -1)))

      if (nextPanel === currentPanel) return

      isAdvancing.current = true
      lenisRef.current?.lenis?.scrollTo(nextPanel * window.innerWidth, {
        duration: 0.75,
        lock: true,
        onComplete: () => {
          isAdvancing.current = false
        },
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        orientation: 'horizontal',
        gestureOrientation: 'both',
        smoothWheel: true,
      }}
    >
      <main className="horizontal-page" aria-label="Horizontal page">
        <div className="horizontal-page__track">
          <section id="home" className="horizontal-page__panel horizontal-page__panel--1" aria-labelledby="home-title">
            <div className="horizontal-panel-content horizontal-panel-content--home">
              <div className="home-page-header">
                <div className="home-page-header__banner" aria-hidden="true">
                  <img src="/justine-header-web-dev.png" alt="Justine Lupasi — web developer" />
                </div>
                <div className="home-page-header__avatar-wrap">
                  <img className="home-page-header__avatar" src="/profile-dark-gray.png" alt="Justine Lupasi" />
                </div>
                <div className="home-page-header__body">
                  <p className="horizontal-panel-kicker">Manila / Remote</p>
                  <h1 id="home-title">Make the next business problem easier to solve.</h1>
                  <p className="horizontal-panel-lede">I help B2B teams and small businesses clarify messy operations, build useful tools, and create momentum.</p>
                  <div className="home-page-header__social">
                    <NeumorphicSocialButton />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="work" className="horizontal-page__panel horizontal-page__panel--2" aria-labelledby="work-title">
            <div className="horizontal-panel-content">
              <p className="horizontal-panel-kicker">Work · professional · direct</p>
              <div className="horizontal-work-layout">
                <div className="horizontal-projects">
                  <p className="horizontal-panel-label">Selected projects</p>
                  <div className="horizontal-project-feature">
                    <span>01 / 05</span>
                    <img
                      className="horizontal-project-feature__logo"
                      src="/UVS/UVS_logo_landscape.png"
                      alt="Universal Music Store logo"
                    />
                    <p>E-commerce guitar shop</p>
                  </div>
                  <div className="horizontal-project-list">
                    {featuredProjects.slice(1).map(([title, summary], index) => (
                      <a className="horizontal-project-row" href="/projects" key={title}>
                        <span>{String(index + 2).padStart(2, '0')}</span>
                        <strong>{title}</strong>
                        <small>{summary}</small>
                      </a>
                    ))}
                  </div>
                  <a className="horizontal-project-more" href="/projects">See more projects ↗</a>
                </div>
                <div className="horizontal-work-notes">
                  <div>
                    <p className="horizontal-panel-label">Testimonials</p>
                    <p>{testimonial?.quote ? `“${testimonial.quote}”` : 'Client feedback and working relationships.'}</p>
                    <small>{testimonial?.title || testimonial?.label || 'Published client testimonial'}</small>
                  </div>
                  <div>
                    <p className="horizontal-panel-label">Awards</p>
                    <div className="horizontal-award-list">
                      {workData.awards.filter((award) => !/discord/i.test(award.title)).map((award) => (
                        <div className="horizontal-award" key={award.slug}>
                          <Trophy aria-hidden="true" />
                          <div>
                            <p>{award.title}</p>
                            <small>{award.sourceLabel} · {award.year}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="horizontal-panel-label">Experience</p>
                    <div className="horizontal-experience-list">
                      {experience.map(([company, role, detail]) => (
                        <div className="horizontal-experience" key={company}>
                          <p>{company}</p>
                          <div>
                            <p>{role}</p>
                            <small>{detail}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="horizontal-panel-label">Education</p>
                    <div className="horizontal-education-list">
                      {education.map(([institution, degree, period]) => (
                        <div className="horizontal-education" key={institution}>
                          <p>{institution}</p>
                          <small>{degree} · {period}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="horizontal-panel-label">Tech stack</p>
                    <div className="horizontal-tech-grid" aria-label="Technology stack">
                      {techStack.map(([technology, Icon]) => (
                        <span key={technology} title={technology} aria-label={technology}>
                          <Icon aria-hidden="true" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="offerings" className="horizontal-page__panel horizontal-page__panel--3" aria-labelledby="offerings-title">
            <div className="horizontal-panel-content horizontal-panel-content--dark">
              <p className="horizontal-panel-kicker">Pricing · offerings</p>
              <h2 id="offerings-title">The right amount of system.</h2>
              <div className="horizontal-service-grid">
                {services.map(([name, summary, price]) => (
                  <article className="horizontal-service" key={name}>
                    <p className="horizontal-panel-label">{name}</p>
                    <p>{summary}</p>
                    <strong>{price}</strong>
                  </article>
                ))}
              </div>
              <div className="horizontal-payment-methods">
                <p className="horizontal-panel-label">Payment methods</p>
                <PaymentMethodsCarousel />
              </div>
            </div>
          </section>

          <section id="contact" className="horizontal-page__panel horizontal-page__panel--4" aria-labelledby="contact-title">
            <div className="horizontal-panel-content horizontal-panel-content--contact">
              <p className="horizontal-panel-kicker">Contact · booking</p>
              <h2 id="contact-title">Let’s make the next step clear.</h2>
              <p className="horizontal-panel-lede">Tell me what you are building, what is blocked, and where you want to go next.</p>
              <div className="horizontal-contact-actions">
                <ExpandableScreen
                  trigger={<button type="button">Send a brief ↗</button>}
                  content={
                    <div className="horizontal-contact-screen">
                      <p className="horizontal-panel-kicker">Start a conversation</p>
                      <h3>Tell me what needs to work better.</h3>
                      <p>Share the business problem, current constraint, and what a useful outcome looks like.</p>
                      <a href="mailto:JustineDevs@jstn.site?subject=Project%20brief">Email JustineDevs@jstn.site ↗</a>
                    </div>
                  }
                />
                <a href="https://cal.com/justinedevs" target="_blank" rel="noreferrer">Book a call ↗</a>
              </div>
              <p className="horizontal-panel-hint">JustineDevs@jstn.site</p>
            </div>
          </section>
        </div>
      </main>
      <AwwwardsNav
        locked
        items={[
          { label: 'Home', href: '#home' },
          { label: 'Work', href: '#work' },
          { label: 'Offerings', href: '#offerings' },
          { label: 'Contact', href: '#contact' },
        ]}
      />
    </ReactLenis>
  )
}
