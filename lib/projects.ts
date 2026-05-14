export interface Project {
  slug: string
  title: string
  description: string
  longDescription?: string[]
  date: string
  category: string
  tags: string[]
  author: string
  authorWebsite: string
  websiteUrl?: string
  coverImage: string
  bannerImage?: string
  responsibilities?: string[]
  networks?: string[]
  technologies?: string[]
  hackathons?: {
    name: string
    type: 'winning' | 'featured' | 'participated'
    logo: string
    date?: string
    location?: string
  }[]
  otherProjects?: string[]
  socialLinks?: {
    github?: string
    twitter?: string
    discord?: string
    website?: string
    hackquest?: string
    linkedin?: string
  }
}

export const projects: Record<string, Project> = {
  hyperkit: {
    slug: 'hyperkit',
    title: 'HyperKit',
    description: 'Open-source developer platform for full-stack decentralized application development across multiple EVM blockchain networks. Combines AI-powered smart contract generation, integrated security auditing, and modular infrastructure primitives.',
    longDescription: [
      'HyperKit is an open-source developer platform for full-stack decentralized application development across multiple EVM blockchain networks.',
      'Combines AI-powered smart contract generation, integrated security auditing, and modular infrastructure primitives to accelerate development from concept to production.',
      'Built by Hyperkit Labs, it features AI-powered smart contract generation using LLMs (Gemini, OpenAI, Anthropic), natural language specification to production-ready Solidity code, and intelligent deployment orchestration across networks.',
    ],
    date: '01/15/2026',
    category: 'Blockchain Infrastructure / Developer Platform / AI',
    tags: ['Blockchain', 'Smart Contracts', 'Developer Tools', 'Multi-chain', 'DeFi', 'Infrastructure', 'AI', 'Open Source'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    websiteUrl: 'https://hyperionkit.xyz',
    coverImage: '/v2/showcase/Hyperkit Banner (README).png',
    bannerImage: '/v2/showcase/Hyperkit Banner (README).png',
    technologies: ['Solidity', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'React', 'Next.js 15', 'Docker', 'Wagmi', 'Viem'],
    responsibilities: [
      'Architecture design',
      'SDK development',
      'Smart contract generation engine',
      'Multi-chain orchestration',
      'Team leadership',
      'Technical strategy',
    ],
    networks: ['Hyperion', 'Metis', 'Mantle L2', 'EVM Compatible'],
      hackathons: [
        {
          name: 'Mantle Global Hackathon 2025',
          type: 'featured',
          logo: '/Logo/mantle/Mantle-Brand-Assets/Mantle Logo Mark/Mantle-Logo-mark.svg',
          date: '2025-12 to 2026-03',
        },
        {
          name: 'Metis Hackathon Winners',
          type: 'winning',
          logo: '/Logo/metis/metis-symbol-blue.svg',
        },
        {
          name: 'Avax Hack2Build x402 Agent',
          type: 'featured',
          logo: '/Logo/avalanche/Avalanche Logomark/Avalanche Logomark/SVG/Avalanche_Logomark_Red.svg',
        },
      ],
      socialLinks: {
        github: 'https://github.com/HyperionKit',
        hackquest: 'https://hackquest.io/en/projects/Mantle-Global-Hackathon-2025-Hyperkit',
      },
    },
    hyperagent: {
    slug: 'hyperagent',
    title: 'HyperAgent',
    description: 'AI-powered autonomous agent system for comprehensive smart contract lifecycle management. Handles intelligent smart contract generation, batch auditing, automated deployment, cross-network bridging, and upgrade automation.',
    longDescription: [
      'AI-powered autonomous agent system for comprehensive smart contract lifecycle management.',
      'Handles intelligent smart contract generation, batch auditing, automated deployment, cross-network bridging, and upgrade automation. Operates natively within GitHub version control for seamless developer integration.',
      'Currently in development with 50% refactoring from monolithic to SOA architecture.',
    ],
    date: '12/01/2025',
    category: 'Blockchain / AI / Developer Tools / Automation',
    tags: ['AI Agent', 'Smart Contracts', 'Automation', 'Security Auditing', 'Deployment', 'Multi-chain', 'LLM', 'GitHub Integration'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/HyperAgent.png',
    bannerImage: '/v2/showcase/HyperAgent.png',
    technologies: ['Python', 'LLM/AI APIs', 'Solidity', 'TypeScript', 'GitHub API', 'Docker'],
    responsibilities: [
      'Agent architecture design',
      'Smart contract code generation',
      'Security audit implementation',
      'Deployment automation',
      'Error handling',
      'Integration orchestration',
    ],
      networks: ['Hyperion', 'Metis', 'Mantle', 'EigenDA', 'EVM Compatible'],
      hackathons: [
        {
          name: 'Mantle Global Hackathon 2025',
          type: 'featured',
          logo: '/Logo/mantle/Mantle-Brand-Assets/Mantle Logo Mark/Mantle-Logo-mark.svg',
        },
        {
          name: 'Metis Hackathon Winners',
          type: 'winning',
          logo: '/Logo/metis/metis-symbol-blue.svg',
        },
        {
          name: 'Avax Hack2Build x402 Agent',
          type: 'featured',
          logo: '/Logo/avalanche/Avalanche Logomark/Avalanche Logomark/SVG/Avalanche_Logomark_Red.svg',
        },
      ],
      socialLinks: {
        github: 'https://github.com/HyperionKit/HypertAgent',
        hackquest: 'https://www.hackquest.io/projects/Hyperkit',
      },
    },
    mevhunter: {
    slug: 'mevhunter',
    title: 'MEVHunter',
    description: 'Advanced crypto trading automation platform with MEV detection capabilities and automated trading strategies.',
    longDescription: [
      'MEVHunter is an advanced crypto trading automation platform with MEV detection capabilities.',
      'The platform provides sophisticated trading automation logic and MEV analysis for DeFi users and traders.',
      'Key focus on MEV detection, smart contract interaction, and automated trading logic across multiple chains.',
    ],
    date: '11/01/2024',
    category: 'DeFi / Trading',
    tags: ['Crypto', 'Trading', 'MEV', 'Automation', 'DeFi', 'Solidity'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/MEVHUNTER.png',
    bannerImage: '/v2/showcase/MEVHUNTER.png',
    technologies: ['Python', 'TypeScript', 'Solidity'],
    responsibilities: [
      'Trading automation logic',
      'MEV analysis',
      'Smart contract development',
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/MEVHunter-Advanced-Crypto-Trading-Automation',
    },
  },
  vynix: {
    slug: 'vynix',
    title: 'VYNIX',
    description: 'Blockchain infrastructure project focused on providing foundational tools for decentralized systems.',
    longDescription: [
      'VYNIX is a blockchain infrastructure project providing core tools and services for decentralized application development.',
      'Focused on building robust, scalable infrastructure components for the blockchain ecosystem.',
    ],
    date: '09/01/2025',
    category: 'Blockchain / Infrastructure',
    tags: ['Blockchain', 'Infrastructure', 'Solidity'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/vynix.png',
    bannerImage: '/v2/showcase/vynix.png',
    technologies: ['Solidity'],
    socialLinks: {
      github: 'https://github.com/JustineDevs/VYNIX_PUBLIC',
    },
  },
  'pineapple-ai': {
    slug: 'pineapple-ai',
    title: 'Pineapple AI',
    description: 'A comprehensive, SEO-optimized AI generator platform built with React and Tailwind CSS for managing AI-powered generators.',
    longDescription: [
      'Pineapple AI is a comprehensive, SEO-optimized AI generator platform built with React and Tailwind CSS.',
      'Provides complete solution for managing AI-powered generators with focus on chatbots, content creation, visual design, and technical solutions.',
    ],
    date: '04/25/2025',
    category: 'AI / Web Development',
    tags: ['AI', 'React', 'Tailwind CSS', 'SEO', 'Generator', 'Chatbot', 'Content Creation', 'TypeScript'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/Pineapple AI.png',
    bannerImage: '/v2/showcase/Pineapple AI.png',
    technologies: ['React', 'Tailwind CSS', 'TypeScript', 'Next.js'],
    responsibilities: [
      'Frontend development',
      'AI integration',
      'UI/UX design',
      'SEO optimization',
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/pineapple-ai',
    },
  },
  compensetracker: {
    slug: 'compensetracker',
    title: 'CompenseTracker',
    description: 'Advanced compensation calculator providing transparent analysis of true cost-to-company calculations with AI integration.',
    longDescription: [
      'Advanced compensation calculator providing transparent, detailed analysis of true cost-to-company calculations.',
      'Integrates multiple AI services to deliver personalized insights and automated email generation for compensation discussions.',
    ],
    date: '07/20/2025',
    category: 'HR / Finance / AI',
    tags: ['Compensation', 'AI', 'Finance', 'Calculator', 'HR', 'Automation', 'TypeScript'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/CompenseTracker.png',
    bannerImage: '/v2/showcase/CompenseTracker.png',
    technologies: ['TypeScript', 'Node.js', 'AI APIs'],
    responsibilities: [
      'Full-stack development',
      'AI service integration',
      'Email automation',
      'Calculation engine',
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/CompenseTracker',
    },
  },
  'metawalletgen-cli': {
    slug: 'metawalletgen-cli',
    title: 'MetaWalletGen-CLI',
    description: 'Secure CLI tool for generating Ethereum-compatible wallets using BIP-39 mnemonics and EIP-55 addresses with AES-256 encryption.',
    longDescription: [
      'Secure command-line tool that automates generating Ethereum-compatible wallets using BIP-39 mnemonics and EIP-55 addresses.',
      'Supports batch creation, encrypted storage with AES-256 encryption and PBKDF2 key derivation, and flexible exports (JSON, CSV, YAML formats).',
    ],
    date: '08/01/2025',
    category: 'Blockchain / Developer Tools',
    tags: ['Ethereum', 'Wallet', 'BIP-39', 'EIP-55', 'CLI', 'Security', 'AES-256', 'Developer Tools', 'Node.js'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/Banner V1 METAGEN WALLET.png',
    bannerImage: '/v2/showcase/Banner V1 METAGEN WALLET.png',
    technologies: ['Node.js', 'TypeScript', 'Cryptography', 'CLI'],
    responsibilities: [
      'CLI development',
      'Wallet generation logic',
      'Security implementation',
      'Encryption',
      'Testing',
    ],
    networks: ['Ethereum'],
    socialLinks: {
      github: 'https://github.com/JustineDevs/MetaWalletGen-CLI',
      linkedin: 'https://www.linkedin.com/posts/justine-devs-444608295_ethereum-blockchain-crypto-activity-7366029702819405824-ILYG',
    },
  },
  campushub: {
    slug: 'campushub',
    title: 'CampusHub',
    description: 'Unified platform for scholarships, team building, and governance on Base blockchain with a wallet-based interface.',
    longDescription: [
      'Unified platform that integrates micro-scholarships, team building, announcements, ideas, feedback, skill swaps, trivia, study groups, and governance in one wallet-based interface on Base blockchain.',
      'Each feature is a modular component. All actions are on-chain or provably tracked.',
    ],
    date: '08/27/2025',
    category: 'Blockchain / Community / Education',
    tags: ['Scholarships', 'Community', 'Governance', 'Web3', 'Base', 'Wallet', 'On-Chain', 'Education', 'Modular'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/CampusHub.png',
    bannerImage: '/v2/showcase/CampusHub.png',
    technologies: ['Solidity', 'React', 'TypeScript', 'Base Blockchain'],
    responsibilities: [
      'Smart contract development',
      'Frontend development',
      'Module architecture',
      'On-chain integration',
      'Product design',
    ],
    networks: ['Base'],
    hackathons: [
      {
        name: 'Base Build BLOKCSPACE - Base Mini App Challenge',
        type: 'participated',
        logo: '/v2/showcase/CampusHub.png',
        date: '2025-08-27',
        location: 'Makati, Philippines',
      },
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/CampusHub',
    },
  },
  'portfolio-v2': {
    slug: 'portfolio-v2',
    title: 'Portfolio V2',
    description: 'Second version of personal portfolio website showcasing projects and professional work with modern web technologies.',
    longDescription: [
      'Second version of portfolio website showcasing projects and professional work.',
      'Built with modern web technologies for optimal performance and user experience, featuring Next.js 15, React, and Tailwind CSS.',
    ],
    date: '01/10/2026',
    category: 'Portfolio / Web Development',
    tags: ['Portfolio', 'Web', 'Tailwind CSS', 'Next.js', 'React'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
      websiteUrl: 'https://jstn.site',
      coverImage: '/v2/showcase/portfolio V2.png',
      bannerImage: '/v2/showcase/portfolio V2.png',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'TypeScript'],
    responsibilities: [
      'Frontend development',
      'Web design',
      'Portfolio showcase',
      'UI/UX design',
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/Portfolio',
      website: 'https://jstn.site',
    },
  },
  'starter-pack': {
    slug: 'starter-pack',
    title: 'Starter Pack',
    description: 'Comprehensive resource for project initialization and best practices in blockchain and Web3 development.',
    longDescription: [
      'Starter Pack Template that synthesizes end-to-end execution playbooks, frameworks, and blueprints from practitioners who have generated measurable ROI.',
      'Comprehensive resource for project initialization and best practices in blockchain and Web3 development.',
    ],
    date: '06/01/2025',
    category: 'Development / Templates / Resources',
    tags: ['Starter Kit', 'Template', 'Framework', 'Best Practices', 'Boilerplate', 'Documentation', 'Blockchain'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
      coverImage: '/v2/showcase/starterpack.png',
      bannerImage: '/v2/showcase/starterpack.png',
    technologies: ['TypeScript', 'Node.js', 'Markdown'],
    responsibilities: [
      'Documentation',
      'Framework design',
      'Best practices compilation',
      'Community resource',
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/starter-pack',
    },
  },
  'portfolio-v1': {
    slug: 'portfolio-v1',
    title: 'MyPortfolio (V1)',
    description: 'Initial portfolio repository showcasing diverse blockchain and Web3 projects and professional work.',
    longDescription: [
      'Portfolio repository showcasing diverse blockchain and Web3 projects and professional work.',
      'The initial version of my portfolio journey, documenting early projects and learning progress.',
    ],
    date: '06/01/2024',
    category: 'Portfolio',
    tags: ['Portfolio', 'Projects', 'Showcase'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    websiteUrl: 'https://justinedevs.vercel.app',
    coverImage: '/v2/showcase/Portfolio V1.png',
    bannerImage: '/v2/showcase/Portfolio V1.png',
    responsibilities: [
      'Project documentation',
      'Portfolio management',
    ],
    socialLinks: {
      github: 'https://github.com/JustineDevs/MyPortfolio',
    },
  },
  'little-lemon': {
    slug: 'little-lemon',
    title: 'Little Lemon',
    description: 'Restaurant website and ordering system built as part of a professional certification.',
    longDescription: [
      'Little Lemon is a modern restaurant website featuring an online ordering system, menu management, and reservation capabilities.',
      'Built as part of a professional certification project, it demonstrates best practices in restaurant web development.',
    ],
    date: '10/01/2024',
    category: 'Restaurant',
    tags: ['Restaurant', 'Web App', 'E-commerce'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/Little Lemon.png',
    bannerImage: '/v2/showcase/Little Lemon.png',
    responsibilities: [
      'Website design and development',
      'Online ordering system',
      'Menu management',
      'Reservation system',
    ],
  },
  'aluth-ideathon': {
    slug: 'aluth-ideathon',
    title: 'Aluth Ideathon',
    description: 'Exploration of how blockchain secures data, presented at the Aluth Ideathon.',
    longDescription: [
      'Aluth Ideathon project exploring how blockchain technology can be leveraged to secure user data and enhance privacy.',
      'This project demonstrates practical applications of blockchain in data security and was presented at the Aluth Ideathon event.',
    ],
    date: '05/10/2025',
    category: 'Blockchain',
    tags: ['Blockchain', 'Security', 'Ideathon'],
    author: 'Justine Lupasi',
    authorWebsite: 'https://github.com/JustineDevs',
    coverImage: '/v2/showcase/Aluth.png',
    bannerImage: '/v2/showcase/Aluth.png',
    responsibilities: [
      'Concept development',
      'Technical implementation',
      'Presentation and pitch',
      'Team coordination',
    ],
    hackathons: [
      {
        name: 'Aluth Ideathon',
        type: 'featured',
        logo: '/v2/showcase/Aluth.png',
      },
    ],
  },
}

