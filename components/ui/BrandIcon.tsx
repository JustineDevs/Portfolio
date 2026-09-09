"use client";

interface BrandIconProps {
  slug?: string;
  src?: string;
  alt: string;
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

/** Loads a real brand SVG from Simple Icons CDN; no hand-drawn approximations. */
export default function BrandIcon({ slug, src, alt, className = "", color, width, height }: BrandIconProps) {
  const colorSuffix = color ? `/${color}` : "";
  const imageSource = src ?? `https://cdn.simpleicons.org/${slug}${colorSuffix}`;
  return <img src={imageSource} alt={alt} width={width} height={height} className={className} loading="lazy" />;
}
