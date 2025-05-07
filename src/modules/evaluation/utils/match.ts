import { LeanDocument } from 'src/common/types/lean.type';
import { Evaluation } from '../evaluation.schema';

export function getMutualMatches(
  evaluations: LeanDocument<Evaluation>[],
): [string, string][] {
  const trueEvals = evaluations.filter((e) => e.result);

  const likedMap = new Map<string, Set<string>>();

  for (const { from, to } of trueEvals) {
    if (!likedMap.has(from)) likedMap.set(from.toString(), new Set());
    likedMap.get(from.toString())!.add(to.toString());
  }

  const matched: [string, string][] = [];

  for (const [from, toSet] of likedMap.entries()) {
    for (const to of toSet) {
      if (likedMap.get(to)?.has(from)) {
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

  return matched;
}
