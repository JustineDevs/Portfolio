import { OpenAIIcon } from "@/components/ui/TechIcons";
import BrandIcon from "@/components/ui/BrandIcon";
import type { ActivityProviderId } from "@/lib/usage/providers";

interface ActivityProviderLogoProps {
  provider: ActivityProviderId;
  className?: string;
  selected?: boolean;
}

/** Uses the local OpenAI mark and CDN brand marks for the provider controls. */
export default function ActivityProviderLogo({
  provider,
  className = "size-4",
  selected = false,
}: ActivityProviderLogoProps) {
  if (provider === "openai") {
    return <OpenAIIcon aria-hidden="true" className={`${className} ${selected ? "text-white" : "text-[#424242]"}`} />;
  }

  return (
    <BrandIcon
      slug={provider === "claude" ? "anthropic" : provider}
      alt=""
      color={selected ? "ffffff" : "424242"}
      className={className}
    />
  );
}
