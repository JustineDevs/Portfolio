"use client";

export function RetroGrid({
  className = "",
  angle = 65,
  cellSize = 60,
  opacity = 0.2,
  lightLineColor = "#ffffff",
  darkLineColor = "#000000",
}: {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lightLineColor?: string;
  darkLineColor?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 [perspective:2000px] ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(${angle}deg, ${darkLineColor} 1px, transparent 1px),
          linear-gradient(${angle + 90}deg, ${darkLineColor} 1px, transparent 1px),
          linear-gradient(${angle}deg, ${lightLineColor} 1px, transparent 1px),
          linear-gradient(${angle + 90}deg, ${lightLineColor} 1px, transparent 1px)
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
        backgroundPosition: `0 0, 0 0, ${cellSize / 2}px ${cellSize / 2}px, ${cellSize / 2}px ${cellSize / 2}px`,
        opacity,
      }}
    />
  );
}

