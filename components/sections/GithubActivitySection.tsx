"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

import CornerDot from "@/components/ui/CornerDot";
import type { GithubActivitySummary } from "@/lib/github/normalize-activity";
import AgentUsagePanel from "@/components/sections/AgentUsagePanel";
import ActivityProviderLogo from "@/components/ui/ActivityProviderLogo";
import type { ActivityProviderId } from "@/lib/usage/providers";

interface HoveredCell {
  date: string;
  contributions: number;
  x: number;
  y: number;
}

const fallbackYears = [2026, 2025, 2024, 2023];
const activityFilters = [
  { id: "github" as const, label: "GitHub" },
  { id: "ai" as const, label: "AI Usage" },
];

function contributionColor(count: number) {
  if (count <= 0) return "#E1E3E6";
  if (count <= 3) return "#B8BDC3";
  if (count <= 8) return "#7B8188";
  return "#424242";
}

export default function GithubActivitySection() {
  const [activityByYear, setActivityByYear] = useState<Record<number, GithubActivitySummary>>({});
  const [selectedYear, setSelectedYear] = useState<number>(fallbackYears[0]);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ActivityProviderId>("github");
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadActivity() {
      try {
        const response = await fetch(`/api/activity?years=${fallbackYears.join(",")}`);
        const payload = await response.json();
        const years = payload?.years || {};
        setActivityByYear(years);
        const available = Object.keys(years)
          .map((value) => Number.parseInt(value, 10))
          .sort((a, b) => b - a);
        if (available.length > 0) {
          setSelectedYear(available[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadActivity();
  }, []);

  const yearOptions = useMemo(() => {
    const keys = Object.keys(activityByYear)
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => b - a);

    return keys.length > 0 ? keys : fallbackYears;
  }, [activityByYear]);

  const summary = activityByYear[selectedYear];
  const weeks = useMemo(() => summary?.weeks ?? [], [summary?.weeks]);
  const totalRepos = 0;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let previousMonth = "";

    weeks.forEach((week, weekIndex) => {
      const firstDate = week.contributionDays[0]?.date;
      if (!firstDate) return;
      const month = new Date(firstDate).toLocaleDateString("en-US", { month: "short" });
      if (month !== previousMonth) {
        labels.push({ month, weekIndex });
        previousMonth = month;
      }
    });

    return labels;
  }, [weeks]);

  const stats = useMemo(() => {
    if (!summary) {
      return {
        totalContributions: 0,
        activeDays: 0,
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    const flattened = weeks.flatMap((week) => week.contributionDays);
    const activeDays = flattened.filter((day) => day.contributionCount > 0).length;

    let longestStreak = 0;
    let currentStreak = 0;
    let running = 0;

    flattened.forEach((day) => {
      if (day.contributionCount > 0) {
        running += 1;
        longestStreak = Math.max(longestStreak, running);
      } else {
        running = 0;
      }
    });

    const reversed = [...flattened].reverse();
    for (const day of reversed) {
      if (day.contributionCount > 0) {
        currentStreak += 1;
      } else if (currentStreak > 0) {
        break;
      }
    }

    return {
      totalContributions: summary.totalContributions,
      activeDays,
      currentStreak,
      longestStreak,
    };
  }, [summary, weeks]);

  const activePercentage = useMemo(() => {
    if (!weeks.length) return 0;
    const totalDays = weeks.reduce((count, week) => count + week.contributionDays.length, 0);
    return totalDays ? Math.round((stats.activeDays / totalDays) * 100) : 0;
  }, [stats.activeDays, weeks]);

  const handleCellHover = (
    contributionCount: number,
    date: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (contributionCount === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredCell({
      date,
      contributions: contributionCount,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="w-full">
      <div className="relative border-l border-r border-b border-[#d5d5d5] h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
        <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
          Activity
        </h2>
      </div>

      <div className="relative border-l border-r border-b border-[#d5d5d5] p-3 xs:p-4 sm:p-5 md:p-6">
        <CornerDot position="bl" className="hidden xs:block" />
        <CornerDot position="br" className="hidden xs:block" />

        <div className="mb-4 xs:mb-5 sm:mb-6">
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Activity provider filters">
            {activityFilters.map((provider) => (
              <button
                key={provider.id}
                type="button"
                role="tab"
                aria-selected={provider.id === "github" ? selectedProvider === "github" : selectedProvider !== "github"}
                onClick={() => setSelectedProvider(provider.id === "github" ? "github" : "openai")}
                aria-label={provider.label}
                title={provider.label}
                className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${(provider.id === "github" ? selectedProvider === "github" : selectedProvider !== "github") ? "bg-[#424242] text-white" : "bg-white text-[#666666] hover:bg-[#f0f1f2] hover:text-[#424242]"}`}
              >
                {provider.id === "github" ? (
                  <ActivityProviderLogo
                    provider="github"
                    selected={selectedProvider === "github"}
                    className="size-3.5 shrink-0"
                  />
                ) : null}
                <span>{provider.label}</span>
              </button>
            ))}
          </div>
          {selectedProvider !== "github" ? <>
            <AgentUsagePanel />
          </> : null}
          {selectedProvider === "github" ? <>
          <h3 className="text-[13px] xs:text-[14px] sm:text-[15px] font-semibold text-[#424242] mb-1 xs:mb-1.5">
            GitHub activity
          </h3>
          <p className="text-[11px] xs:text-[12px] sm:text-[13px] leading-[1.6] text-[#666666] max-w-[480px]">
            {summary
              ? `${summary.username}'s contribution activity for ${selectedYear}. ${summary.totalContributions.toLocaleString()} contributions tracked.`
              : "GitHub activity is loading or unavailable. Last-known snapshots will appear here after the first refresh."}
          </p>
          </> : null}
        </div>

        {selectedProvider === "github" ? <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden border border-[#D5D5D5] rounded-none mb-4 xs:mb-5 sm:mb-6 bg-[#D5D5D5]">
          {[
            ["Total Contributions", stats.totalContributions.toLocaleString(), "#424242"],
            ["Active Days", String(stats.activeDays), "#424242"],
            ["Current Streak", `${stats.currentStreak} days`, "#1342FF"],
            ["Longest Streak", `${stats.longestStreak} days`, "#424242"],
          ].map(([label, value, color], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-[#EEF0F2] p-2.5 xs:p-3 sm:p-3.5 min-h-[62px]"
            >
              <div className="text-[9px] xs:text-[10px] text-[#666666] font-medium mb-0.5 xs:mb-1">
                {label}
              </div>
              <div className="text-[14px] xs:text-[16px] sm:text-[18px] font-bold" style={{ color }}>
                {value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 xs:gap-4 sm:gap-5 items-start flex-col lg:flex-row">
          <div className="flex-1 min-w-0 bg-[#EEF0F2] border border-[#D5D5D5] rounded-none p-3 xs:p-4 sm:p-5 w-full">
            <div className="w-full min-w-0 overflow-x-auto">
              <div className="relative min-w-[700px]">
                <div className="relative ml-[28px] mb-1.5 h-4 [--heatmap-label-offset:28px] [--heatmap-cell-step:13px] xs:ml-[32px] xs:mb-2 xs:[--heatmap-label-offset:34px] xs:[--heatmap-cell-step:14px] sm:ml-[36px] sm:[--heatmap-label-offset:40px] sm:[--heatmap-cell-step:15px]">
                  {monthLabels.map((label, i) => (
                    <span
                      key={`${label.month}-${i}`}
                      className="text-[9px] xs:text-[10px] sm:text-[11px] text-[#666666] font-medium absolute"
                      style={{ left: `calc(var(--heatmap-label-offset) + ${label.weekIndex} * var(--heatmap-cell-step))` }}
                    >
                      {label.month}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[3px]">
                  <div className="flex flex-col gap-[3px] mr-1 xs:mr-1.5 sm:mr-2 w-6 xs:w-7 sm:w-8">
                    {days.map((day, i) => (
                      <span
                        key={day}
                        className={`text-[8px] xs:text-[9px] sm:text-[10px] text-[#666666] h-[10px] xs:h-[11px] sm:h-[12px] leading-none font-medium flex items-center ${
                          i % 2 === 0 ? "opacity-0" : ""
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-[3px]">
                    {weeks.map((week, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-[3px]">
                        {week.contributionDays.map((day) => (
                          <motion.div
                            key={day.date}
                            onMouseEnter={(event) =>
                              handleCellHover(day.contributionCount, day.date, event)
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] ${
                              day.contributionCount > 0
                                ? "cursor-pointer hover:ring-2 hover:ring-[#424242] hover:ring-offset-1"
                                : ""
                            }`}
                            style={{ backgroundColor: contributionColor(day.contributionCount) }}
                            whileHover={day.contributionCount > 0 ? { scale: 1.3, zIndex: 10 } : {}}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 xs:mt-4 flex justify-between items-center gap-1.5 xs:gap-2">
                  <span className="text-[9px] xs:text-[10px] sm:text-[11px] text-[#666666] font-medium">
                    {activePercentage}% of days active in the last year
                  </span>
                  <div className="flex items-center gap-1.5 xs:gap-2">
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#666666] font-medium">
                    Less
                  </span>
                  <div className="flex gap-[3px]">
                    <div className="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] bg-[#E1E3E6]" />
                    <div className="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] bg-[#B8BDC3]" />
                    <div className="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] bg-[#7B8188]" />
                    <div className="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] bg-[#424242]" />
                  </div>
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#666666] font-medium">
                    More
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-1 xs:gap-1.5 w-full lg:w-[70px] xl:w-[80px] shrink-0">
            {yearOptions.map((year) => (
              <motion.button
                key={year}
                onClick={() => setSelectedYear(year)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-center lg:text-left px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg text-[10px] xs:text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                  year === selectedYear
                    ? "bg-[#424242] text-white"
                    : "text-[#666666] hover:bg-white hover:text-[#1342FF]"
                }`}
              >
                {year}
              </motion.button>
            ))}
          </div>
        </div>

        {!isLoading && !summary ? (
          <p className="mt-4 text-sm text-[#666666]">
            No GitHub activity is available yet. Use the admin activity refresh control after
            configuring `GH_TOKEN` and `GITHUB_USERNAME`.
          </p>
        ) : null}
        </> : null}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="fixed px-3 py-2 bg-[#424242] text-white text-[11px] font-medium rounded whitespace-nowrap pointer-events-none z-[9999] shadow-lg"
                style={{
                  left: `${hoveredCell.x}px`,
                  top: `${hoveredCell.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-semibold">
                    {hoveredCell.contributions} contributions
                  </span>
                  <span className="text-[10px] text-white/80">
                    {formatDate(hoveredCell.date)}
                  </span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-[#424242]" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
