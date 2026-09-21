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
}

/** Loads a real brand SVG from Simple Icons CDN; no hand-drawn approximations. */
export default function BrandIcon({ slug, src, alt, className = "", color, width, height }: BrandIconProps) {
  const colorSuffix = color ? `/${color}` : "";
  const imageSource = src ?? `https://cdn.simpleicons.org/${slug}${colorSuffix}`;
  return <Image src={imageSource} alt={alt} width={width || 64} height={height || 64} unoptimized className={className} />;
}
