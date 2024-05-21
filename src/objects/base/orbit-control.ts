import { Camera } from '@/objects/base/camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Spherical } from '@/utils/math/spherical.ts';
import { Quaternion } from '@/utils/math/quaternion.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';
import { mod } from '@/utils/math/mod.ts';

/**
 * "Here I am, here I remain" - Leto Atreides
 *
 * This is supposed to be orbit control where the camera is rotated with target as it's center,
 * but we have a case of skill issue so that the result is somehow rendered incorrectly.
 *
 * I'll just leave it here, as a reminder of my effort to implement orbit control this way.
 *
 * Time wasted: 10-20 hours, 3 days worth of pengerjaan tubes
 *
 * Let's just settle with a trickery, where we just rotate the entire world except the camera.
 */
export class OrbitControl {
  camera: Camera;
  target: Vector3 = new Vector3(0, 0, 0); // assume target always at origin
  spherical: Spherical = new Spherical();
  sphericalDelta: Spherical = new Spherical();

  /**
   * How far you can orbit vertically, upper and lower limits
   */
  minPolarAngle: number = 0;
  maxPolarAngle: number = Math.PI;

  private rotateStart: { x: number; y: number } | null = null;

  private offset: Vector3 = new Vector3();
  private quaternion: Quaternion = new Quaternion();
  private quaternionInverse: Quaternion;

  constructor(camera: Camera) {
    this.camera = camera;
    this.quaternion.fromUnitVectors(new Vector3(0, 1, 0), new Vector3(0, 1, 0));
    this.quaternionInverse = this.quaternion.clone().invert();
  }

  get polarAngle() {
    return this.spherical.phi;
  }

  get azimuthAngle() {
    return this.spherical.theta;
  }

  get distance() {
    // assume target at origin
    return this.camera.position.distanceToVector(this.target);
  }

  update() {
    this.spherical.radius = this.distance;

    this.offset.copyFrom(this.camera.position).subVector(this.target);

    console.log('initial pos');
    console.log(this.camera.position.toJSON());
    console.log('initial offset');
    console.log(this.offset.toJSON());
    console.log('cam rot initial');
    console.log(this.camera.rotation.toJSON());

    // console.log(`quat value`);
    // console.log(this.quaternion.toJSON());
    // console.log('quat inv value');
    // console.log(this.quaternionInverse.toJSON());
    this.offset.applyQuaternion(this.quaternion);
    this.spherical.setFromVector(this.offset);
    console.log(
      `initial sphere rad ${this.spherical.radius} phi ${this.spherical.phi} theta ${this.spherical.theta}`
    );

    this.spherical.theta += this.sphericalDelta.theta;
    // this.spherical.theta = mod(this.spherical.theta + 2 * Math.PI, 2 * Math.PI);
    this.spherical.phi += this.sphericalDelta.phi;

    this.spherical.phi = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, this.spherical.phi)
    );

    this.spherical.makeSafe();

    console.log(
      `after sphere rad ${this.spherical.radius} phi ${this.spherical.phi} theta ${this.spherical.theta}`
    );

    this.offset.setFromSpherical(this.spherical);
    console.log('fucking ofset offset');
    console.log(this.offset.toJSON());

    this.offset.applyQuaternion(this.quaternionInverse);
    this.camera.position.copyFrom(this.target).addVector(this.offset);
    console.log('after pos');
    console.log(this.camera.position.toJSON());
    this.camera.lookAt(this.target);

    console.log('cam rot after');
    console.log(this.camera.rotation.toJSON());

    this.sphericalDelta.set(0, 0, 0);
    this.camera.updateWorldMatrix(false, true);
  }

  public handleMouseDownRotate(pos: { x: number; y: number }) {
    this.rotateStart = { ...pos };
    console.log('starting');
  }

  public rotateLeft(val: number) {
    this.sphericalDelta.theta += val;
  }

  public rotateUp(val: number) {
    this.sphericalDelta.phi += val;
  }

  public handleMouseUpRotate() {
    this.rotateStart = null;
  }

  public handleMouseMoveRotate(pos: { x: number; y: number }) {
    if (this.rotateStart === null) return;

    const rotateDelta = {
      x: pos.x - this.rotateStart.x,
      y: pos.y - this.rotateStart.y
    };

    const leftrotval = (2 * Math.PI * rotateDelta.x) / 800;
    const uprotval = (2 * Math.PI * rotateDelta.y) / 800;

    // this.rotateLeft(0.1);
    console.log(`rot left ${leftrotval}`);
    this.rotateLeft(leftrotval);
    // this.rotateUp(uprotval);

    this.rotateStart = { ...pos };

    this.update();
  }
}
