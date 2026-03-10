import { apiFetch } from "./http";

export async function findRecallMatches(names: string[]): Promise<Set<string>> {
  if (!names.length) return new Set();
  const query = encodeURIComponent(names.join(","));
  const data = await apiFetch<{ matches: string[] }>(`/recalls?names=${query}`);
  return new Set((data.matches || []).map((name) => name.toLowerCase()));
}
