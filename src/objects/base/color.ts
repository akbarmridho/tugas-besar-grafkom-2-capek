import { Serializable } from './serializable.ts';

export interface ColorSerialized {
  r: number;
  g: number;
  b: number;
}

export class Color extends Serializable<ColorSerialized> {
  /* Attribute */
  private r: number;
  private g: number;
  private b: number;

  /* Constructor */
  constructor(r: number, g: number, b: number) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /* Methods*/
  clone(): Color {
    return new Color(this.r, this.g, this.b);
  }

  copy(otherColor: Color): Color {
    this.r = otherColor.r;
    this.g = otherColor.g;
    this.b = otherColor.b;
    return this;
  }

  toJSON(): ColorSerialized {
    return {
      r: this.r,
      g: this.g,
      b: this.b
    };
  }

  public static Red() {
    return new Color(255, 0, 0);
  }

  public static fromHex(hex: number) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;

    return new Color(r, g, b);
  }

  /**
   * Iterator for WebGL
   * WebGL receive color in normalized so we need to divide by 255
   */
  *[Symbol.iterator](): IterableIterator<number> {
    yield this.r / 255.0;
    yield this.g / 255.0;
    yield this.b / 255.0;
    yield 1.0;
  }
}
