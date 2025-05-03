import { Evaluation } from '../evaluation.schema';

export function getMutualMatches(
  evaluations: Evaluation[],
): [string, string][] {
  const trueEvals = evaluations.filter((e) => e.result);

  const likedMap = new Map<string, Set<string>>();

  for (const { from, to } of trueEvals) {
    if (!likedMap.has(from)) likedMap.set(from.toString(), new Set());
    likedMap.get(from.toString())!.add(to.toString());
  }
  console.log('likedMap', likedMap);

  const matched: [string, string][] = [];

  for (const [from, toSet] of likedMap.entries()) {
    console.log('from', from);
    for (const to of toSet) {
      console.log('to', to);
      if (likedMap.get(to)?.has(from)) {
        console.log('to has', likedMap.get(to));
        const [a, b] = [from, to].sort();
        const seen = new Set<string>(matched.map(([a, b]) => `${a}|${b}`));
        const key = `${a}|${b}`;
        if (!seen.has(key)) {
          seen.add(key);
          matched.push([a, b]);
        }
      }
    }
  }
  console.log('matched', matched);

  return matched;
}
