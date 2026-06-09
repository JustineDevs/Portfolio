"use client";

import Link from "next/link";
import CornerDot from "@/components/ui/CornerDot";

type PageIntroAction = {
  label: string;
  href: string;
  external?: boolean;
  emphasis?: "primary" | "secondary";
};

export default function PageIntro({
  kicker,
  title,
  description,
  actions = [],
  tone = "default",
}: {
  kicker: string;
  title: string;
  description: string;
  actions?: PageIntroAction[];
  tone?: "default" | "soft";
}) {
  return (
    <section className={`page-frame ${tone === "soft" ? "page-panel-soft" : "page-panel"}`}>
      <CornerDot position="tl" className="hidden xs:block" />
      <CornerDot position="tr" className="hidden xs:block" />

      <div className="px-4 py-6 xs:px-5 sm:px-6 md:px-8 lg:px-12 lg:py-10">
        <div className="page-header-kicker">{kicker}</div>
        <h1 className="page-header-title mt-3 max-w-5xl">{title}</h1>
        <p className="page-header-copy mt-5">{description}</p>

        {actions.length > 0 ? (
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {actions.map((action) => {
              const className =
                action.emphasis === "primary"
                  ? "page-action-chip bg-[#424242] text-white border-[#424242] hover:bg-[#333333] hover:border-[#333333]"
                  : "page-action-chip";

              if (action.external) {
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {action.label}
                  </a>
                );
              }

              return (
                <Link key={action.label} href={action.href} className={className}>
                  {action.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
