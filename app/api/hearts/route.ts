import { NextResponse } from "next/server";

import {
  addHeartVisitor,
  getHeartCount,
  removeHeartVisitor,
  visitorHasLiked,
} from "@/lib/portfolio-engagement";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");
    const likes = await getHeartCount();
    const hasLiked = visitorId ? await visitorHasLiked(visitorId) : false;

    return NextResponse.json({
      likes,
      hasLiked,
    });
  } catch (error) {
    console.error("hearts GET:", error);
    return NextResponse.json({ likes: 0, hasLiked: false }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, visitorId } = body as { action?: string; visitorId?: string };

    if (!visitorId) {
      return NextResponse.json(
        { likes: 0, hasLiked: false, error: "Visitor ID required" },
        { status: 400 }
      );
    }

    if (action === "like") {
      await addHeartVisitor(visitorId);
    } else if (action === "unlike") {
      await removeHeartVisitor(visitorId);
    } else {
      return NextResponse.json(
        { likes: 0, hasLiked: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    const likes = await getHeartCount();
    const hasLiked = await visitorHasLiked(visitorId);

    return NextResponse.json({
      likes,
      hasLiked,
    });
  } catch (error) {
    console.error("hearts POST:", error);
    return NextResponse.json(
      { likes: 0, hasLiked: false, error: "Failed to update" },
      { status: 200 }
    );
  }
}
