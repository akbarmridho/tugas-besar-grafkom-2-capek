export interface TweenOption {
  name: string;
  fn: (val: number) => number;
}

function easeInOutBack(x: number): number {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function easeInOutElastic(x: number): number {
  const c5 = (2 * Math.PI) / 4.5;

  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 +
          1;
}

export const TweenOptions: TweenOption[] = [
  {
    name: 'ease-in-out-sine',
    fn: (x) => -(Math.cos(Math.PI * x) - 1) / 2
  },
  {
    name: 'ease-in-out-quad',
    fn: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
  },
  {
    name: 'ease-in-out-cubic',
    fn: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
  },
  {
    name: 'ease-in-out-quart',
    fn: (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)
  },
  {
    name: 'ease-in-out-back',
    fn: easeInOutBack
  },
  {
    name: 'ease-in-out-elastic',
    fn: easeInOutElastic
  }
];
