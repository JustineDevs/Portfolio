import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/db/client";

export const dynamic = "force-dynamic";

/**
 * Lightweight readiness check: verifies libSQL (Turso or local file) responds.
 * Used by the public “Server status” indicator in the top bar.
 */
export async function GET() {
  const started = performance.now();
  try {
    await db.get(sql`SELECT 1`);
    const latencyMs = Math.round(performance.now() - started);
    return NextResponse.json({
      ok: true,
      status: "healthy",
      database: "up",
      latencyMs,
    });
  } catch (error) {
    const latencyMs = Math.round(performance.now() - started);
    console.error("[api/health]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        status: "unhealthy",
        database: "down",
        latencyMs,
        ...(process.env.NODE_ENV === "development" ? { error: message } : {}),
      },
      { status: 503 }
    );
  }
}
