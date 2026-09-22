import { NextResponse } from "next/server";
import { getAssetPayloadBySemanticKey } from "@/lib/content/assets";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { semanticKey: string } },
) {
  const asset = await getAssetPayloadBySemanticKey(decodeURIComponent(params.semanticKey));
  if (!asset) return new NextResponse("Asset not found", { status: 404 });

  if (asset.dataUrl?.startsWith("data:")) {
    const match = /^data:([^;,]+);base64,([\s\S]+)$/.exec(asset.dataUrl);
    if (match) {
      return new NextResponse(Buffer.from(match[2], "base64"), {
        headers: {
          "content-type": match[1],
          "cache-control": "public, max-age=31536000, immutable",
          "x-content-type-options": "nosniff",
        },
      });
    }
  }

  if (asset.sourceUrl) return NextResponse.redirect(new URL(asset.sourceUrl, _request.url));
  return new NextResponse("Asset payload not found", { status: 404 });
}
