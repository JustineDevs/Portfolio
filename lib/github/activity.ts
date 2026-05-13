import { createHash } from "crypto";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { githubActivitySnapshots } from "@/db/schema";
import { CONTENT_TAGS } from "@/lib/content/revalidate";
import {
  GithubActivitySummary,
  normalizeGithubActivityPayload,
} from "@/lib/github/normalize-activity";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
export const GITHUB_ACTIVITY_REVALIDATE_SECONDS = 60 * 60 * 6;

function getGithubActivityQuery() {
  return `
    query PortfolioActivity($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        login
        contributionsCollection(from: $from, to: $to) {
          startedAt
          endedAt
          totalCommitContributions
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              firstDay
              contributionDays {
                color
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;
}

export async function fetchGithubActivityForYear(
  year: number,
  username = process.env.GITHUB_USERNAME
): Promise<GithubActivitySummary | null> {
  const token = process.env.GH_TOKEN;

  if (!token || !username) {
    return null;
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "justinedevs-portfolio",
    },
    body: JSON.stringify({
      query: getGithubActivityQuery(),
      variables: {
        login: username,
        from,
        to,
      },
    }),
    next: {
      revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS,
      tags: [CONTENT_TAGS.githubActivity, `${CONTENT_TAGS.githubActivity}:${year}`],
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub activity request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(`GitHub activity query failed: ${payload.errors[0]?.message}`);
  }

  return normalizeGithubActivityPayload(payload, year);
}

export async function getGithubActivitySnapshot(year: number) {
  const rows = await db
    .select()
    .from(githubActivitySnapshots)
    .where(eq(githubActivitySnapshots.year, year))
    .orderBy(desc(githubActivitySnapshots.fetchedAt))
    .limit(1);

  if (!rows[0]) return null;

  return JSON.parse(rows[0].payloadJson) as GithubActivitySummary;
}

export async function saveGithubActivitySnapshot(summary: GithubActivitySummary) {
  const payloadJson = JSON.stringify(summary);
  const sourceHash = createHash("sha256").update(payloadJson).digest("hex");

  await db.insert(githubActivitySnapshots).values({
    year: summary.year,
    payloadJson,
    sourceHash,
  });
}

export async function getGithubActivityWithFallback(year: number) {
  try {
    const live = await fetchGithubActivityForYear(year);

    if (live) {
      return live;
    }
  } catch {
    // Fall back to snapshot.
  }

  return getGithubActivitySnapshot(year);
}

export async function getGithubActivityRange(years: number[]) {
  const results = await Promise.all(
    years.map(async (year) => {
      const summary = await getGithubActivityWithFallback(year);
      return [year, summary] as const;
    })
  );

  return Object.fromEntries(results.filter((entry) => entry[1])) as Record<
    number,
    GithubActivitySummary
  >;
}
