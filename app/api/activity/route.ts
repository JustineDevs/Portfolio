import { NextResponse } from "next/server";

import { getGithubActivityRange } from "@/lib/github/activity";

function parseYears(rawYears: string | null) {
  const currentYear = new Date().getFullYear();
  const fallbackYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  if (!rawYears) {
    return fallbackYears;
  }

  const years = rawYears
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value));

  return years.length > 0 ? years : fallbackYears;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const years = parseYears(searchParams.get("years"));

  try {
    const data = await getGithubActivityRange(years);
    return NextResponse.json({ years: data });
  } catch (error) {
    return NextResponse.json(
      {
        years: {},
        error: error instanceof Error ? error.message : "Failed to load activity.",
      },
      { status: 200 }
    );
  }
}
