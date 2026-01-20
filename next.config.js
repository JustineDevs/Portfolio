/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Note: compiler.removeConsole is not supported by Turbopack yet
  // Remove console logs manually or use a babel plugin if needed
  
  // Optimize images
  images: {
    domains: [
      'slelguoygbfzlpylpxfs.supabase.co',
      'cdn.jsdelivr.net',
      'cdn.simpleicons.org'
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Faster builds in development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/.next',
          '**/public',
          // Ignore system files that cause watchpack errors
          '**/DumpStack.log.tmp',
          '**/hiberfil.sys',
          '**/pagefile.sys',
          '**/swapfile.sys',
        ],
      }
    }
    
    // Optimize chunk splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate large libraries
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              priority: 20,
            },
            lobehub: {
              name: 'lobehub',
              test: /[\\/]node_modules[\\/]@lobehub[\\/]/,
              priority: 15,
            },
            antd: {
              name: 'antd',
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              priority: 15,
            },
            framer: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 15,
            },
            gsap: {
              name: 'gsap',
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              priority: 15,
            },
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          },
        },
      }
    }
    
    return config
  },
  
  // Experimental features for faster builds
  experimental: {
    // Enable faster refresh
    optimizePackageImports: [
      'lucide-react',
      '@lobehub/icons',
      'framer-motion',
    ],
  },
}

module.exports = nextConfig
