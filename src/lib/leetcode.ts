import { leetcodeFallback, type LeetCodeStats } from "../data/site";

const QUERY = `
query user($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum { difficulty count }
    }
    profile { ranking }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
}`;

function pickTopTags(data: {
  advanced: { tagName: string; problemsSolved: number }[];
  intermediate: { tagName: string; problemsSolved: number }[];
  fundamental: { tagName: string; problemsSolved: number }[];
}): { name: string; count: number }[] {
  const all = [
    ...data.fundamental,
    ...data.intermediate,
    ...data.advanced,
  ];
  return all
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 6)
    .map((t) => ({ name: t.tagName, count: t.problemsSolved }));
}

export async function fetchLeetCodeStats(
  username = "santhosh2210429",
): Promise<LeetCodeStats> {
  try {
    const res = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });
    if (!res.ok) throw new Error("LeetCode API failed");
    const json = await res.json();
    const user = json?.data?.matchedUser;
    if (!user) throw new Error("No user data");

    const byDiff = Object.fromEntries(
      user.submitStats.acSubmissionNum.map(
        (r: { difficulty: string; count: number }) => [r.difficulty, r.count],
      ),
    ) as Record<string, number>;

    return {
      total: byDiff.All ?? leetcodeFallback.total,
      easy: byDiff.Easy ?? 0,
      medium: byDiff.Medium ?? 0,
      hard: byDiff.Hard ?? 0,
      ranking: user.profile?.ranking ?? leetcodeFallback.ranking,
      topTags: pickTopTags(user.tagProblemCounts),
    };
  } catch {
    return {
      total: leetcodeFallback.total,
      easy: leetcodeFallback.easy,
      medium: leetcodeFallback.medium,
      hard: leetcodeFallback.hard,
      ranking: leetcodeFallback.ranking,
      topTags: [...leetcodeFallback.topTags],
    };
  }
}
