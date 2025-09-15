export function expected(rA: number, rB: number) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}
export function k(elo: number) {
  if (elo < 1200) return 40;
  if (elo < 1600) return 32;
  if (elo < 2000) return 24;
  return 16;
}
export function applyElo(a: number, b: number, winnerIsA: boolean) {
  const EA = expected(a, b), EB = expected(b, a);
  const KA = k(a), KB = k(b);
  if (winnerIsA) {
    return [Math.round(a + KA * (1 - EA)), Math.round(b + KB * (0 - EB))];
  } else {
    return [Math.round(a + KA * (0 - EA)), Math.round(b + KB * (1 - EB))];
  }
}
