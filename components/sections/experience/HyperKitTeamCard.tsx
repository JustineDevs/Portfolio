"use client";

import React from "react";
import ProfileCard from "@/components/ui/profile-card";

const GLOW = "rgba(19, 66, 255, 0.55)";
const GRADIENT = "linear-gradient(145deg, rgba(39, 74, 190, 0.55) 0%, rgba(15, 29, 83, 0.7) 100%)";

export default function HyperKitTeamCard({ avatarUrl, miniAvatarUrl, iconUrl }: { avatarUrl?: string | null; miniAvatarUrl?: string | null; iconUrl?: string | null }) {
  const name = "Justine Lupasi";
  return (
    <div className="flex w-full justify-center">
      <ProfileCard
        className="w-full max-w-[320px]"
        sizing="grid"
        avatarUrl={avatarUrl || "/assets/hyperkit/justine-lupasi.png"}
        miniAvatarUrl={miniAvatarUrl || "/Avatar.png"}
        name={name}
        handle="Justinedevs"
        contactText="LinkedIn"
        showUserInfo
        onContactClick={() => window.open("https://www.linkedin.com/in/justine-lupasi-444608295/", "_blank", "noopener,noreferrer")}
        innerGradient={GRADIENT}
        behindGlowColor={GLOW}
        behindGlowSize="55%"
        enableTilt
        enableMobileTilt
        iconUrl={iconUrl || "/assets/demo/iconpattern.png"}
      />
    </div>
  );
}
