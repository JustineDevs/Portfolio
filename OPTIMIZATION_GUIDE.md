# Performance Optimization Guide

## Current Issues
- Initial compilation: ~23 seconds (26,915 modules)
- First page load: ~24 seconds
- Watchpack errors for system files

## Optimizations Applied

### 1. **Turbopack (Next.js 14+)**
- Enabled via `--turbo` flag in dev script
- **Expected improvement**: 50-70% faster compilation
- **Usage**: `npm run dev` (now uses Turbopack by default)

### 2. **Webpack Optimizations**
- **Chunk Splitting**: Separated large libraries (Three.js, LobeHub, Antd, Framer Motion, GSAP)
- **Watch Options**: Ignored system files causing watchpack errors
- **Polling**: Optimized file watching for Windows

### 3. **SWC Minification**
- Enabled SWC minifier (faster than Terser)
- Removes console logs in production

### 4. **Package Import Optimization**
- Optimized imports for:
  - `lucide-react`
  - `@lobehub/icons`
  - `framer-motion`

## Additional Recommendations

### 1. **Lazy Load Heavy Components**
```typescript
// Instead of:
import AvatarParticlesCanvas from './three/AvatarParticlesCanvas'

// Use:
const AvatarParticlesCanvas = dynamic(() => import('./three/AvatarParticlesCanvas'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})
```

### 2. **Reduce Bundle Size**
- Consider removing unused dependencies:
  - `antd` (if not heavily used)
  - `@lobehub/ui` (if only using icons)
  - `@lobehub/fluent-emoji` (if not used)

### 3. **Image Optimization**
- Use Next.js Image component (already done ✓)
- Consider using WebP/AVIF formats
- Lazy load images below the fold

### 4. **Code Splitting**
- Use dynamic imports for:
  - Three.js components (AvatarParticlesCanvas)
  - Heavy animations (GSAP, Framer Motion)
  - Large libraries

### 5. **TypeScript Optimization**
- Already using `incremental: true` ✓
- Consider `skipLibCheck: true` (already enabled ✓)

## Expected Results

### Before:
- Initial compile: ~23s
- First load: ~24s
- Hot reload: ~1.6s

### After (with Turbopack):
- Initial compile: ~7-10s (60% faster)
- First load: ~8-12s (50% faster)
- Hot reload: ~0.5-1s (40% faster)

## Monitoring

Check build performance:
```bash
# See detailed build stats
npm run build

# Check bundle size
npx @next/bundle-analyzer
```

## Troubleshooting

If Turbopack causes issues:
```bash
# Use legacy webpack
npm run dev:legacy
```

## System File Errors

The watchpack errors for system files (DumpStack.log.tmp, etc.) are now ignored in webpack config. These are Windows system files and don't affect functionality.

