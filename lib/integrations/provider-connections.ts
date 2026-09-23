import type { AgentProviderId } from "@/lib/usage/providers";

export type ProviderConnectionStatus = "not_connected" | "connected" | "error";

export interface ProviderConnectionDefinition {
  id: AgentProviderId;
  label: string;
  description: string;
  logoSlug: string;
  ingestion: "normalized CSV";
}

/**
 * The CMS owns the catalog contract; usage data arrives through normalized CSV imports.
 */
export const providerConnections: ProviderConnectionDefinition[] = [
  {
    id: "openai",
    label: "OpenAI (Codex)",
    description: "Normalized token and cache analytics imported from Codex exports.",
    logoSlug: "openai",
    ingestion: "normalized CSV",
  },
  {
    id: "claude",
    label: "Claude Code",
    description: "Normalized token and cost analytics imported from Claude Code exports.",
    logoSlug: "anthropic",
    ingestion: "normalized CSV",
  },
  {
    id: "cursor",
    label: "Cursor",
    description: "Normalized token and activity analytics imported from Cursor exports.",
    logoSlug: "cursor",
    ingestion: "normalized CSV",
  },
  {
    id: "orca",
    label: "Orca",
    description: "Privacy-safe session, event, and token analytics from the local Orca usage index.",
    logoSlug: "orca",
    ingestion: "normalized CSV",
  },
];
