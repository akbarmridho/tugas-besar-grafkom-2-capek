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
    //
    // console.log('look at transform');
    // console.log(look.toJSON());
    //
    // const dec = Transformation.decompose(look);
    //
    // this.quaternion.fromQuaternion(dec.quaternion);
    // this.rotation.setFromQuaternion(this.quaternion);

    if (this.parent) {
      const parent = Transformation.decompose(this.worldMatrix);
      this.quaternion.premultiply(parent.quaternion.invert());
      this.rotation.setFromQuaternion(this.quaternion);
    }
  }

  abstract computeProjectionMatrix(): void;
}
