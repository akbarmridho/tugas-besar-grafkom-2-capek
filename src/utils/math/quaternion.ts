import { Serializable } from '../../objects/serializable.ts';
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
  public multiply(other: Quaternion): Quaternion {
    const qax = this.elements[0],
      qay = this.elements[1],
      qaz = this.elements[2],
      qaw = this.elements[3];
    const qbx = other.elements[0],
      qby = other.elements[1],
      qbz = other.elements[2],
      qbw = other.elements[3];

    return new Quaternion(
      qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
      qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
      qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
      qaw * qbw - qax * qbx - qay * qby - qaz * qbz
    );
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

  public copy(): Quaternion {
    return new Quaternion(
      this._elements[0],
      this._elements[1],
      this._elements[2],
      this._elements[3]
    );
  }

  public invert(): Quaternion {
    return this.conjugate();
  }

  public conjugate(): Quaternion {
    return new Quaternion(
      this._elements[0] * -1,
      this._elements[1] * -1,
      this._elements[2] * -1,
      this._elements[3]
    );
  }

  toJSON(): QuaternionSerialized {
    return {
      data: [...this._elements]
    };
  }

  public static fromJSON(raw: QuaternionSerialized): Quaternion {
    return new Quaternion(raw.data[0], raw.data[1], raw.data[2], raw.data[3]);
  }
}
