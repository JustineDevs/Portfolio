import { getPublishedPageSections } from "@/lib/content/public";

export type LegalPageSection = {
  title: string;
  body?: string;
  items?: string[];
  links?: { label: string; href: string }[];
};

export type LegalPageData = {
  title: string;
  eyebrow: string;
  description: string;
  sections: LegalPageSection[];
};

const fallback: Record<string, LegalPageData> = {
  privacy: {
    title: "Privacy",
    eyebrow: "Site information",
    description: "This page explains how information is handled when you browse this site or contact its owner.",
    sections: [
      { title: "Overview", body: "Information is used only to operate the site, respond to requests, improve reliability, and protect the service." },
      { title: "Your choices", body: "If you have a question about information associated with a request or interaction, contact the site owner for clarification or assistance." },
    ],
  },
  terms: {
    title: "Terms",
    eyebrow: "Site information",
    description: "These terms outline the expectations for using this site and the materials shared through it.",
    sections: [
      { title: "Using this site", body: "Please use the site and its content lawfully, respectfully, and in a way that does not interfere with other visitors or the service." },
      { title: "Site content", body: "Unless stated otherwise, portfolio work, writing, and visual materials remain associated with their respective owners and sources." },
    ],
  },
  license: {
    title: "License",
    eyebrow: "Project information",
    description: "The portfolio source code is distributed under the GNU General Public License v3.0.",
    sections: [
      { title: "License", body: "You may redistribute and modify the source code under the terms of the GNU General Public License v3.0." },
      { title: "Read the full license", links: [{ label: "GNU GPLv3 — full license", href: "https://www.gnu.org/licenses/gpl-3.0.html" }, { label: "License file in the repository", href: "https://github.com/JustineDevs/Portfolio/blob/main/LICENSE" }] },
    ],
  },
};

export async function getLegalPageData(page: "privacy" | "terms" | "license"): Promise<LegalPageData> {
  const section = (await getPublishedPageSections("legal")).find((item) => item.sectionKey === page);
  const fallbackPage = fallback[page];
  if (!section) return fallbackPage;

  try {
    const meta = section.metaJson ? JSON.parse(section.metaJson) as Partial<LegalPageData> : {};
    return {
      ...fallbackPage,
      title: section.title || meta.title || fallbackPage.title,
      eyebrow: section.subtitle || meta.eyebrow || fallbackPage.eyebrow,
      description: section.bodyMd || meta.description || fallbackPage.description,
      sections: Array.isArray(meta.sections) ? meta.sections : fallbackPage.sections,
    };
  } catch {
    return fallbackPage;
  }
}
