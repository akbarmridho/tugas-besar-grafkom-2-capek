import { Matrix4 } from '@/utils/math/matrix4.ts';
import { Node, NodeSerialized } from './node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { radianToDegree } from '@/utils/math/angle.ts';
import { mod } from '@/utils/math/mod.ts';

export abstract class Camera<
  // @ts-ignore
  T extends NodeSerialized = unknown
> extends Node<T> {
  protected _projectionMatrix: Matrix4 = Matrix4.identity();
  protected _viewProjectionMatrix: Matrix4 = Matrix4.identity();
  protected _invWorldMatrix: Matrix4 = Matrix4.identity();

  updateWorldMatrix(
    updateParents: boolean = true,
    updateChildren: boolean = true
  ) {
    super.updateWorldMatrix(updateParents, updateChildren);
    this._invWorldMatrix = this.worldMatrix.copy().inverse();
    this._viewProjectionMatrix = this._invWorldMatrix
      .copy()
      .multiplyMatrix(this.projectionMatrix);
  }

  get viewProjectionMatrix() {
    return this._viewProjectionMatrix;
  }

  get projectionMatrix() {
    return this._projectionMatrix;
  }

  protected set projectionMatrix(val) {
    this._projectionMatrix = val;
    this._viewProjectionMatrix = this._invWorldMatrix
      .copy()
      .multiplyMatrix(this.projectionMatrix);
  }

  public lookAt(at: Vector3) {
    const look = Transformation.lookAt(this.position, at, new Vector3(0, 1, 0));

    this.rotation.setFromRotationMatrix(look);
    this.quaternion.fromRotationMatrix(look);

    // this.updateWorldMatrix();
    //
    // if (this.parent) {
    //   const parent = Transformation.decompose(this.worldMatrix);
    //   this.quaternion.premultiply(parent.quaternion.invert());
    // }

    /**
     *    if ( parent ) {
     *
     *      _m1.extractRotation( parent.matrixWorld );
     *      _q1.setFromRotationMatrix( _m1 );
     *      this.quaternion.premultiply( _q1.invert() );
     *
     *    }
     *
     *    use this code if the camera is not a children of scene or if the scene have
     *    rotation value in it
     */
  }

  /**
   * Create new pos, replace pos but does not update the world matrix
   * @param deltaThetha
   * @param deltaPhi
   */
  public rotateAlongCenter(deltaThetha: number, deltaPhi: number) {
    const R = this.position.length();
    const x = this.position.getComponent(0);
    const y = this.position.getComponent(1);
    const z = this.position.getComponent(2);

    // console.log(`length ${R}`);
    // const xy = Math.sqrt(x * x + y * y);

    const theta = Math.atan2(y, x);
    const phi = Math.acos(z / R);

    const newTheta = theta + deltaThetha;
    // const newPhi = mod(phi + deltaPhi + 2 * Math.PI, 2 * Math.PI);
    const newPhi = phi + deltaPhi;
    console.log(
      `initial degree theta ${radianToDegree(theta)} phi ${radianToDegree(phi)}\n
      new degree theta ${radianToDegree(newTheta)} phi ${radianToDegree(newPhi)} \n
      with delta theta ${radianToDegree(deltaThetha)} phi ${radianToDegree(deltaPhi)}`
    );

    const newX = R * Math.sin(newPhi) * Math.cos(newTheta);
    const newY = R * Math.sin(newPhi) * Math.sin(newTheta);
    const newZ = R * Math.cos(newPhi);

    console.log(
      `initial pos ${x}, ${y}, ${z}\nnew pos ${newX}, ${newY}, ${newZ}`
    );

    this.position.setComponents(newX, newY, newZ);
  }

  abstract computeProjectionMatrix(): void;
}
