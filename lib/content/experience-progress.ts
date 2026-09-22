export type ExperienceProgressIcon = {
  name: string;
  key: string;
};

export type ExperienceProgressEntry = {
  id: string;
  year: string;
  company: string;
  status: string;
  role: string;
  description: string;
  logoKey?: string | null;
  logoUrl: string | null;
  project: string;
  projectDescription: string;
  icons: ExperienceProgressIcon[];
};

export type ExperienceProgressMeta = {
  entries: ExperienceProgressEntry[];
};

export const fallbackExperienceProgress: ExperienceProgressEntry[] = [
  {
    id: "hyperkit",
    year: "2026",
    company: "HyperKit Labs",
    status: "CURRENT",
    role: "Co-Founder / Product Engineer",
    description:
      "Building developer infrastructure and AI-native workflows for multi-chain products, with a focus on making complex systems feel clear and useful.",
    logoUrl: "/assets/associates/hyperkit.svg",
    logoKey: "brand.hyperkit",
    project: "HyperKit",
    projectDescription: "Developer infrastructure and AI-native tooling for the Web3 ecosystem.",
    icons: [
      { name: "n8n", key: "n8n" },
      { name: "Framer", key: "framer" },
      { name: "Figma", key: "figma" },
      { name: "Rust", key: "rust" },
      { name: "Move", key: "move" },
    ],
  },
  {
    id: "hyperagent",
    year: "2025",
    company: "HyperAgent",
    status: "SHIPPED",
    role: "Product Engineer",
    description:
      "Shipped an AI-powered smart contract platform from natural language to production-ready, audited contracts, and turned the work into public proof through hackathon wins.",
    logoUrl: "/v2/showcase/HyperAgent.png",
    logoKey: "project.hyperagent",
    project: "HyperAgent",
    projectDescription: "AI-powered smart contract generation, auditing, and deployment workflows.",
    icons: [
      { name: "Solidity", key: "solidity" },
      { name: "Python", key: "python" },
      { name: "TypeScript", key: "typescript" },
      { name: "React", key: "react" },
      { name: "Node.js", key: "node" },
      { name: "Supabase", key: "supabase" },
    ],
  },
  {
    id: "fullstack",
    year: "2025",
    company: "Independent practice",
    status: "PIVOT",
    role: "Backend → Fullstack Developer",
    description:
      "Moved beyond isolated services to understand the complete experience: interface, interaction, desktop delivery, and the system underneath.",
    logoUrl: null,
    project: "Go-Mirofish",
    projectDescription: "A local-first swarm intelligence workflow for predicting and exploring complex systems.",
    icons: [
      { name: "Unreal Engine", key: "unreal" },
      { name: "HTML5", key: "html5" },
      { name: "Tailwind CSS", key: "tailwind" },
    ],
  },
  {
    id: "foundation",
    year: "2024",
    company: "Independent practice",
    status: "FOUNDATION",
    role: "Software Developer",
    description:
      "Started with fundamentals, databases, and the discipline of learning by building things that had to work.",
    logoUrl: null,
    project: "First systems",
    projectDescription: "The first database connections, interfaces, and software experiments that shaped the practice.",
    icons: [
      { name: "C", key: "c" },
      { name: "MySQL", key: "mysql" },
      { name: "Java", key: "java" },
      { name: "Visual Basic", key: "visual-basic" },
    ],
  },
];
