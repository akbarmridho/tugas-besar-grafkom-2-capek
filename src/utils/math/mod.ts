/**
 * Operation for n mod m
 * @param n
 * @param m
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
