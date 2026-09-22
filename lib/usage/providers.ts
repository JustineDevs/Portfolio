export const activityProviders = [
  { id: "github", label: "GitHub", kind: "activity" },
  { id: "openai", label: "OpenAI (Codex)", kind: "usage" },
  { id: "claude", label: "Claude Code", kind: "usage" },
  { id: "cursor", label: "Cursor", kind: "usage" },
] as const;

export type ActivityProviderId = (typeof activityProviders)[number]["id"];
export type AgentProviderId = Exclude<ActivityProviderId, "github">;

export interface AgentUsageMetrics {
  totalTokens: number | null;
  estimatedCost: number | null;
  activeDays: number | null;
  cacheShare: number | null;
}

export interface AgentUsageSnapshot {
  provider: AgentProviderId;
  metrics: AgentUsageMetrics;
  syncedAt: string | null;
}

export const emptyAgentUsageMetrics: AgentUsageMetrics = {
  totalTokens: null,
  estimatedCost: null,
  activeDays: null,
  cacheShare: null,
};

export function getActivityProviderLabel(provider: ActivityProviderId) {
  return activityProviders.find((item) => item.id === provider)?.label ?? "Activity";
}
