"use client";

import { useEffect, useMemo, useState } from "react";
import ActivityProviderLogo from "@/components/ui/ActivityProviderLogo";
import type { AgentProviderId } from "@/lib/usage/providers";

const providerMeta: Record<AgentProviderId, { label: string; color: string }> = {
  openai: { label: "OpenAI (Codex)", color: "#111827" },
  claude: { label: "Claude Code", color: "#c2410c" },
  cursor: { label: "Cursor", color: "#2563eb" },
};

const providers: AgentProviderId[] = ["openai", "claude", "cursor"];

const weeks = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => `${week}-${day}`),
);
const monthWeekIndexes = [0, 4, 8, 13, 17, 22, 26, 30, 35, 39, 44, 48];
const years = [2026, 2025, 2024, 2023];

export default function AgentUsagePanel({ provider }: { provider: AgentProviderId }) {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [usage, setUsage] = useState<{ totalTokens: number | null; estimatedCost: number | null; activeDays: number | null; cacheShare: number | null; daily: Record<string, number> } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/usage?provider=${provider}&year=${selectedYear}`)
      .then((response) => response.json())
      .then((payload) => { if (!cancelled) setUsage(payload); })
      .catch(() => { if (!cancelled) setUsage(null); });
    return () => { cancelled = true; };
  }, [provider, selectedYear]);

  const formattedMetrics = useMemo(() => [
    ["Total tokens", usage?.totalTokens == null ? "—" : usage.totalTokens.toLocaleString()],
    ["Est. cost", usage?.estimatedCost == null ? "—" : `$${usage.estimatedCost.toFixed(2)}`],
    ["Active days", usage?.activeDays == null ? "—" : String(usage.activeDays)],
  ] as const, [usage]);

  return (
    <div aria-label={`${providerMeta[provider].label} usage analytics`}>
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#1342FF]">Stats &amp; Usage</p>
        <h3 className="mt-1.5 text-[13px] xs:text-[14px] sm:text-[15px] font-semibold text-[#424242]">Usage Overview</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden border border-[#D5D5D5] rounded-none mb-4 xs:mb-5 sm:mb-6 bg-[#D5D5D5]">
        {formattedMetrics.map(([label, value]) => (
          <div key={label} className="bg-[#EEF0F2] p-2.5 xs:p-3 sm:p-3.5 min-h-[62px]">
            <div className="text-[9px] xs:text-[10px] text-[#666666] font-medium mb-0.5 xs:mb-1">{label}</div>
            <div className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold text-[#424242]">{value}</div>
          </div>
        ))}
        <div className="bg-[#EEF0F2] p-2.5 xs:p-3 sm:p-3.5 min-h-[62px]">
          <div className="flex items-center justify-between gap-2 text-[9px] xs:text-[10px] text-[#666666] font-medium mb-0.5 xs:mb-1">
            <span>Cache share</span>
            <span className="text-[#424242]">{usage?.cacheShare == null ? "—" : `${Math.round(usage.cacheShare * 100)}%`}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#D5D5D5]" aria-label="Cache share"><div className="h-full rounded-full bg-[#424242] transition-[width] duration-500" style={{ width: `${Math.round((usage?.cacheShare ?? 0) * 100)}%` }} /></div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] text-[#666666]" aria-label="Provider color key">
            {providers.map((id) => (
              <span key={id} className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: providerMeta[id].color }} />
                {providerMeta[id].label.replace(" (Codex)", "")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 xs:space-y-5 sm:space-y-6">
        <div className="w-full min-w-0 bg-[#EEF0F2] border border-[#D5D5D5] rounded-none p-3 xs:p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-[13px] xs:text-[14px] sm:text-[15px] font-semibold text-[#424242]">Daily intensity</p>
              <p className="mt-1 text-[10px] xs:text-[11px] text-[#666666]">Combined token activity</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-0.5" aria-label="Activity years">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`px-1.5 py-0.5 text-[9px] font-semibold transition-colors ${selectedYear === year ? "bg-[#424242] text-white" : "text-[#666666] hover:text-[#1342FF]"}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <div className="relative min-w-[700px]">
              <div className="relative ml-[28px] mb-1.5 h-4 [--heatmap-label-offset:28px] [--heatmap-cell-step:13px] xs:ml-[32px] xs:mb-2 xs:[--heatmap-label-offset:34px] xs:[--heatmap-cell-step:14px] sm:ml-[36px] sm:[--heatmap-label-offset:40px] sm:[--heatmap-cell-step:15px]">
                {(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const).map((month, index) => (
                  <span key={month} className="text-[9px] xs:text-[10px] sm:text-[11px] text-[#666666] font-medium absolute" style={{ left: `calc(var(--heatmap-label-offset) + ${monthWeekIndexes[index]} * var(--heatmap-cell-step))` }}>{month}</span>
                ))}
              </div>
              <div className="flex gap-[3px]">
                <div className="flex flex-col gap-[3px] mr-1 xs:mr-1.5 sm:mr-2 w-6 xs:w-7 sm:w-8">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => <span key={day} className={`text-[8px] xs:text-[9px] sm:text-[10px] text-[#666666] h-[10px] xs:h-[11px] sm:h-[12px] leading-none font-medium flex items-center ${index % 2 === 0 ? "opacity-0" : ""}`}>{day}</span>)}
                </div>
                <div className="flex gap-[3px]">
                  {weeks.map((week, weekIndex) => <div key={weekIndex} className="flex flex-col gap-[3px]">{week.map((cell) => { const [, dayIndex] = cell.split("-").map(Number); const date = new Date(Date.UTC(selectedYear, 0, 1 + weekIndex * 7 + dayIndex)).toISOString().slice(0, 10); const value = usage?.daily?.[date] ?? 0; const color = value > 0 ? value > (usage?.totalTokens ?? 0) / 20 ? "#424242" : "#7B8188" : "#E1E3E6"; return <div key={cell} title={value ? `${date}: ${value.toLocaleString()} tokens` : date} className="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] transition-colors" style={{ backgroundColor: color }} />; })}</div>)}
                </div>
              </div>
                <div className="mt-2 xs:mt-3 flex justify-end items-center gap-1 xs:gap-1.5">
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#666666] font-medium">Less</span>
                  <div className="flex gap-[3px]">
                    {["#E1E3E6", "#B8BDC3", "#7B8188", "#424242"].map((color) => <div key={color} className="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px]" style={{ backgroundColor: color }} />)}
                  </div>
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#666666] font-medium">More</span>
                </div>
              </div>
            </div>
            <div className="hidden w-28 shrink-0 flex-col justify-center gap-2 sm:flex" aria-label="Activity providers">
              {providers.map((id) => (
                <div key={id} className="flex items-center gap-1.5 text-[9px] font-medium text-[#666666]">
                  <ActivityProviderLogo provider={id} className="size-4" />
                  <span>{id === "openai" ? "Codex" : providerMeta[id].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
