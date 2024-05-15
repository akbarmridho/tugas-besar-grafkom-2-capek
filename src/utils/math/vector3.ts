import { Matrix4, Matrix4Serialized } from './matrix4';
import { Quaternion } from './quaternion';
import { Serializable } from '@/objects/base/serializable.ts';

export interface Vector3Serialized {
  elements: number[];
}

export class Vector3 extends Serializable<Vector3Serialized> {
  /* Attribute */
  // Correspond to three vector components
  private x: number;
  private y: number;
  private z: number;

  /* Constructor*/
  // Create and initialize Vector3 object
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /* Setter */
  // Set a new value for all three components
  setComponents(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z === undefined ? this.z : z;

    return this;
  }

  // Set a new value for a specific component
  setComponent(axis: number, value: number): Vector3 {
    if (axis == 0) {
      this.x = value;
    } else if (axis == 1) {
      this.y = value;
    } else if (axis == 2) {
      this.z = value;
    } else {
      throw new Error('axis not found: ' + axis);
    }

    return this;
  }

  // Set a scalar value for all three components
  setScalarComponents(scalar: number): Vector3 {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;

    return this;
  }

  // Set a new value for X components
  setXComponents(x: number): Vector3 {
    this.x = x;

    return this;
  }

  // Set a new value for Y components
  setYComponents(y: number): Vector3 {
    this.y = y;

    return this;
  }

  // Set a new value for Z components
  setZComponents(z: number): Vector3 {
    this.z = z;

    return this;
  }

  /* Getter */
  // Get a value of a specific component
  getComponent(axis: number): number {
    if (axis == 0) {
      return this.x;
    } else if (axis == 1) {
      return this.y;
    } else if (axis == 2) {
      return this.z;
    } else {
      throw new Error('axis not found: ' + axis);
    }
  }

  /* Constructor Operator */
  // Make another instance with the same attribute as this Vector3
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  // Copy components from other Vector3
  copyFrom(otherVector: Vector3): Vector3 {
    this.x = otherVector.x;
    this.y = otherVector.y;
    this.z = otherVector.z;

    return this;
  }

  /* Addition Operator */
  // Add components from other Vector3 to this Vector3
  addVector(otherVector: Vector3): Vector3 {
    this.x += otherVector.x;
    this.y += otherVector.y;
    this.z += otherVector.z;

    return this;
  }

  // Add a scalar to components of this Vector3
  addScalar(scalar: number): Vector3 {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;

    return this;
  }

  // Add two different Vector3 together
  static addVectors(first: Vector3, second: Vector3): Vector3 {
    return new Vector3(
      first.x + second.x,
      first.y + second.y,
      first.z + second.z
    );
  }

  // Add components from other Vector3 with a scale to this Vector3
  addVectorWithScale(otherVector: Vector3, scale: number): Vector3 {
    this.x += otherVector.x * scale;
    this.y += otherVector.y * scale;
    this.z += otherVector.z * scale;

    return this;
  }

  /* Subtraction Operator */
  // Subtract components of this Vector3 with components of another Vector3
  subVector(otherVector: Vector3): Vector3 {
    this.x -= otherVector.x;
    this.y -= otherVector.y;
    this.z -= otherVector.z;

    return this;
  }

  subArray(otherVector: number[]): Vector3 {
    this.x -= otherVector[0];
    this.y -= otherVector[1];
    this.z -= otherVector[2];

    return this;
  }

  // Subtract a scalar from components of this Vector3
  subScalar(scalar: number): Vector3 {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;

    return this;
  }

  // Subtract two different Vector3 together
  static subVectors(first: Vector3, second: Vector3): Vector3 {
    return new Vector3(
      first.x - second.x,
      first.y - second.y,
      first.z - second.z
    );
  }

  /* Multiplication Operator */
  // Multiply components of this Vector3 with components of another Vector3
  multiplyVector(otherVector: Vector3): Vector3 {
    this.x *= otherVector.x;
    this.y *= otherVector.y;
    this.z *= otherVector.z;

    return this;
  }

  // Multiply a scalar to components of this Vector3
  multiplyScalar(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  // Multiply two different Vector3 together
  static multiplyVectors(first: Vector3, second: Vector3): Vector3 {
    return new Vector3(
      first.x * second.x,
      first.y * second.y,
      first.z * second.z
    );
  }

  /* Division Operation */
  // Divide components of this Vector3 with components of another Vector3
  divideVector(otherVector: Vector3): Vector3 {
    this.x /= otherVector.x;
    this.y /= otherVector.y;
    this.z /= otherVector.z;

    return this;
  }

  // Divide components of this Vector3 with a scalar
  divideScalar(scalar: number): Vector3 {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;

    return this;
  }

  /* General Math Operation */
  // Find the minimal value for each component
  min(otherVector: Vector3): Vector3 {
    this.x = Math.min(this.x, otherVector.x);
    this.y = Math.min(this.y, otherVector.y);
    this.z = Math.min(this.z, otherVector.z);

    return this;
  }

  // Find the maximal value for each component
  max(otherVector: Vector3): Vector3 {
    this.x = Math.max(this.x, otherVector.x);
    this.y = Math.max(this.y, otherVector.y);
    this.z = Math.max(this.z, otherVector.z);

    return this;
  }

  // Floor each component
  floor(): Vector3 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  }

  // Ceil each component
  ceil(): Vector3 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  }

  // Round each component
  round(): Vector3 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  }

  // Round to 0 for each component
  roundZero(): Vector3 {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
    this.z = Math.trunc(this.z);

    return this;
  }

  // Negate each component
  negate(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  }

  // Check if two Vector3 is the same
  equals(otherVector: Vector3): boolean {
    return (
      this.x === otherVector.x &&
      this.y === otherVector.y &&
      this.z === otherVector.z
    );
  }

  /* Vector Length */
  // Find the squared length of this Vector3
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  // Find the length of this Vector3
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  // Find the manhattan length of this Vector3 (with origin)
  manhattanLength(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  // Modify this Vector3 to have length 1
  normalize(): Vector3 {
    return this.divideScalar(this.length() || 1);
  }

  // Modify this Vector3 to have length specified
  setLength(length: number): Vector3 {
    return this.normalize().multiplyScalar(length);
  }

  /* Clamp Operation */
  // Restrict the value of components using other Vector3 (minVector < maxVector component-wise)
  clampWithVectors(minVector: Vector3, maxVector: Vector3): Vector3 {
    this.x = Math.max(minVector.x, Math.min(maxVector.x, this.x));
    this.y = Math.max(minVector.y, Math.min(maxVector.y, this.y));
    this.z = Math.max(minVector.z, Math.min(maxVector.z, this.z));

    return this;
  }

  // Restrict the value of components using two scalars (minValue < maxValue)
  clampWithScalars(minValue: number, maxValue: number): Vector3 {
    this.x = Math.max(minValue, Math.min(maxValue, this.x));
    this.y = Math.max(minValue, Math.min(maxValue, this.y));
    this.z = Math.max(minValue, Math.min(maxValue, this.z));

    return this;
  }

  // Restrict the value of components to match length
  clampLength(minLength: number, maxLength: number): Vector3 {
    return this.setLength(
      Math.max(minLength, Math.min(maxLength, this.length()))
    );
  }

  /* Dot, Cross, and Project Operator */
  // Find the dot product of vectors
  dot(otherVector: Vector3): number {
    return (
      this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z
    );
  }

  // Find the cross product of vectors
  cross(otherVector: Vector3): Vector3 {
    const x1 = this.x,
      y1 = this.y,
      z1 = this.z;
    const x2 = otherVector.x,
      y2 = otherVector.y,
      z2 = otherVector.z;

    this.x = y1 * z2 - z1 * y2;
    this.y = z1 * x2 - x1 * z2;
    this.z = x1 * y2 - y1 * x2;

    return this;
  }

  // Find the cross product of two vectors
  static crossVectors(first: Vector3, second: Vector3): Vector3 {
    const x1 = first.x,
      y1 = first.y,
      z1 = first.z;
    const x2 = second.x,
      y2 = second.y,
      z2 = second.z;

    return new Vector3(y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2);
  }

  // Find the projection of this Vector3 to another Vector3
  projectVector(otherVector: Vector3): Vector3 {
    const denominator = otherVector.lengthSquared();
    if (denominator === 0) {
      return this.setComponents(0, 0, 0);
    }

    const scalar = this.dot(otherVector) / denominator;
    return this.copyFrom(otherVector).multiplyScalar(scalar);
  }

  // Find the projection of this Vector3 to a plane (using its normal)
  projectPlane(planeNormalVector: Vector3): Vector3 {
    const temp = new Vector3();
    temp.copyFrom(this).projectVector(planeNormalVector);

    return this.subVector(temp);
  }

  /* Vector-Vector Distance */
  // Find the distance from this Vector3 to another Vector3
  distanceToVector(otherVector: Vector3): number {
    return Math.sqrt(this.distanceToVectorSquared(otherVector));
  }

  // Find the distance squared from this Vector3 to another Vector3
  distanceToVectorSquared(otherVector: Vector3): number {
    const diffX = this.x - otherVector.x,
      diffY = this.y - otherVector.y,
      diffZ = this.z - otherVector.z;
    return diffX * diffX + diffY * diffY + diffZ * diffZ;
  }

  // Find the manhattan distance from this Vector3 to another Vector3
  manhattanDistanceToVector(otherVector: Vector3): number {
    return (
      Math.abs(this.x - otherVector.x) +
      Math.abs(this.y - otherVector.y) +
      Math.abs(this.z - otherVector.z)
    );
  }

  /* Linear Interpolation */
  lerpVector(otherVector: Vector3, alpha: number): Vector3 {
    this.x += (otherVector.x - this.x) * alpha;
    this.y += (otherVector.y - this.y) * alpha;
    this.z += (otherVector.z - this.z) * alpha;

    return this;
  }

  static lerpVectors(first: Vector3, second: Vector3, alpha: number): Vector3 {
    return new Vector3(
      first.x + (second.x - first.x) * alpha,
      first.y + (second.y - first.y) * alpha,
      first.z + (second.z - first.z) * alpha
    );
  }

  /* Flatten and build from other data structure */
  flatten(array: number[] = [], offset: number = 0): number[] {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;

    return array;
  }

  fromArray(array: number[], offset: number = 0): Vector3 {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];

    return this;
  }

  /* Other Operation */
  // Reflect a vector off a plane with a normal
  reflect(planeNormalVector: Vector3): Vector3 {
    const temp = new Vector3();
    temp
      .copyFrom(planeNormalVector)
      .multiplyScalar(2 * this.dot(planeNormalVector));

    return this.subVector(temp);
  }

  // Find the angle between this Vector3 and another Vector3
  angleBetween(otherVector: Vector3) {
    const denominator = Math.sqrt(
      this.lengthSquared() * otherVector.lengthSquared()
    );
    if (denominator === 0) {
      return Math.PI / 2;
    }

    const theta = this.dot(otherVector) / denominator;
    return Math.acos(Math.max(-1, Math.min(1, theta)));
  }

  // Apply quaternion to this Vector3
  applyQuaternion(q: Quaternion): Vector3 {
    const vx = this.x,
      vy = this.y,
      vz = this.z;
    const qx = q.elements[0],
      qy = q.elements[1],
      qz = q.elements[2],
      qw = q.elements[3];

    const tx = 2 * (qy * vz - qz * vy);
    const ty = 2 * (qz * vx - qx * vz);
    const tz = 2 * (qx * vy - qy * vx);

    this.x = vx + qw * tx + qy * tz - qz * ty;
    this.y = vy + qw * ty + qz * tx - qx * tz;
    this.z = vz + qw * tz + qx * ty - qy * tx;

    return this;
  }

  // Apply or multiply a Matrix to this Vector3
  applyMatrix4(m: Matrix4): Vector3 {
    const x = this.x,
      y = this.y,
      z = this.z;
    const e = m.elements;

    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

    return this;
  }

  public toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  public toJSON(): Vector3Serialized {
    return {
      elements: [this.x, this.y, this.z]
    };
  }

  public static fromJSON(raw: Vector3Serialized): Vector3 {
    return new Vector3(...raw.elements);
  }
}
