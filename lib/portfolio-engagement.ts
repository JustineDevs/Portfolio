import { sql, eq, count } from "drizzle-orm";

import { db } from "@/db/client";
import {
  portfolioHeartVisitors,
  portfolioSiteStats,
} from "@/db/schema";

const STATS_ROW_ID = 1;

export async function ensurePortfolioStatsRow(): Promise<void> {
  await db
    .insert(portfolioSiteStats)
    .values({ id: STATS_ROW_ID, totalViews: 0 })
    .onConflictDoNothing();
}

export async function getTotalViews(): Promise<number> {
  try {
    await ensurePortfolioStatsRow();
    const rows = await db
      .select()
      .from(portfolioSiteStats)
      .where(eq(portfolioSiteStats.id, STATS_ROW_ID))
      .limit(1);
    return rows[0]?.totalViews ?? 0;
  } catch {
    return 0;
  }
}

export async function incrementTotalViews(): Promise<number> {
  await ensurePortfolioStatsRow();
  await db
    .update(portfolioSiteStats)
    .set({
      totalViews: sql`${portfolioSiteStats.totalViews} + 1`,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(portfolioSiteStats.id, STATS_ROW_ID));
  return getTotalViews();
}

export async function getHeartCount(): Promise<number> {
  try {
    const rows = await db.select({ c: count() }).from(portfolioHeartVisitors);
    return Number(rows[0]?.c ?? 0);
  } catch {
    return 0;
  }
}

export async function visitorHasLiked(visitorId: string): Promise<boolean> {
  try {
    const rows = await db
      .select()
      .from(portfolioHeartVisitors)
      .where(eq(portfolioHeartVisitors.visitorId, visitorId))
      .limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function addHeartVisitor(visitorId: string): Promise<void> {
  await db.insert(portfolioHeartVisitors).values({ visitorId }).onConflictDoNothing();
}

export async function removeHeartVisitor(visitorId: string): Promise<void> {
  await db.delete(portfolioHeartVisitors).where(eq(portfolioHeartVisitors.visitorId, visitorId));
}
