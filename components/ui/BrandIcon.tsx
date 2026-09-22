"use client";

import Image from "next/image";

interface BrandIconProps {
  slug?: string;
  src?: string;
  alt: string;
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/** Loads a real brand SVG from Simple Icons CDN; no hand-drawn approximations. */
export default function BrandIcon({ slug, src, alt, className = "", color, width, height, priority }: BrandIconProps) {
  const colorSuffix = color ? `/${color}` : "";
  const imageSource = src ?? `https://cdn.simpleicons.org/${slug}${colorSuffix}`;
  return <Image src={imageSource} alt={alt} width={width || 64} height={height || 64} priority={priority} unoptimized className={className} />;
}
