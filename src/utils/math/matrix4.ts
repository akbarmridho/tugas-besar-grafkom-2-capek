import { Vector3 } from './vector3.ts';
import { Serializable } from '../../objects/serializable.ts';

export interface Matrix4Serialized {
  elements: number[];
}

/**
 * This is a flatten 4x4 matrix
 * with row-major orientation
 */
export class Matrix4 extends Serializable<Matrix4Serialized> {
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
    super();
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

  /**
   * Create an identity 4x4 Matrix
   */
  public static identity(): Matrix4 {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * Transpose this matrix
   * Return a new instance of matrix
   */
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

  /**
   * Find the inverse of a matrix
   *
   * Return new instance of inversed matrix
   */
  public inverse(): Matrix4 {
    const dst = [];
    const m = this.elements;

    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    const tmp_0 = m22 * m33;
    const tmp_1 = m32 * m23;
    const tmp_2 = m12 * m33;
    const tmp_3 = m32 * m13;
    const tmp_4 = m12 * m23;
    const tmp_5 = m22 * m13;
    const tmp_6 = m02 * m33;
    const tmp_7 = m32 * m03;
    const tmp_8 = m02 * m23;
    const tmp_9 = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;
    const tmp_12 = m20 * m31;
    const tmp_13 = m30 * m21;
    const tmp_14 = m10 * m31;
    const tmp_15 = m30 * m11;
    const tmp_16 = m10 * m21;
    const tmp_17 = m20 * m11;
    const tmp_18 = m00 * m31;
    const tmp_19 = m30 * m01;
    const tmp_20 = m00 * m21;
    const tmp_21 = m20 * m01;
    const tmp_22 = m00 * m11;
    const tmp_23 = m10 * m01;

    const t0 =
      tmp_0 * m11 +
      tmp_3 * m21 +
      tmp_4 * m31 -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    const t1 =
      tmp_1 * m01 +
      tmp_6 * m21 +
      tmp_9 * m31 -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    const t2 =
      tmp_2 * m01 +
      tmp_7 * m11 +
      tmp_10 * m31 -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    const t3 =
      tmp_5 * m01 +
      tmp_8 * m11 +
      tmp_11 * m21 -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    dst[0] = d * t0;
    dst[1] = d * t1;
    dst[2] = d * t2;
    dst[3] = d * t3;
    dst[4] =
      d *
      (tmp_1 * m10 +
        tmp_2 * m20 +
        tmp_5 * m30 -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[5] =
      d *
      (tmp_0 * m00 +
        tmp_7 * m20 +
        tmp_8 * m30 -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[6] =
      d *
      (tmp_3 * m00 +
        tmp_6 * m10 +
        tmp_11 * m30 -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[7] =
      d *
      (tmp_4 * m00 +
        tmp_9 * m10 +
        tmp_10 * m20 -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[8] =
      d *
      (tmp_12 * m13 +
        tmp_15 * m23 +
        tmp_16 * m33 -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[9] =
      d *
      (tmp_13 * m03 +
        tmp_18 * m23 +
        tmp_21 * m33 -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] =
      d *
      (tmp_14 * m03 +
        tmp_19 * m13 +
        tmp_22 * m33 -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] =
      d *
      (tmp_17 * m03 +
        tmp_20 * m13 +
        tmp_23 * m23 -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] =
      d *
      (tmp_14 * m22 +
        tmp_17 * m32 +
        tmp_13 * m12 -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] =
      d *
      (tmp_20 * m32 +
        tmp_12 * m02 +
        tmp_19 * m22 -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] =
      d *
      (tmp_18 * m12 +
        tmp_23 * m32 +
        tmp_15 * m02 -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] =
      d *
      (tmp_22 * m22 +
        tmp_16 * m02 +
        tmp_21 * m12 -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

    return new Matrix4(dst);
  }

  public determinant(): number {
    const m = this.elements;

    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    const tmp_0 = m22 * m33;
    const tmp_1 = m32 * m23;
    const tmp_2 = m12 * m33;
    const tmp_3 = m32 * m13;
    const tmp_4 = m12 * m23;
    const tmp_5 = m22 * m13;
    const tmp_6 = m02 * m33;
    const tmp_7 = m32 * m03;
    const tmp_8 = m02 * m23;
    const tmp_9 = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;

    const t0 =
      tmp_0 * m11 +
      tmp_3 * m21 +
      tmp_4 * m31 -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    const t1 =
      tmp_1 * m01 +
      tmp_6 * m21 +
      tmp_9 * m31 -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    const t2 =
      tmp_2 * m01 +
      tmp_7 * m11 +
      tmp_10 * m31 -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    const t3 =
      tmp_5 * m01 +
      tmp_8 * m11 +
      tmp_11 * m21 -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    return 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  }

  // these todo need to implement vector4 first

  // todo transformVector if needed
  // https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/m4.js#L1031

  // todo transformPoint if needed
  // https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/m4.js#L1031

  // todo transformDirection if needed
  // https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/m4.js#L1031

  public transformNormal(v: Vector3): Vector3 {
    const mi = this.inverse().elements;
    const v0 = v.getComponent(0);
    const v1 = v.getComponent(1);
    const v2 = v.getComponent(2);

    return new Vector3(
      v0 * mi[0] + v1 * mi[4] + v2 * mi[8],
      v0 * mi[1] + v1 * mi[5] + v2 * mi[9],
      v0 * mi[2] + v1 * mi[6] + v2 * mi[10]
    );
  }

  /**
   * Convert to typed array
   * In this case, we always assume that the matrix want to be converted to
   * column major instead of row major
   */
  public toTypedArray(): Float32Array {
    const el = this.elements;

    // prettier-ignore
    return new Float32Array([
      el[0], el[4], el[8 ], el[12],
      el[1], el[5], el[9 ], el[13],
      el[2], el[6], el[10], el[14],
      el[3], el[7], el[11], el[15]
    ])
  }

  public toJSON(): Matrix4Serialized {
    return {
      elements: [...this._elements]
    };
  }

  public static fromJSON(raw: Matrix4Serialized): Matrix4 {
    return new Matrix4(raw.elements);
  }
}
