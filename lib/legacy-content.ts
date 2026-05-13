import { projects } from "./projects";

export const legacyAboutPanels = [
  {
    id: "intuitive-engineering",
    title: "/Intuitive Engineering",
    description: "Rapid Prototyping with Quality Gates",
    philosophy: "Ship to Learn",
    link: "How I Work",
    heading: "Rapid Prototyping with Quality Gates",
    intro:
      'I don\'t just write code; I architect systems using a "Ship to Learn" philosophy. My workflow combines high-velocity experimentation with strict engineering rigor.',
    points: [
      'I possess the "Tier 1" ability to conceive, architect, and ship complete full-stack systems alone. I don\'t wait for permission; I build the MVP to prove the concept.',
      'I use "vibe coding" as a strategic advantage rapidly trusting intuition to draft architecture, then ruthlessly validating it with 93.6% TypeScript coverage and automated testing.',
      "I don't read books cover-to-cover. I learn by solving immediate architectural problems (e.g., learning Solidity to fix a smart contract bug in real-time).",
      "I utilize AI not to write code for me, but as a force multiplier acting as a prompt engineer and critical reviewer to move 15-20x faster than traditional development cycles.",
    ],
    summary: "Vibe → Prototype → Gate → Ship → Learn. 93% coverage. Dawn deployments.",
    extended:
      "It hits at 2:17 AM that electric spark. I grab Figma, dump intuition: boxes, arrows, invariants. 27 minutes flat. Code follows like transcription standing MVP in 2 hours. Then the gauntlet: tests must hit 93% coverage or it burns. Red → green → ship. AI steps in as my scalpel: \"Optimize this reducer.\" I dictate, it drafts, I carve truth. Deploy lands production in 8 minutes. Dashboard blinks: latency flat, errors zero. Dawn breaks, metrics whisper reality. What survives? What scales? That's not workflow it's how I breathe code into existence.",
  },
  {
    id: "credible-technologist",
    title: "/The Credible Technologist",
    description: "Should Be Autonomous",
    philosophy: "Web3 as AI-Native and Network Agnostic",
    link: "Tech Philosophy",
    heading: "Should Be Autonomous",
    intro:
      "I believe the future of Web3 is AI-Native and Network Agnostic. Technology is only useful if it solves human problems without friction.",
    points: [
      '"It works on my machine" is not a strategy. I believe in strict type safety, CI/CD pipelines, and rigorous deployment standards (Vercel/Docker) from Day 1.',
      "Users shouldn't care which chain they are on. Tools like HyperKit and x402 exist to abstract away the complexity of blockchain, making decentralized apps as seamless as Web2.",
      'I believe in "Learning in Public." I share templates, starter kits, and documentation (Public-Github-Repo) because the best way to master a subject is to teach it.',
      "I value logic over emotion. If a system is flawed, I acknowledge it immediately and fix it. No fluff, no hype just execution.",
    ],
    summary: "Infinite Composability. Every module chains anywhere. Quality over velocity.",
    extended:
      "Velocity without rigor is noise. I build for the chain that doesn't exist yet modules that snap into any protocol, any language, any ledger. Programming languages bow to invariants: pure functions, zero dependencies, 100% type safety. Frameworks? Temporary scaffolding. Standards endure. AI drafts the boilerplate; I forge the architecture. Every deploy measures truth: latency spikes, coverage gaps, edge failures. Philosophy isn't words it's the 17-hour debug session that ships perfect.",
  },
  {
    id: "dual-mode-reality",
    title: "/Dual-Mode Reality",
    description: "Expression Meets Utility",
    philosophy: "Dual-Mode System...",
    link: "Design Principles",
    heading: "Expression Meets Utility",
    intro:
      'My design philosophy rejects the idea that you have to choose between "creative" and "professional." My work embodies both via a Dual-Mode System.',
    points: [
      "Content shouldn't be a dead end. My designs feature continuous discovery loops that encourage re-exploration, mirroring the iterative nature of software development.",
      "Motion must have meaning. I use Parallax and Scroll-Triggered Animations not for decoration, but to control the pacing of the story and reveal complexity layer by layer.",
      "Adaptive Context:\n  • Creative Mode: For visionaries and investors. It prioritizes immersion, 3D depth, and emotional connection.\n  • Professional Mode: For hiring managers and auditors. It prioritizes readability, data density, and clear hierarchy.",
      "Mobile-First Performance: A portfolio must perform. I target Lighthouse 90+ scores and WCAG AA Accessibility, ensuring that visual richness never compromises usability or speed.",
    ],
    summary: "Invisible Complexity. Visible Poetry. Systems that shimmer.",
    extended:
      "Beauty without function is decoration. I design systems where complexity vanishes chromatic that refract 247-chain flows, cursor trails that map your interaction graph. Every hover distortion encodes intent. Two modes: Creative bleeds neon for dreamers; Professional snaps to monochrome for auditors. Same data, different poetry. Lighthouse demands 90+; I deliver 95. Accessibility isn't afterthought it's architecture.",
  },
] as const;

export const legacyAboutSections = {
  hero: {
    title: "Behind the Code: Justine's Hidden Architectures",
    subtitle: "Who Is Justine? The Quiet Architect Behind the Screens",
    imageUrl: "/Justinedevs_Banner.png",
  },
  readingMap: {
    dateLabel: "January 20, 2026",
    heading: "About",
    subheading: "Beyond Engineer Invisible Systems",
    panels: legacyAboutPanels,
  },
  narrative: {
    title: "Who I Am",
    body:
      "I'm a builder who lives at the intersection of code, markets, and communities.\n\nI treat the browser as a control panel for complex systems. My journey started with user interfaces, but I quickly moved to infrastructure—designing workflows that help teams ship faster and safer.",
  },
  principles: {
    title: "Principles & Methodology",
    body:
      "I don't treat work as disconnected tasks. I think in systems, feedback loops, and leverage.\n\nMy methodology is usually: map the constraint, sketch the shape, ship the smallest honest version, then tighten the system with tests, iteration, and better abstractions.\n\nThis section is intentionally personal and flexible. It can hold principles, methodology, under-the-hood process, or how I learn through building.",
  },
  learning: {
    title: "What I'm Learning",
    body:
      "I learn by building through ambiguity, not by waiting for a perfect map.\n\nLately that means sharpening system design, technical writing, product judgment, and the discipline to turn intuition into repeatable methodology.",
  },
  underTheHood: {
    title: "Under the Hood",
    body:
      "My mental model is a graph. I look for structure, dependencies, failure points, and leverage.\n\nWhen something repeats, I want to turn it into a tool, a system, or a better interface.",
  },
  northStar: {
    title: "What I Care About",
    body:
      "I care about building software that makes complex systems feel legible and calm.\n\nWhether it's interfaces, infrastructure, or developer tooling, I want the machinery underneath to be powerful while the experience above it feels human.",
  },
} as const;

export const legacyTestimonials = [
  {
    id: "rommel-celestino",
    name: "Rommel Celestino",
    role: "FOUNDER OF PROJECT ONE PERCENT",
    company: "Project One Percent",
    quote:
      "Doing a great job by giving alpha info's about the upcoming projects that has potential keeping the community active",
    avatarUrl: "/v2/Testimonials/Rommel Celestino.jpg",
    featured: true,
    sortOrder: 0,
  },
] as const;

export const legacyAwards = [
  {
    slug: "metis-hackathon",
    title: "Metis Hackathon",
    eventName: "METIS HYPERION HACKATHON",
    description:
      "Won first place in the Metis Hyperion Hackathon. Developed innovative blockchain solutions using Metis Layer 2 technology.",
    awardType: "winning",
    year: "2025",
    proofUrl: "https://forum.ceg.vote/t/hyperhack-winners/10593",
    logoUrl: "/Logo/metis/metis-symbol-blue.svg",
    featured: true,
    sortOrder: 0,
  },
  {
    slug: "avalanche-x402",
    title: "Avalanche x402",
    eventName: "AVALANCHE BUILD X402 AGENTS",
    description:
      "Achieved recognition in the Avalanche Build x402 Agents program. Built decentralized applications leveraging Avalanche's high-performance blockchain.",
    awardType: "featured",
    year: "2025",
    proofUrl: "https://x.com/AvaxDevelopers/status/2001334825199063331",
    logoUrl:
      "/Logo/avalanche/Avalanche Logomark/Avalanche Logomark/SVG/Avalanche_Logomark_Red.svg",
    featured: true,
    sortOrder: 1,
  },
] as const;

export const legacyPosts = [
  {
    slug: "behind-the-code",
    title: "Behind the Code",
    summary:
      "A native portfolio article about how I think, build, and design invisible systems.",
    bodyMd:
      "## Behind the Code\n\nI build at the intersection of software, systems, and community.\n\nMy workflow is simple: ship fast enough to learn, but keep enough rigor that the thing survives first contact with reality.\n\nThis site exists to make the invisible parts visible: architecture choices, proof of work, shipped projects, and the writing that shaped them.",
    postType: "native",
    sourcePlatform: null,
    canonicalUrl: null,
    coverImageUrl: "/Justinedevs_Banner.png",
    featured: true,
  },
  {
    slug: "metawalletgen-linkedin-launch",
    title: "MetaWalletGen-CLI launch post",
    summary:
      "LinkedIn post about the MetaWalletGen-CLI release and the security choices behind it.",
    bodyMd: null,
    postType: "external",
    sourcePlatform: "linkedin",
    canonicalUrl:
      "https://www.linkedin.com/posts/justine-devs-444608295_ethereum-blockchain-crypto-activity-7366029702819405824-ILYG",
    coverImageUrl: "/v2/showcase/Banner V1 METAGEN WALLET.png",
    featured: true,
  },
  {
    slug: "avalanche-x402-feature",
    title: "Avalanche x402 feature mention",
    summary:
      "External signal from Avalanche Developers featuring my work in the x402 Agents program.",
    bodyMd: null,
    postType: "external",
    sourcePlatform: "x",
    canonicalUrl: "https://x.com/AvaxDevelopers/status/2001334825199063331",
    coverImageUrl: "/v2/showcase/banner.png",
    featured: false,
  },
] as const;

export const legacyHighlights = [
  {
    highlightType: "project",
    targetKey: "hyperkit",
    titleOverride: "HyperKit",
    summaryOverride:
      "Modular infrastructure toolkit for full-stack multi-chain application development.",
    imageUrlOverride: "/v2/showcase/Hyperkit Banner (README).png",
    linkOverride: "/projects/hyperkit",
    pinned: true,
    sortOrder: 0,
  },
  {
    highlightType: "award",
    targetKey: "metis-hackathon",
    titleOverride: "Metis Hackathon Winner",
    summaryOverride: "First place result from the Metis Hyperion Hackathon.",
    imageUrlOverride: "/Logo/metis/metis-symbol-blue.svg",
    linkOverride: "https://forum.ceg.vote/t/hyperhack-winners/10593",
    pinned: true,
    sortOrder: 1,
  },
] as const;

export const legacySiteSettings = {
  githubUsername: "JustineDevs",
  availabilityText: "Available for product-minded engineering, system design, and Web3 infrastructure work.",
  currentFocus:
    "Building developer infrastructure, portfolio systems, and GitHub-backed proof-of-work surfaces.",
  /** Public Privacy Policy URL (https) or site-relative path (e.g. `/privacy`). Overridable via `NEXT_PUBLIC_PRIVACY_POLICY_URL`. */
  privacyPolicyUrl: "",
  /** Public Terms of Service URL (https) or site-relative path. Overridable via `NEXT_PUBLIC_TERMS_URL`. */
  termsUrl: "",
};

export const legacyProjects = Object.values(projects);
