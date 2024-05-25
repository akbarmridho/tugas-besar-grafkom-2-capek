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

export function quadFromPointsExtrapolated(
  a: number[],
  b: number[],
  c: number[],
  d: number[],
  factor: number // number of additional region per row and col
): number[] {
  /**
   * a d
   * b c
   *
   * Two triangles:
   * triangle abc, cda
   */

  const xDistance = [
    (d[0] - a[0]) / factor,
    (d[1] - a[1]) / factor,
    (d[2] - a[2]) / factor
  ];

  const yDistance = [
    (b[0] - a[0]) / factor,
    (b[1] - a[1]) / factor,
    (b[2] - a[2]) / factor
  ];

  const result: number[] = [];

  for (let i = 0; i < factor; i++) {
    for (let j = 0; j < factor; j++) {
      const ax = [
        a[0] + xDistance[0] * i + yDistance[0] * j,
        a[1] + xDistance[1] * i + yDistance[1] * j,
        a[2] + xDistance[2] * i + yDistance[2] * j
      ];
      const bx = [
        a[0] + xDistance[0] * i + yDistance[0] * (j + 1),
        a[1] + xDistance[1] * i + yDistance[1] * (j + 1),
        a[2] + xDistance[2] * i + yDistance[2] * (j + 1)
      ];
      const cx = [
        a[0] + xDistance[0] * (i + 1) + yDistance[0] * (j + 1),
        a[1] + xDistance[1] * (i + 1) + yDistance[1] * (j + 1),
        a[2] + xDistance[2] * (i + 1) + yDistance[2] * (j + 1)
      ];
      const dx = [
        a[0] + xDistance[0] * (i + 1) + yDistance[0] * j,
        a[1] + xDistance[1] * (i + 1) + yDistance[1] * j,
        a[2] + xDistance[2] * (i + 1) + yDistance[2] * j
      ];

      result.push(...quadFromPoints(ax, bx, cx, dx));
    }
  }

  return result;
}

export function quadFromFlatPoints(data: number[]): number[] {
  const a = 0;
  const b = 3;
  const c = 6;
  const d = 9;

  /**
   * a d
   * b c
   *
   * Two triangles:
   * triangle abc, cda
   */

  // prettier-ignore
  return [
    data[a], data[a+1], data[a+2], // a -> drawing triangle abc
    data[b], data[b+1], data[b+2], // b
    data[c], data[c+1], data[c+2], // c
    data[c], data[c+1], data[c+2], // c -> drawing triangle bdc
    data[d], data[d+1], data[d+2], // d
    data[a], data[a+1], data[a+2], // a
  ]
}

export function quadFromCoord(
  a: number[],
  b: number[],
  c: number[],
  d: number[]
): number[] {
  /**
   * a d
   * b c
   *
   * Two triangles:
   * triangle abc, cda
   */
  // prettier-ignore
  return [
    a[0], a[1], // a -> drawing triangle abc
    b[0], b[1], // b
    c[0], c[1], // c
    c[0], c[1], // c
    d[0], d[1], // d
    a[0], a[1], // a
  ]
}

export function quadFromCoordExtrapolated(
  a: number[],
  b: number[],
  c: number[],
  d: number[],
  factor: number // number of additional region per row and col
): number[] {
  /**
   * a d
   * b c
   *
   * Two triangles:
   * triangle abc, cda
   */

  const xDistance = [(d[0] - a[0]) / factor, (d[1] - a[1]) / factor];

  const yDistance = [(b[0] - a[0]) / factor, (b[1] - a[1]) / factor];

  const result: number[] = [];

  for (let i = 0; i < factor; i++) {
    for (let j = 0; j < factor; j++) {
      const ax = [
        a[0] + xDistance[0] * i + yDistance[0] * j,
        a[1] + xDistance[1] * i + yDistance[1] * j
      ];
      const bx = [
        a[0] + xDistance[0] * i + yDistance[0] * (j + 1),
        a[1] + xDistance[1] * i + yDistance[1] * (j + 1)
      ];
      const cx = [
        a[0] + xDistance[0] * (i + 1) + yDistance[0] * (j + 1),
        a[1] + xDistance[1] * (i + 1) + yDistance[1] * (j + 1)
      ];
      const dx = [
        a[0] + xDistance[0] * (i + 1) + yDistance[0] * j,
        a[1] + xDistance[1] * (i + 1) + yDistance[1] * j
      ];

      result.push(...quadFromCoord(ax, bx, cx, dx));
    }
  }

  return result;
}

export function quadFromPoints(
  a: number[],
  b: number[],
  c: number[],
  d: number[]
): number[] {
  /**
   * a d
   * b c
   *
   * Two triangles:
   * triangle abc, cda
   */

  // prettier-ignore
  return [
    a[0], a[1], a[2], // a -> drawing triangle abc
    b[0], b[1], b[2], // b
    c[0], c[1], c[2], // c
    c[0], c[1], c[2], // c
    d[0], d[1], d[2], // d
    a[0], a[1], a[2], // a
  ]
}

export function triangleFromPoints(
  a: number[],
  b: number[],
  c: number[]
): number[] {
  /**
   *  a
   * b c
   *
   * One triangle:
   * triangle abc
   */

  return [
    a[0],
    a[1],
    a[2], // a -> drawing triangle abc
    b[0],
    b[1],
    b[2], // b
    c[0],
    c[1],
    c[2] // c
  ];
}
