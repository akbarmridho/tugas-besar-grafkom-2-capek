import { MouseEvent } from 'react';

export interface Coordinate {
  x: number;
  y: number;
}

export function getCoordinate<T, U>(
  canvas: HTMLCanvasElement,
  e: MouseEvent<T, U>
): Coordinate {
  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
}

export function quadFromFlatPoints(data: number[]): number[] {
  const a = 0;
  const b = 3;
  const c = 6;
  const d = 9;

  /**
   * a b
   * c d
   *
   * Two triangles:
   * triangle abc, bdc
   */

  // prettier-ignore
  return [
      data[a], data[a+1], data[a+2], // a -> drawing triangle abc
      data[b], data[b+1], data[b+2], // b
      data[c], data[c+1], data[c+2], // c
      data[b], data[b+1], data[b+2], // b -> drawing triangle bdc
      data[d], data[d+1], data[d+2], // d
      data[c], data[c+1], data[c+2], // c
  ]
}

export function quadFromPoints(
  a: number[],
  b: number[],
  c: number[],
  d: number[]
): number[] {
  /**
   * a b
   * c d
   *
   * Two triangles:
   * triangle abc, bdc
   */

  // prettier-ignore
  return [
    a[0], a[1], a[2], // a -> drawing triangle abc
    b[0], b[1], b[2], // b
    c[0], c[1], c[2], // c
    b[0], b[1], b[2], // b -> drawing triangle bdc
    d[0], d[1], d[2], // d
    c[0], c[1], c[2], // c
  ]
}
