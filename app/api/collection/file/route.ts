import { NextResponse } from "next/server";

import { getCollectionFile } from "@/lib/github/public-collection";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path")?.trim();

  if (!path) {
    return NextResponse.json({ error: "Missing path." }, { status: 400 });
  }

  try {
    const file = await getCollectionFile(path);
    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch collection file." },
      { status: 500 },
    );
  }
}
