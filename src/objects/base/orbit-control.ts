import { Camera } from '@/objects/base/camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Spherical } from '@/utils/math/spherical.ts';
import { Quaternion } from '@/utils/math/quaternion.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';

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
    const position = this.camera.position;

    this.offset.copyFrom(position).subVector(this.target);

    console.log(`quat value`);
    console.log(this.quaternion.toJSON());
    console.log('quat inv value');
    console.log(this.quaternionInverse.toJSON());
    // this.offset.applyQuaternion(this.quaternion);
    this.spherical.setFromVector(this.offset);

    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    this.spherical.phi = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, this.spherical.phi)
    );

    this.spherical.makeSafe();

    this.offset.setFromSpherical(this.spherical);
    // this.offset.applyQuaternion(this.quaternionInverse);
    position.copyFrom(this.target).addVector(this.offset);

    this.camera.lookAt(this.target);

    this.sphericalDelta.set(0, 0, 0);
    this.camera.updateWorldMatrix(true, true);
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

    this.rotateLeft(leftrotval);
    this.rotateUp(uprotval);

    this.rotateStart = { ...pos };

    this.update();
  }
}
