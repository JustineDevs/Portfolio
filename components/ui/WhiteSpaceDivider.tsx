import React from 'react';
import CornerDot from './CornerDot';

export default function WhiteSpaceDivider() {
  return (
    <div className="relative border-l border-r border-b border-[#d5d5d5] h-[72px] bg-[#F8F8F8]">
      <CornerDot position="bl" />
      <CornerDot position="br" />
    </div>
  );
}
