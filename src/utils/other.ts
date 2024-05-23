export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

export function generateCheckerboard(size = 64, row = 8, col = 8) {
  const patchSize = [size / row, size / col];
  const myTexels = new Uint8Array(4 * size * size);
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      const patchx = Math.floor(i / patchSize[0]);
      const patchy = Math.floor(j / patchSize[1]);
      const c = patchx % 2 !== patchy % 2 ? 255 : 0;
      const idx = 4 * (i * size + j);
      myTexels[idx] = c; // R
      myTexels[idx + 1] = c; // G
      myTexels[idx + 2] = c; // B
      myTexels[idx + 3] = 255; // A
    }
  }
  return myTexels;
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}
