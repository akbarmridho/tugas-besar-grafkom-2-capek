import { Serializable } from '../../objects/serializable.ts';
import { Euler } from './euler.ts';
import { Matrix4 } from './matrix4.ts';
import { Vector3 } from './vector3.ts';

export interface QuaternionSerialized {
  data: number[];
}

export class Quaternion extends Serializable<QuaternionSerialized> {
  private _elements: number[];

  constructor(x = 0, y = 0, z = 0, w = 1) {
    super();
    this._elements = [x, y, z, w];
  }

  get elements() {
    return this._elements;
  }

  /**
   * Multiply two quaternions
   *
   * if this instance is a and other is b, then the result is
   * result = a * b
   *
   * @param other
   */
  public multiply(other: Quaternion): this {
    return this.multiplyQuaternions(this, other);
  }

  public premultiply(other: Quaternion): this {
    return this.multiplyQuaternions(other, this);
  }

  public static fromRotationMatrix(m: Matrix4): Quaternion {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    const el = m.elements;

    const m11 = el[0],
      m12 = el[1],
      m13 = el[2];
    const m21 = el[4],
      m22 = el[5],
      m23 = el[6];
    const m31 = el[8],
      m32 = el[9],
      m33 = el[10];

    const trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);

      return new Quaternion(
        0.25 / s,
        (m32 - m23) * s,
        (m13 - m31) * s,
        (m21 - m12) * s
      );
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

      return new Quaternion(
        (m32 - m23) / s,
        0.25 * s,
        (m12 + m21) / s,
        (m13 + m31) / s
      );
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

      return new Quaternion(
        (m13 - m31) / s,
        (m12 + m21) / s,
        0.25 * s,
        (m23 + m32) / s
      );
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

      return new Quaternion(
        (m21 - m12) / s,
        (m13 + m31) / s,
        (m23 + m32) / s,
        0.25 * s
      );
    }
  }

  public fromRotationMatrix(m: Matrix4): this {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    const el = m.elements;

    const m11 = el[0],
      m12 = el[1],
      m13 = el[2];
    const m21 = el[4],
      m22 = el[5],
      m23 = el[6];
    const m31 = el[8],
      m32 = el[9],
      m33 = el[10];

    const trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);

      this._elements[0] = 0.25 / s;
      this._elements[1] = (m32 - m23) * s;
      this._elements[2] = (m13 - m31) * s;
      this._elements[3] = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

      this._elements[0] = (m32 - m23) / s;
      this._elements[1] = 0.25 * s;
      this._elements[2] = (m12 + m21) / s;
      this._elements[3] = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

      this._elements[0] = (m13 - m31) / s;
      this._elements[1] = (m12 + m21) / s;
      this._elements[2] = 0.25 * s;
      this._elements[3] = (m23 + m32) / s;
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

      this._elements[0] = (m21 - m12) / s;
      this._elements[1] = (m13 + m31) / s;
      this._elements[2] = (m23 + m32) / s;
      this._elements[3] = 0.25 * s;
    }

    return this;
  }

  // set from axis angle
  public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // assumes axis is normalized
    const halfAngle = angle / 2,
      s = Math.sin(halfAngle);

    return new Quaternion(
      axis.getComponent(0) * s,
      axis.getComponent(1) * s,
      axis.getComponent(2) * s,
      Math.cos(halfAngle)
    );
  }

  // set from axis angle
  public fromAxisAngle(axis: Vector3, angle: number): this {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // assumes axis is normalized
    const halfAngle = angle / 2,
      s = Math.sin(halfAngle);

    this._elements[0] = axis.getComponent(0) * s;
    this._elements[1] = axis.getComponent(1) * s;
    this._elements[2] = axis.getComponent(2) * s;
    this._elements[3] = Math.cos(halfAngle);

    return this;
  }

  public fromEuler(euler: Euler): Quaternion {
    const x = euler.x;
    const y = euler.y;
    const z = euler.z;

    const cos = Math.cos;
    const sin = Math.sin;

    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);
    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);

    this._elements[0] = s1 * c2 * c3 + c1 * s2 * s3;
    this._elements[1] = c1 * s2 * c3 - s1 * c2 * s3;
    this._elements[2] = c1 * c2 * s3 + s1 * s2 * c3;
    this._elements[3] = c1 * c2 * c3 - s1 * s2 * s3;

    return this;
  }

  public copy(): Quaternion {
    return new Quaternion(
      this._elements[0],
      this._elements[1],
      this._elements[2],
      this._elements[3]
    );
  }

  public invert(): this {
    return this.conjugate();
  }

  public conjugate(): this {
    this._elements[0] *= -1;
    this._elements[1] *= -1;
    this._elements[2] *= -1;

    return this;
  }

  toJSON(): QuaternionSerialized {
    return {
      data: [...this._elements]
    };
  }

  public static fromJSON(raw: QuaternionSerialized): Quaternion {
    return new Quaternion(raw.data[0], raw.data[1], raw.data[2], raw.data[3]);
  }

  public set(x: number, y: number, z: number, w: number): this {
    this._elements[0] = x;
    this._elements[1] = y;
    this._elements[2] = z;
    this._elements[3] = w;

    return this;
  }

  public dot(v: Quaternion): number {
    return (
      this._elements[0] * v._elements[0] +
      this._elements[1] * v._elements[1] +
      this._elements[2] * v._elements[2] +
      this._elements[3] * v._elements[3]
    );
  }

  public lengthSq(): number {
    return (
      this._elements[0] * this._elements[0] +
      this._elements[1] * this._elements[1] +
      this._elements[2] * this._elements[2] +
      this._elements[3] * this._elements[3]
    );
  }

  public length(): number {
    return Math.sqrt(this.lengthSq());
  }

  public normalize(): this {
    const len = this.length();
    if (len === 0) return this;

    const invLen = 1 / len;

    this._elements[0] *= invLen;
    this._elements[1] *= invLen;
    this._elements[2] *= invLen;
    this._elements[3] *= invLen;

    return this;
  }

  public inverse(): this {
    const dot = this.dot(this);

    if (dot === 0) {
      console.warn(
        "Quaternion inverse() can't invert a zero-length quaternion"
      );
      return this;
    }

    const invDot = 1 / dot;

    return this.conjugate().multiplyScalar(invDot);
  }

  public fromUnitVectors(vFrom: Vector3, vTo: Vector3): this {
    let r = vFrom.dot(vTo) + 1;
    if (r < Number.EPSILON) {
      r = 0;

      if (Math.abs(vFrom.getComponent(0)) > Math.abs(vFrom.getComponent(2))) {
        this.set(-vFrom.getComponent(1), vFrom.getComponent(0), 0, r);
      } else {
        this.set(0, -vFrom.getComponent(2), vFrom.getComponent(1), r);
      }
    } else {
      this.set(
        vFrom.getComponent(1) * vTo.getComponent(2) -
          vFrom.getComponent(2) * vTo.getComponent(1),
        vFrom.getComponent(2) * vTo.getComponent(0) -
          vFrom.getComponent(0) * vTo.getComponent(2),
        vFrom.getComponent(0) * vTo.getComponent(1) -
          vFrom.getComponent(1) * vTo.getComponent(0),
        r
      );
    }

    return this.normalize();
  }

  public equals(quaternion: Quaternion): boolean {
    return (
      quaternion._elements[0] === this._elements[0] &&
      quaternion._elements[1] === this._elements[1] &&
      quaternion._elements[2] === this._elements[2] &&
      quaternion._elements[3] === this._elements[3]
    );
  }

  public fromArray(array: number[], offset = 0): this {
    this._elements[0] = array[offset];
    this._elements[1] = array[offset + 1];
    this._elements[2] = array[offset + 2];
    this._elements[3] = array[offset + 3];

    return this;
  }

  public toArray(array: number[] = [], offset = 0): number[] {
    array[offset] = this._elements[0];
    array[offset + 1] = this._elements[1];
    array[offset + 2] = this._elements[2];
    array[offset + 3] = this._elements[3];

    return array;
  }

  public fromBufferAttribute(
    attribute: {
      getX(i: number): number;
      getY(i: number): number;
      getZ(i: number): number;
      getW(i: number): number;
    },
    index: number
  ): this {
    this._elements[0] = attribute.getX(index);
    this._elements[1] = attribute.getY(index);
    this._elements[2] = attribute.getZ(index);
    this._elements[3] = attribute.getW(index);

    return this;
  }

  public clone(): Quaternion {
    return new Quaternion().fromArray(this._elements);
  }

  public slerp(qb: Quaternion, t: number): this {
    if (t === 0) return this;
    if (t === 1) return this.copy() as this;

    const x = this._elements[0],
      y = this._elements[1],
      z = this._elements[2],
      w = this._elements[3];

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
    let cosHalfTheta =
      w * qb._elements[3] +
      x * qb._elements[0] +
      y * qb._elements[1] +
      z * qb._elements[2];

    if (cosHalfTheta < 0) {
      this._elements[3] = -qb._elements[3];
      this._elements[0] = -qb._elements[0];
      this._elements[1] = -qb._elements[1];
      this._elements[2] = -qb._elements[2];
      cosHalfTheta = -cosHalfTheta;
    } else {
      this.copy(); // Remove the argument from the copy() method call
    }

    if (cosHalfTheta >= 1.0) {
      this._elements[3] = w;
      this._elements[0] = x;
      this._elements[1] = y;
      this._elements[2] = z;
      return this;
    }

    const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this._elements[3] = s * w + t * this._elements[3];
      this._elements[0] = s * x + t * this._elements[0];
      this._elements[1] = s * y + t * this._elements[1];
      this._elements[2] = s * z + t * this._elements[2];
      return this.normalize();
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this._elements[3] = w * ratioA + this._elements[3] * ratioB;
    this._elements[0] = x * ratioA + this._elements[0] * ratioB;
    this._elements[1] = y * ratioA + this._elements[1] * ratioB;
    this._elements[2] = z * ratioA + this._elements[2] * ratioB;

    return this;
  }

  public multiplyQuaternions(a: Quaternion, b: Quaternion): this {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    const qax = a._elements[0],
      qay = a._elements[1],
      qaz = a._elements[2],
      qaw = a._elements[3];
    const qbx = b._elements[0],
      qby = b._elements[1],
      qbz = b._elements[2],
      qbw = b._elements[3];

    this._elements[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this._elements[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this._elements[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this._elements[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    return this;
  }

  public equalsArray(array: number[], offset = 0): boolean {
    return (
      this._elements[0] === array[offset] &&
      this._elements[1] === array[offset + 1] &&
      this._elements[2] === array[offset + 2] &&
      this._elements[3] === array[offset + 3]
    );
  }

  public toEuler(): Vector3 {
    const x = this._elements[0],
      y = this._elements[1],
      z = this._elements[2],
      w = this._elements[3];

    const test = x * y + z * w;
    const heading = Math.atan2(
      2 * x * w - 2 * y * z,
      1 - 2 * x * x - 2 * z * z
    );
    const attitude =
      test > 0.499
        ? Math.PI / 2
        : test < -0.499
          ? -Math.PI / 2
          : Math.asin(2 * test);
    const bank = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * y * y - 2 * z * z);

    return new Vector3(heading, attitude, bank);
  }

  public clampScalar(minVal: number, maxVal: number): this {
    this._elements[3] = Math.max(minVal, Math.min(this._elements[3], maxVal));
    return this;
  }

  public clampLength(min: number, max: number): this {
    const length = this.length();
    if (length === 0) return this;

    const clampedLength = Math.min(Math.max(length, min), max);
    return this.normalize().multiplyScalar(clampedLength);
  }

  public floor(): this {
    this._elements[0] = Math.floor(this._elements[0]);
    this._elements[1] = Math.floor(this._elements[1]);
    this._elements[2] = Math.floor(this._elements[2]);
    this._elements[3] = Math.floor(this._elements[3]);

    return this;
  }

  public ceil(): this {
    this._elements[0] = Math.ceil(this._elements[0]);
    this._elements[1] = Math.ceil(this._elements[1]);
    this._elements[2] = Math.ceil(this._elements[2]);
    this._elements[3] = Math.ceil(this._elements[3]);

    return this;
  }

  public round(): this {
    this._elements[0] = Math.round(this._elements[0]);
    this._elements[1] = Math.round(this._elements[1]);
    this._elements[2] = Math.round(this._elements[2]);
    this._elements[3] = Math.round(this._elements[3]);

    return this;
  }

  public roundToZero(): this {
    this._elements[0] =
      this._elements[0] < 0
        ? Math.ceil(this._elements[0])
        : Math.floor(this._elements[0]);
    this._elements[1] =
      this._elements[1] < 0
        ? Math.ceil(this._elements[1])
        : Math.floor(this._elements[1]);
    this._elements[2] =
      this._elements[2] < 0
        ? Math.ceil(this._elements[2])
        : Math.floor(this._elements[2]);
    this._elements[3] =
      this._elements[3] < 0
        ? Math.ceil(this._elements[3])
        : Math.floor(this._elements[3]);

    return this;
  }

  public multiplyScalar(scalar: number): this {
    this._elements[0] *= scalar;
    this._elements[1] *= scalar;
    this._elements[2] *= scalar;
    this._elements[3] *= scalar;

    return this;
  }

  public addScalar(scalar: number): this {
    this._elements[0] += scalar;
    this._elements[1] += scalar;
    this._elements[2] += scalar;
    this._elements[3] += scalar;

    return this;
  }

  public addScaledVector(v: Vector3, s: number): this {
    this._elements[0] += v.getComponent(0) * s;
    this._elements[1] += v.getComponent(1) * s;
    this._elements[2] += v.getComponent(2) * s;
    this._elements[3] += v.getComponent(3) * s;

    return this;
  }

  public min(v: Quaternion): this {
    this._elements[0] = Math.min(this._elements[0], v._elements[0]);
    this._elements[1] = Math.min(this._elements[1], v._elements[1]);
    this._elements[2] = Math.min(this._elements[2], v._elements[2]);
    this._elements[3] = Math.min(this._elements[3], v._elements[3]);

    return this;
  }

  public max(v: Quaternion): this {
    this._elements[0] = Math.max(this._elements[0], v._elements[0]);
    this._elements[1] = Math.max(this._elements[1], v._elements[1]);
    this._elements[2] = Math.max(this._elements[2], v._elements[2]);
    this._elements[3] = Math.max(this._elements[3], v._elements[3]);

    return this;
  }

  public dotScalar(v: Quaternion): number {
    return (
      this._elements[0] * v._elements[0] +
      this._elements[1] * v._elements[1] +
      this._elements[2] * v._elements[2] +
      this._elements[3] * v._elements[3]
    );
  }

  public multiplyQuaternionsFlat(
    a: number[],
    offsetA: number,
    b: number[],
    offsetB: number,
    target: number[],
    offsetTarget: number
  ): this {
    const x = a[offsetA];
    const y = a[offsetA + 1];
    const z = a[offsetA + 2];
    const w = a[offsetA + 3];

    const qax = x,
      qay = y,
      qaz = z,
      qaw = w;
    const qbx = b[offsetB],
      qby = b[offsetB + 1],
      qbz = b[offsetB + 2],
      qbw = b[offsetB + 3];

    target[offsetTarget] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    target[offsetTarget + 1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    target[offsetTarget + 2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    target[offsetTarget + 3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    return this;
  }

  public exp(): this {
    // From http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
    const angle = Math.sqrt(
      this._elements[0] * this._elements[0] +
        this._elements[1] * this._elements[1] +
        this._elements[2] * this._elements[2]
    );

    const sin = Math.sin(angle);

    this._elements[3] = Math.cos(angle);

    if (Math.abs(sin) >= 0.0001) {
      const factor = sin / angle;
      this._elements[0] *= factor;
      this._elements[1] *= factor;
      this._elements[2] *= factor;
    }

    return this;
  }

  public log(): this {
    // From http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
    if (Math.abs(this._elements[3]) < 1) {
      const theta = Math.acos(this._elements[3]);
      const sin = Math.sin(theta);

      if (sin > 0) {
        const coef = theta / sin;
        this._elements[0] *= coef;
        this._elements[1] *= coef;
        this._elements[2] *= coef;
      }
    }

    this._elements[3] = 0;

    return this;
  }

  public axisAngleFromQuaternion(q: Quaternion): this {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
    // q is assumed to be normalized
    this._elements[3] = 2 * Math.acos(q._elements[3]);
    const s = Math.sqrt(1 - q._elements[3] * q._elements[3]);
    if (s < 0.001) {
      this._elements[0] = 1;
      this._elements[1] = 0;
      this._elements[2] = 0;
    } else {
      this._elements[0] = q._elements[0] / s;
      this._elements[1] = q._elements[1] / s;
      this._elements[2] = q._elements[2] / s;
    }

    return this;
  }

  public axisAngleFromRotationMatrix(m: Matrix4): this {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    let angle: number, x: number, y: number, z: number; // variables for result
    const epsilon = 0.01,
      epsilon2 = 0.1 * epsilon; // margin to allow for rounding errors
    const te = m.elements;
    const m11 = te[0],
      m12 = te[4],
      m13 = te[8];
    const m21 = te[1],
      m22 = te[5],
      m23 = te[9];
    const m31 = te[2],
      m32 = te[6],
      m33 = te[10];

    if (
      Math.abs(m12 - m21) < epsilon &&
      Math.abs(m13 - m31) < epsilon &&
      Math.abs(m23 - m32) < epsilon
    ) {
      // singularity found. First, check for identity matrix which must have +1 for all terms
      // in leading diagonal and zero in other terms
      if (
        Math.abs(m12 + m21) < epsilon2 &&
        Math.abs(m13 + m31) < epsilon2 &&
        Math.abs(m23 + m32) < epsilon2 &&
        Math.abs(m11 + m22 + m33 - 3) < epsilon2
      ) {
        // this singularity is identity matrix so angle = 0
        this.set(1, 0, 0, 0); // zero angle, arbitrary axis
      } else {
        // otherwise this singularity is angle = 180
        angle = Math.PI;
        const xx = (m11 + 1) / 2;
        const yy = (m22 + 1) / 2;
        const zz = (m33 + 1) / 2;
        const xy = (m12 + m21) / 4;
        const xz = (m13 + m31) / 4;
        const yz = (m23 + m32) / 4;
        if (xx > yy && xx > zz) {
          // m11 is the largest diagonal term
          if (xx < epsilon) {
            x = 0;
            y = 0.707106781;
            z = 0.707106781;
          } else {
            x = Math.sqrt(xx);
            y = xy / x;
            z = xz / x;
          }
        } else if (yy > zz) {
          // m22 is the largest diagonal term
          if (yy < epsilon) {
            x = 0.707106781;
            y = 0;
            z = 0.707106781;
          } else {
            y = Math.sqrt(yy);
            x = xy / y;
            z = yz / y;
          }
        } else {
          // m33 is the largest diagonal term so base result on this
          if (zz < epsilon) {
            x = 0.707106781;
            y = 0.707106781;
            z = 0;
          } else {
            z = Math.sqrt(zz);
            x = xz / z;
            y = yz / z;
          }
        }

        this.set(x, y, z, angle);
      }
    } else {
      // as we have reached here there are no singularities so we can handle normally
      let s = Math.sqrt(
        (m32 - m23) * (m32 - m23) +
          (m13 - m31) * (m13 - m31) +
          (m21 - m12) * (m21 - m12)
      ); // used to normalize
      if (Math.abs(s) < 0.001) s = 1;

      // prevent divide by zero, should not happen if matrix is orthogonal and should be
      // caught by singularity test above, but I've left it in just in case
      this._elements[0] = (m32 - m23) / s;
      this._elements[1] = (m13 - m31) / s;
      this._elements[2] = (m21 - m12) / s;
      this._elements[3] = Math.acos((m11 + m22 + m33 - 1) / 2);
    }

    return this;
  }

  public angleTo(q: Quaternion): number {
    return 2 * Math.acos(Math.abs(Math.min(Math.max(this.dot(q), -1), 1)));
  }

  public rotateTowards(q: Quaternion, step: number): this {
    const angle = this.angleTo(q);

    if (angle === 0) return this;

    const t = Math.min(1, step / angle);

    this.slerp(q, t);

    return this;
  }

  public identity(): this {
    this.set(0, 0, 0, 1);
    return this;
  }
}
