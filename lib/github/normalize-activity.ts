export interface GithubContributionDay {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
}

export interface GithubContributionWeek {
  contributionDays: GithubContributionDay[];
  firstDay: string;
}

export interface GithubActivitySummary {
  username: string;
  year: number;
  totalContributions: number;
  totalCommitContributions: number;
  restrictedContributionsCount: number;
  startedAt: string;
  endedAt: string;
  weeks: GithubContributionWeek[];
  generatedAt: string;
}

interface GraphqlContributionCalendar {
  totalContributions: number;
  weeks: GithubContributionWeek[];
}

interface GraphqlContributionsCollection {
  contributionCalendar: GraphqlContributionCalendar;
  totalCommitContributions: number;
  restrictedContributionsCount: number;
  startedAt: string;
  endedAt: string;
}

interface GraphqlUserPayload {
  login: string;
  contributionsCollection: GraphqlContributionsCollection;
}

interface GraphqlResponse {
  data?: {
    user?: GraphqlUserPayload | null;
  };
}

export function normalizeGithubActivityPayload(
  payload: GraphqlResponse,
  year: number
) {
  const user = payload.data?.user;

  if (!user) {
    throw new Error("GitHub activity payload did not include a user record.");
  }

  const collection = user.contributionsCollection;

  return {
    username: user.login,
    year,
    totalContributions: collection.contributionCalendar.totalContributions,
    totalCommitContributions: collection.totalCommitContributions,
    restrictedContributionsCount: collection.restrictedContributionsCount,
    startedAt: collection.startedAt,
    endedAt: collection.endedAt,
    weeks: collection.contributionCalendar.weeks,
    generatedAt: new Date().toISOString(),
  } satisfies GithubActivitySummary;
}
