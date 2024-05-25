export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}
