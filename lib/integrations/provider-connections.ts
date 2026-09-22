import type { AgentProviderId } from "@/lib/usage/providers";

export type ProviderConnectionStatus = "not_connected" | "connected" | "error";

export interface ProviderConnectionDefinition {
  id: AgentProviderId;
  label: string;
  description: string;
  logoSlug: string;
  status: ProviderConnectionStatus;
  access: "read-only";
  protocol: "OAuth 2.0 + PKCE" | "MCP 2.1 + OAuth 2.0 + PKCE";
  scopes: string[];
}

/**
 * The CMS owns the connection contract, not provider credentials. Actual
 * tokens must be held by the WorkOS connection layer once configured.
 */
export const providerConnections: ProviderConnectionDefinition[] = [
  {
    id: "openai",
    label: "OpenAI (Codex)",
    description: "Token and cache analytics from Codex usage.",
    logoSlug: "openai",
    status: "not_connected",
    access: "read-only",
    protocol: "MCP 2.1 + OAuth 2.0 + PKCE",
    scopes: ["usage.read", "models.read"],
  },
  {
    id: "claude",
    label: "Claude Code",
    description: "Token and cost analytics from Claude Code usage.",
    logoSlug: "anthropic",
    status: "not_connected",
    access: "read-only",
    protocol: "MCP 2.1 + OAuth 2.0 + PKCE",
    scopes: ["usage.read", "models.read"],
  },
  {
    id: "cursor",
    label: "Cursor",
    description: "Token and activity analytics from Cursor usage.",
    logoSlug: "cursor",
    status: "not_connected",
    access: "read-only",
    protocol: "OAuth 2.0 + PKCE",
    scopes: ["usage.read"],
  },
];
