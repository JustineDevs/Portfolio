import { NextResponse } from "next/server";

import { resolveImageAssetUrl } from "@/lib/asset-urls";

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("url")?.trim() || "";

  if (!input) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  const resolved = await resolveImageAssetUrl(input);
  if (!isHttpUrl(resolved)) {
    return NextResponse.json({ error: "Could not resolve a remote image URL." }, { status: 400 });
  }

  const upstream = await fetch(resolved, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; JSTNImageProxy/1.0)",
      accept: "image/*,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(12_000),
  }).catch((error) => error as Error);

  if (upstream instanceof Error) {
    return NextResponse.json(
      { error: "Failed to fetch remote image.", detail: upstream.message, resolved },
      { status: 502, headers: { "cache-control": "no-store" } },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch remote image.", status: upstream.status, resolved },
      { status: 502, headers: { "cache-control": "no-store" } },
    );
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
