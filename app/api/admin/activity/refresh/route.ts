import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth";
import {
  fetchGithubActivityForYear,
  saveGithubActivitySnapshot,
} from "@/lib/github/activity";

export async function POST(request: Request) {
  await requireAdminSession({ redirectToLogin: false });

  const body = await request.json().catch(() => ({}));
  const years = Array.isArray(body?.years)
    ? body.years.map((value: unknown) => Number.parseInt(String(value), 10)).filter(Number.isFinite)
    : [new Date().getFullYear()];

  const refreshed: number[] = [];

  for (const year of years) {
    const summary = await fetchGithubActivityForYear(year);

    if (summary) {
      await saveGithubActivitySnapshot(summary);
      refreshed.push(year);
    }
  }

  return NextResponse.json({ refreshed });
}
