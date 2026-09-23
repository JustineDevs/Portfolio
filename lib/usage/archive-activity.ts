/**
 * Privacy-safe aggregates derived from the supplied AI conversation archive.
 * Raw conversation text, titles, and account metadata are intentionally excluded.
 */
export type ArchiveActivitySummary = {
  totalMessages: number;
  totalConversations: number;
  activeDays: number;
  daily: Record<string, number>;
};

const archiveActivity: Record<number, ArchiveActivitySummary> = {
  2025: {
    totalMessages: 10,
    totalConversations: 2,
    activeDays: 2,
    daily: { "2025-06-23": 6, "2025-06-25": 4 },
  },
  2026: {
    totalMessages: 70,
    totalConversations: 10,
    activeDays: 7,
    daily: {
      "2026-01-19": 8,
      "2026-01-22": 16,
      "2026-02-14": 10,
      "2026-02-15": 14,
      "2026-02-18": 6,
      "2026-02-23": 12,
      "2026-03-01": 4,
    },
  },
};

export function getArchiveActivitySummary(year: number): ArchiveActivitySummary | null {
  return archiveActivity[year] ?? null;
}
