import React from 'react';

type Position = 'tl' | 'tr' | 'bl' | 'br';

export default function CornerDot({ position, className = '' }: { position: Position, className?: string }) {
  const positionClasses = {
    tl: 'top-[-5px] left-[-5px]',
    tr: 'top-[-5px] right-[-5px]',
    bl: 'bottom-[-5px] left-[-5px]',
    br: 'bottom-[-5px] right-[-5px]',
  };

  return (
    <div 
      className={`absolute w-[9px] h-[9px] bg-white border border-[#d5d5d5] rounded-[2px] z-50 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] ${positionClasses[position]} ${className}`} 
      aria-hidden="true"
    />
  );
}
