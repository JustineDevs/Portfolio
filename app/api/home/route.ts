import { NextResponse } from "next/server";
import { getHomePageData } from "@/lib/content/home-page-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getHomePageData();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
