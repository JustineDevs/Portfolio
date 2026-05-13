/** @type {import('next').NextConfig} */
const { readFileSync } = require('fs')
const { join } = require('path')

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'))
const appVersion = typeof pkg.version === 'string' ? pkg.version : '0.0.0'
const appVersionTag = `v${appVersion}`

const nextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_APP_VERSION_TAG: appVersionTag,
  },
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Note: compiler.removeConsole is not supported by Turbopack yet
  // Remove console logs manually or use a babel plugin if needed
  
  // Optimize raster delivery; SVGs use unoptimized at call sites (see Navbar, Footer, BrandBadge, JSTNLogo).
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'slelguoygbfzlpylpxfs.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org', pathname: '/**' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'user-images.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'private-user-images.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.githubusercontent.com', pathname: '/**' },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
    
    // Custom splitChunks in dev breaks Next's dev chunk URLs (404 on main-app.js, framer-motion.js, routes).
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate large libraries (production client only)
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
    // Do not bundle native libsql into Server Components
    serverComponentsExternalPackages: [
      '@libsql/client',
      'libsql',
      '@libsql/win32-x64-msvc',
      '@libsql/darwin-arm64',
      '@libsql/darwin-x64',
      '@libsql/linux-x64-gnu',
      '@libsql/linux-x64-musl',
    ],
    // Enable faster refresh
    optimizePackageImports: [
      'lucide-react',
      '@lobehub/icons',
      'framer-motion',
    ],
  },
}

module.exports = nextConfig
