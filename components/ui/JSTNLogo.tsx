import React from 'react';
import Image from 'next/image';

export type LogoVariant = 'abstract' | 'brand' | 'header';
export type LogoColor = 'black' | 'white' | 'iridescent';

interface JSTNLogoProps {
  variant: LogoVariant;
  color: LogoColor;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

const logoPaths: Record<LogoVariant, Record<LogoColor, string>> = {
  abstract: {
    black: '/JSTN Logo/SVG/Abstract Symbol - B.svg',
    white: '/JSTN Logo/SVG/Abstract Symbol - W.svg',
    iridescent: '/JSTN Logo/SVG/Abstract Symbol - irisdecent.svg',
  },
  brand: {
    black: '/JSTN Logo/SVG/Brand name - B.svg',
    white: '/JSTN Logo/SVG/Brand name - W.svg',
    iridescent: '/JSTN Logo/SVG/Brand Name - irisdecent.svg',
  },
  header: {
    black: '/JSTN Logo/SVG/Logo Header - B.svg',
    white: '/JSTN Logo/SVG/Logo Header - W.svg',
    iridescent: '/JSTN Logo/SVG/Logo Header - irisdecent.svg',
  },
};

export const JSTNLogo: React.FC<JSTNLogoProps> = ({
  variant,
  color,
  width,
  height,
  className = '',
  priority = false,
  alt = 'JSTN Logo',
}) => {
  const src = logoPaths[variant][color];

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority={priority}
      />
    </div>
  );
};

export default JSTNLogo;

