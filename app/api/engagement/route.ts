import { NextResponse } from "next/server";

import {
  getHeartCount,
  getTotalViews,
  incrementTotalViews,
  visitorHasLiked,
} from "@/lib/portfolio-engagement";

const REPO = "JustineDevs/Portfolio";
const REPO_URL = "https://github.com/JustineDevs/portfolio";

async function fetchGithubStars(): Promise<{ stars: number; ok: boolean }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "JSTN-Portfolio-Site",
        ...(process.env.GH_TOKEN || process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return { stars: 0, ok: false };
    }
    const data = (await res.json()) as { stargazers_count?: number };
    const stars =
      typeof data.stargazers_count === "number" ? data.stargazers_count : 0;
    return { stars, ok: true };
  } catch {
    return { stars: 0, ok: false };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");
    const [{ stars, ok: repoMetaOk }, views, likes, hasLiked] = await Promise.all([
      fetchGithubStars(),
      getTotalViews(),
      getHeartCount(),
      visitorId ? visitorHasLiked(visitorId) : Promise.resolve(false),
    ]);

    return NextResponse.json({
      views,
      stars,
      repoMetaOk,
      repoUrl: REPO_URL,
      likes,
      hasLiked,
    });
  } catch (error) {
    console.error("engagement GET:", error);
    return NextResponse.json(
      {
        views: 0,
        stars: 0,
        repoMetaOk: false,
        repoUrl: REPO_URL,
        likes: 0,
        hasLiked: false,
      },
      { status: 200 }
    );
  }
}

/** Record one page view (caller should debounce per session in the browser). */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body?.type !== "view") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const views = await incrementTotalViews();
    return NextResponse.json({ views });
  } catch (error) {
    console.error("engagement POST:", error);
    return NextResponse.json({ views: 0, error: "Failed" }, { status: 200 });
  }
}
