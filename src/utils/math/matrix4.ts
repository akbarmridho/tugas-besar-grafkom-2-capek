/**
 * This is a flatten 4x4 matrix
 * with row-major orientation
 */
export class Matrix4 {
  private _elements: number[];

  public get elements(): number[] {
    return this._elements;
  }

  public get length(): number {
    const a = this.elements;

    return Math.sqrt(
      a[0] ** 2 +
        a[1] ** 2 +
        a[2] ** 2 +
        a[3] ** 2 +
        a[4] ** 2 +
        a[5] ** 2 +
        a[6] ** 2 +
        a[7] ** 2 +
        a[8] ** 2 +
        a[9] ** 2 +
        a[10] ** 2 +
        a[11] ** 2 +
        a[12] ** 2 +
        a[13] ** 2 +
        a[14] ** 2 +
        a[16] ** 2
    );
  }

  constructor(elements: number[]) {
    if (elements.length !== 16) {
      throw new Error(
        `Invalid elements length expecting 16 got ${elements.length}`
      );
    }

    this._elements = [...elements];
  }

  public copy(): Matrix4 {
    return new Matrix4([...this.elements]);
  }

  /**
   * Matrix multiplication of this matrix with other matrix
   * return a new instance of matrix
   *
   * @param other
   */
  public multiplyMatrix(other: Matrix4): Matrix4 {
    const dst = [];
    const a = this.elements;
    const b = other.elements;

    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];

    dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return new Matrix4(dst);
  }

  /**
   * Multiply matrix with a scalar.
   * Return a new instance of matrix
   *
   * @param scalar
   */
  public multiplyScalar(scalar: number): Matrix4 {
    const a = this.elements;

    return new Matrix4([
      a[0] * scalar,
      a[1] * scalar,
      a[2] * scalar,
      a[3] * scalar,
      a[4] * scalar,
      a[5] * scalar,
      a[6] * scalar,
      a[7] * scalar,
      a[8] * scalar,
      a[9] * scalar,
      a[10] * scalar,
      a[11] * scalar,
      a[12] * scalar,
      a[13] * scalar,
      a[14] * scalar,
      a[15] * scalar
    ]);
  }

  /**
   * Add matrix with other matrix
   * Return a new instance of matrix
   * @param other
   */
  public addMatrix(other: Matrix4): Matrix4 {
    const a = this.elements;
    const b = other.elements;

    return new Matrix4([
      a[0] + b[0],
      a[1] + b[1],
      a[2] + b[2],
      a[3] + b[3],
      a[4] + b[4],
      a[5] + b[5],
      a[6] + b[6],
      a[7] + b[7],
      a[8] + b[8],
      a[9] + b[9],
      a[10] + b[10],
      a[11] + b[11],
      a[12] + b[12],
      a[13] + b[13],
      a[14] + b[14],
      a[15] + b[15]
    ]);
  }

  /**
   * Subtract matrix with other matrix
   * Return a new instance of matrix
   * @param other
   */
  public subtractMatrix(other: Matrix4): Matrix4 {
    const a = this.elements;
    const b = other.elements;

    return new Matrix4([
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2],
      a[3] - b[3],
      a[4] - b[4],
      a[5] - b[5],
      a[6] - b[6],
      a[7] - b[7],
      a[8] - b[8],
      a[9] - b[9],
      a[10] - b[10],
      a[11] - b[11],
      a[12] - b[12],
      a[13] - b[13],
      a[14] - b[14],
      a[15] - b[15]
    ]);
  }

  public static identity(): Matrix4 {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  public transpose(): Matrix4 {
    const m = this.elements;
    const dst = [];

    dst[0] = m[0];
    dst[1] = m[4];
    dst[2] = m[8];
    dst[3] = m[12];
    dst[4] = m[1];
    dst[5] = m[5];
    dst[6] = m[9];
    dst[7] = m[13];
    dst[8] = m[2];
    dst[9] = m[6];
    dst[10] = m[10];
    dst[11] = m[14];
    dst[12] = m[3];
    dst[13] = m[7];
    dst[14] = m[11];
    dst[15] = m[15];

    return new Matrix4(dst);
  }
}
