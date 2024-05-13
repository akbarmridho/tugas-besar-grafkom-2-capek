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
