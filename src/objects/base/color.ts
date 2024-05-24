import { Serializable } from './serializable.ts';

export interface ColorSerialized {
  r: number;
  g: number;
  b: number;
}

export class Color extends Serializable<ColorSerialized> {
  /* Attribute */
  private _r: number;
  private _g: number;
  private _b: number;

  /* Constructor */
  constructor(r: number, g: number, b: number) {
    super();
    this._r = r;
    this._g = g;
    this._b = b;
  }

  public get r() {
    return this._r;
  }

  public get g() {
    return this._g;
  }

  public get b() {
    return this._b;
  }

  /* Methods*/
  clone(): Color {
    return new Color(this._r, this._g, this._b);
  }

  copy(otherColor: Color): Color {
    this._r = otherColor._r;
    this._g = otherColor._g;
    this._b = otherColor._b;
    return this;
  }

  toJSON(): ColorSerialized {
    return {
      r: this._r,
      g: this._g,
      b: this._b
    };
  }

  public static fromJSON(data: ColorSerialized): Color {
    return new Color(data.r, data.g, data.b);
  }

  public static Red() {
    return new Color(255, 0, 0);
  }

  public static Blue() {
    return new Color(0, 0, 255);
  }

  public static White() {
    return new Color(255, 255, 255);
  }

  public static Black() {
    return new Color(0, 0, 0);
  }

  public static fromHex(hex: number) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;

    return new Color(r, g, b);
  }

  public toHex() {
    return (this._r << 16) | (this.g << 8) | this.b;
  }

  /**
   * Iterator for WebGL
   * WebGL receive color in normalized so we need to divide by 255
   */
  *[Symbol.iterator](): IterableIterator<number> {
    yield this._r / 255.0;
    yield this._g / 255.0;
    yield this._b / 255.0;
    yield 1.0;
  }
}
