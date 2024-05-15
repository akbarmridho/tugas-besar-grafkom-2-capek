import { Matrix4 } from '@/utils/math/matrix4.ts';
import { Node, NodeSerialized } from '../node';

export abstract class Camera<T extends NodeSerialized> extends Node<T> {
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

  abstract computeProjectionMatrix(): void;
}
