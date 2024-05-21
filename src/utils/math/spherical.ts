import { clamp } from '@/utils/other.ts';
import { Vector3 } from '@/utils/math/vector3.ts';

/**
 * Spherical converter
 *
 * We assume that upward axis is y axis.
 * Angle between xz axis is called theta
 * Angle between line in xz to y (from top is phi)
 *
 * x = r sin(phi) cos(theta)
 * y = r cos(phi)
 * z = r sin(phi) sin(theta)
 *
 * theta = atan(z/x)
 */
export class Spherical {
  public radius: number;
  public phi: number;
  public theta: number;

  constructor(radius: number = 1, phi: number = 0, theta: number = 0) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  }

  set(radius: number, phi: number, theta: number) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  }

  copy(other: Spherical) {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;

    return this;
  }

  /**
   * Restrict phi to be between EPS and PI-EPS
   */
  makeSafe() {
    const EPS = 0.000001;

    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

    return this;
  }

  setFromCartesianCoordinates(x: number, y: number, z: number) {
    this.radius = Math.sqrt(x * x + y * y + z * z);

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(z, x);
      this.phi = Math.acos(clamp(y / this.radius, -1, 1));
    }

    return this;
  }

  setFromVector(vector: Vector3) {
    return this.setFromCartesianCoordinates(vector.x, vector.y, vector.z);
  }

  clone() {
    return new Spherical().copy(this);
  }
}
