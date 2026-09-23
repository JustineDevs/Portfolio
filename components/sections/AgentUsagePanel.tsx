"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ActivityProviderLogo from "@/components/ui/ActivityProviderLogo";
import type { AgentProviderId } from "@/lib/usage/providers";

const providerMeta: Record<AgentProviderId, { label: string; color: string }> = {
  openai: { label: "Codex", color: "#111827" },
  claude: { label: "Claude Code", color: "#c2410c" },
  cursor: { label: "Cursor", color: "#2563eb" },
  orca: { label: "Orca", color: "#7c3aed" },
};
const providers: AgentProviderId[] = ["openai", "claude", "cursor"];
const sourceProviders: AgentProviderId[] = [...providers, "orca"];
const weeks = Array.from({ length: 52 }, (_, week) => Array.from({ length: 7 }, (_, day) => `${week}-${day}`));
const monthWeekIndexes = [0, 4, 8, 13, 17, 22, 26, 30, 35, 39, 44, 48];
const years = [2026, 2025, 2024, 2023];
type ProviderUsage = { totalTokens: number | null; estimatedCost?: number | null; activeDays: number | null; daily: Record<string, number>; totalMessages?: number; totalEvents?: number };
type HoveredUsageCell = { date: string; provider: AgentProviderId; value: number; x: number; y: number };

function rgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  return `rgba(${Number.parseInt(value.slice(0, 2), 16)}, ${Number.parseInt(value.slice(2, 4), 16)}, ${Number.parseInt(value.slice(4, 6), 16)}, ${alpha})`;
}

function compactNumber(value: number) {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1).replace(/\.0$/, "")}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return value.toLocaleString();
}

export default function AgentUsagePanel() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [usage, setUsage] = useState<Record<AgentProviderId, ProviderUsage> | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HoveredUsageCell | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(sourceProviders.map(async (provider) => {
      const response = await fetch(`/api/usage?provider=${provider}&year=${selectedYear}`);
      return [provider, await response.json()] as const;
    })).then((entries) => { if (!cancelled) setUsage(Object.fromEntries(entries) as Record<AgentProviderId, ProviderUsage>); }).catch(() => { if (!cancelled) setUsage(null); });
    return () => { cancelled = true; };
  }, [selectedYear]);

  const summary = useMemo(() => {
    const dailyByProvider = Object.fromEntries(providers.map((provider) => [provider, Object.fromEntries(Object.entries({ ...(usage?.[provider]?.daily ?? {}), ...(provider === "openai" ? usage?.orca?.daily ?? {} : {}) }).map(([date, value]) => [date, (usage?.[provider]?.daily?.[date] ?? 0) + (provider === "openai" ? usage?.orca?.daily?.[date] ?? 0 : 0)]))])) as Record<AgentProviderId, Record<string, number>>;
    const maxByProvider = Object.fromEntries(providers.map((provider) => [provider, Math.max(...Object.values(dailyByProvider[provider]), 0)])) as Record<AgentProviderId, number>;
    const dates = new Set(Object.values(dailyByProvider).flatMap((daily) => Object.keys(daily).filter((date) => daily[date] > 0)));
    const indexedProviders = providers.filter((provider) => (usage?.[provider]?.activeDays ?? 0) > 0);
    const activity = sourceProviders.reduce((total, provider) => total + (usage?.[provider]?.totalMessages ?? 0) + (usage?.[provider]?.totalEvents ?? 0), 0);
    const tokens = sourceProviders.reduce((total, provider) => total + (usage?.[provider]?.totalTokens ?? 0), 0);
    const cost = sourceProviders.reduce((total, provider) => total + (usage?.[provider]?.estimatedCost ?? 0), 0);
    return { dailyByProvider, maxByProvider, dates, indexedProviders, activity, tokens, cost };
  }, [usage]);

  function cellFor(date: string) {
    const candidates = providers.map((provider) => ({ provider, value: summary.dailyByProvider[provider][date] ?? 0, ratio: summary.maxByProvider[provider] ? (summary.dailyByProvider[provider][date] ?? 0) / summary.maxByProvider[provider] : 0 })).filter((candidate) => candidate.value > 0).sort((a, b) => b.ratio - a.ratio);
    const winner = candidates[0];
    if (!winner) return { color: "#E1E3E6", title: date, provider: undefined, value: 0 };
    return { color: rgba(providerMeta[winner.provider].color, 0.3 + winner.ratio * 0.7), title: `${date}: ${providerMeta[winner.provider].label} · ${winner.value.toLocaleString()} activity`, provider: winner.provider, value: winner.value };
  }

  return (
    <div aria-label="Combined AI usage analytics">
      <div className="mb-4 xs:mb-5 sm:mb-6"><p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#1342FF]">Stats &amp; Usage</p><h3 className="mt-1.5 text-[13px] xs:text-[14px] sm:text-[15px] font-semibold text-[#424242]">Combined AI Usage</h3><p className="mt-2 max-w-xl text-[11px] leading-5 text-[#666666]">One view of indexed activity across Codex, Claude Code, and Cursor. Orca activity is counted under Codex.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden border border-[#D5D5D5] rounded-none mb-4 xs:mb-5 sm:mb-6 bg-[#D5D5D5]">
        {[["Agent events", summary.activity ? compactNumber(summary.activity) : "—"], ["Indexed tokens", summary.tokens ? compactNumber(summary.tokens) : "—"], ["Active days", summary.dates.size || "—"], ["Est. API cost", summary.cost ? `$${summary.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"]].map(([label, value]) => <div key={label} className="bg-[#EEF0F2] p-2.5 xs:p-3 sm:p-3.5 min-h-[62px]"><div className="text-[9px] xs:text-[10px] text-[#666666] font-medium mb-0.5 xs:mb-1">{label}</div><div className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold text-[#424242]">{value}</div></div>)}
      </div>
      <p className="-mt-2 mb-4 text-[10px] leading-4 text-[#777777]">API-equivalent estimate from indexed model tokens and official OpenAI rates; rows without token-level billing data are excluded.</p>
      <div className="w-full min-w-0 bg-[#EEF0F2] border border-[#D5D5D5] rounded-none p-3 xs:p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2"><div><p className="text-[13px] xs:text-[14px] sm:text-[15px] font-semibold text-[#424242]">Daily intensity</p><p className="mt-1 text-[10px] xs:text-[11px] text-[#666666]">Combined provider activity · cell color shows the leading provider</p></div><div className="flex items-center gap-0.5" aria-label="Activity years">{years.map((year) => <button key={year} type="button" onClick={() => setSelectedYear(year)} className={`px-1.5 py-0.5 text-[9px] font-semibold transition-colors ${selectedYear === year ? "bg-[#424242] text-white" : "text-[#666666] hover:text-[#1342FF]"}`}>{year}</button>)}</div></div>
        <div className="flex items-center gap-4"><div className="min-w-0 flex-1 overflow-x-auto"><div className="relative min-w-[700px]"><div className="relative ml-[36px] mb-2 h-4">{(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const).map((month, index) => <span key={month} className="text-[9px] sm:text-[11px] text-[#666666] font-medium absolute" style={{ left: `calc(40px + ${monthWeekIndexes[index]} * 15px)` }}>{month}</span>)}</div><div className="flex gap-[3px]"><div className="flex flex-col gap-[3px] mr-2 w-8">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => <span key={day} className={`text-[10px] text-[#666666] h-[12px] leading-none font-medium flex items-center ${index % 2 === 0 ? "opacity-0" : ""}`}>{day}</span>)}</div><div className="flex gap-[3px]">{weeks.map((week, weekIndex) => <div key={weekIndex} className="flex flex-col gap-[3px]">{week.map((cell) => { const [, dayIndex] = cell.split("-").map(Number); const date = new Date(Date.UTC(selectedYear, 0, 1 + weekIndex * 7 + dayIndex)).toISOString().slice(0, 10); const result = cellFor(date); return <div key={cell} title={result.title} onMouseEnter={(event) => { if (!result.provider) return; const rect = event.currentTarget.getBoundingClientRect(); setHoveredCell({ date, provider: result.provider, value: result.value, x: rect.left + rect.width / 2, y: rect.top - 8 }); }} onMouseLeave={() => setHoveredCell(null)} className={`w-[12px] h-[12px] rounded-[2px] transition-colors ${result.provider ? "cursor-pointer hover:ring-2 hover:ring-[#424242] hover:ring-offset-1" : ""}`} style={{ backgroundColor: result.color }} />; })}</div>)}</div></div><div className="mt-3 flex justify-end items-center gap-3 text-[9px] text-[#666666]"><span>Color = provider</span><span>Intensity = activity</span></div></div></div><div className="hidden w-28 shrink-0 flex-col justify-center gap-2 sm:flex" aria-label="Activity providers">{providers.map((provider) => <div key={provider} className="flex items-center gap-1.5 text-[9px] font-medium" style={{ color: providerMeta[provider].color }}><ActivityProviderLogo provider={provider} className="size-4" /><span>{providerMeta[provider].label}</span></div>)}</div></div>
      </div>
      {hoveredCell && typeof document !== "undefined" ? createPortal(<div className="fixed z-[9999] -translate-x-1/2 -translate-y-full rounded bg-[#424242] px-3 py-2 text-center text-[11px] font-medium text-white shadow-lg pointer-events-none" style={{ left: hoveredCell.x, top: hoveredCell.y - 6 }}><div className="font-semibold">{providerMeta[hoveredCell.provider].label} · {hoveredCell.value.toLocaleString()} activity</div><div className="text-[10px] text-white/80">{new Date(`${hoveredCell.date}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div><div className="absolute left-1/2 top-full -translate-x-1/2 border-x-[4px] border-t-[4px] border-x-transparent border-t-[#424242]" /></div>, document.body) : null}
    </div>
  );
}
