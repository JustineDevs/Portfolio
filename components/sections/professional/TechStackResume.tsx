"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function TechStackResume() {
  const categories = [
    {
      title: 'FRONTEND',
      items: ['Typescript', 'TailwindCSS', 'HTML5', 'Three.js', 'Astro', 'Shadcn/UI', 'Vite', 'Redux', 'PostCSS', 'Next.js', 'CSS3', 'Vue.js', 'Babylon.js', 'Styled Components', 'Radix UI', 'Webpack', 'Prettier', 'Framer Motion'],
    },
    {
      title: 'BACKEND',
      items: ['Java', 'Python', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase DB', 'GraphQL', 'gRPC', 'Websockets', 'OAuth 2.0', 'JWT'],
    },
    {
      title: 'CMS & NO-CODE',
      items: ['ComfyUI', 'N8N'],
    },
    {
      title: 'DEVOPS & CLOUD',
      items: ['Vercel', 'GitHub Actions', 'Warp', 'CUP', 'Grafana', 'Docker', 'DegenCloud', 'Pinata IPFS', 'Prometheus'],
    },
    {
      title: 'AI & MACHINE LEARNING',
      items: ['Anthropic', 'OPENAI', 'Hugging Face', 'LlamaIndex', 'GEMINI', 'GROK AI', 'TensorFlow', 'PyTorch'],
    },
    {
      title: 'BLOCKCHAIN & WEB3',
      items: ['Move', 'Solana', 'Rust', 'Ethereum', 'Web3.js', 'Viem', 'Wagmi', 'RainbowKit', 'ConnectKit', 'Thirdweb SDK', 'Alchemy SDK', 'ERC-4337', 'ERC-4066', 'ERC-2771'],
    },
    {
      title: 'SECURITY & IDENTITY',
      items: ['OAuth2.0', 'WebAuthn', 'Multi-Sig', 'AES-256', 'RSA', 'ECDSA', 'SHA-256', 'bcrypt', 'GDPR', 'SOC 2', 'ISO 27001', 'OWASP Top 10', 'Static Analysis', 'OpenZeppelin Contracts'],
    },
    {
      title: 'DEVELOPER TOOLS',
      items: ['Cursor IDE', 'VS Code', 'Claude', 'Visual Studio', 'Antigravity', 'Unreal Engine 5'],
    },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="p-8 lg:p-12">
        <h2 className="text-[24px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Tech Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="text-[12px] font-bold text-[#424242] mb-3 uppercase tracking-wide">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="px-2 py-1 text-[11px] text-[#555555] bg-[#f5f5f5] rounded border border-[#e0e0e0]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

