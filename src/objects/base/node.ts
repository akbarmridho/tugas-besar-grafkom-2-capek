import { Euler, EulerSerialized } from '@/utils/math/euler.ts';
import { Matrix4 } from '@/utils/math/matrix4.ts';
import { Quaternion } from '@/utils/math/quaternion.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { Vector3, Vector3Serialized } from '@/utils/math/vector3.ts';
import { Serializable } from './serializable.ts';

export interface NodeSerialized {
  name: string;
  transform: {
    position: Vector3Serialized;
    rotation: EulerSerialized;
    scale: Vector3Serialized;
  };
}

export abstract class Node<
  // @ts-ignore
  T extends NodeSerialized = unknown
> extends Serializable<T> {
  /* Attribute */
  // Transform attributes
  private _position: Vector3;
  private _rotation: Euler;
  private _quaternion: Quaternion;
  private _scale: Vector3;

  // Matrices
  private _localMatrix: Matrix4 = Matrix4.identity();
  private _worldMatrix: Matrix4 = Matrix4.identity();

  // Relation to other nodes
  // @ts-ignore
  private _parent: Node<unknown> | null = null;
  // @ts-ignore
  private _children: Node<unknown>[] = [];

  // Other
  name: string = 'node';
  visible: boolean = true;

  /* Constructor */
  // Initialize Node object
  constructor(
    name: string,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super();

    this.name = name;

    if (position) {
      this._position = position.clone();
    } else {
      this._position = new Vector3();
    }

    if (rotation) {
      this._rotation = rotation.clone();
      this._quaternion = new Quaternion().fromEuler(this._rotation);
    } else {
      this._rotation = new Euler();
      this._quaternion = new Quaternion();
    }

    if (scale) {
      this._scale = scale.clone();
    } else {
      this._scale = new Vector3(1, 1, 1);
    }

    this.updateLocalMatrix();
  }

  /* Getter */
  get position(): Vector3 {
    return this._position;
  }
  get rotation(): Euler {
    return this._rotation;
  }
  get quaternion(): Quaternion {
    return this._quaternion;
  }
  get scale(): Vector3 {
    return this._scale;
  }
  get localMatrix(): Matrix4 {
    return this._localMatrix;
  }
  get worldMatrix(): Matrix4 {
    return this._worldMatrix;
  }
  // @ts-ignore
  get parent(): Node<unknown> | null {
    return this._parent;
  }
  // @ts-ignore
  get children(): Node<unknown>[] {
    return this._children;
  }

  /* Manage Relation With Other Nodes */
  // Set parent for this node
  // @ts-ignore
  set parent(parent: Node<unknown> | null) {
    if (this._parent !== parent) {
      this._parent = parent;
      this.updateWorldMatrix(false, true);
    }
  }

  // Add a new children for this node
  // If the children already have parent, replace parent with this node
  // @ts-ignore
  addChildren(node: Node<unknown>): Node<T> {
    node.removeFromParent();
    node.parent = this;
    this._children.push(node);

    return this;
  }

  // Remove a children and set that children parent to null
  // @ts-ignore
  removeChildren(node: Node<unknown>): Node<T> {
    const indexToRemove = this._children.indexOf(node);

    if (indexToRemove !== -1) {
      node.parent = null;
      this._children.splice(indexToRemove, 1);
    }

    return this;
  }

  // Remove this node from its parent
  removeFromParent(): Node<T> {
    if (this._parent !== null) {
      this._parent.removeChildren(this);
    }

    return this;
  }

  /* Matrix Update */
  // Update local matrix from node current attribute
  updateLocalMatrix(): void {
    const position = this._position;
    const rotation = this._rotation;
    const scale = this._scale;

    this._localMatrix = Transformation.translation(
      position.getComponent(0),
      position.getComponent(1),
      position.getComponent(2)
    ).multiplyMatrix(
      Transformation.zRotation(rotation.z).multiplyMatrix(
        Transformation.yRotation(rotation.y).multiplyMatrix(
          Transformation.xRotation(rotation.x).multiplyMatrix(
            Transformation.scaling(
              scale.getComponent(0),
              scale.getComponent(1),
              scale.getComponent(2)
            )
          )
        )
      )
    );
  }

  // Update the matrix of all node
  updateWorldMatrix(
    updateParents: boolean = true,
    updateChildren: boolean = true
  ): void {
    if (updateParents && this._parent !== null) {
      this._parent.updateWorldMatrix(true, false);
    }

    this.updateLocalMatrix();

    if (this._parent !== null) {
      this._worldMatrix = this._localMatrix
        .copy()
        .multiplyMatrix(this._parent.worldMatrix);
    } else {
      this._worldMatrix = this._localMatrix.copy();
    }

    if (updateChildren) {
      for (let i = 0; i < this._children.length; i++) {
        this._children[i].updateWorldMatrix(false, true);
      }
    }
  }

  /* Node Rotation */
  applyQuaternion(q: Quaternion): Node<T> {
    this._quaternion.premultiply(q);
    this._rotation.setFromQuaternion(this._quaternion);
    this.updateWorldMatrix(false, true);
    return this;
  }

  setRotationFromAxisAngle(axis: Vector3, angle: number) {
    this._quaternion.fromAxisAngle(axis, angle);
    this._rotation.setFromQuaternion(this._quaternion);
    this.updateWorldMatrix(false, true);
  }

  setRotationFromRotationMatrix(m: Matrix4) {
    this._quaternion.fromRotationMatrix(m);
    this._rotation.setFromRotationMatrix(m);
    this.updateWorldMatrix(false, true);
  }

  setRotationFromQuaternion(q: Quaternion) {
    this._quaternion = q.copy();
    this._rotation.setFromQuaternion(this._quaternion);
    this.updateWorldMatrix(false, true);
  }

  rotateOnWorldAxis(axis: Vector3, angle: number): Node<T> {
    const q: Quaternion = Quaternion.fromAxisAngle(axis, angle);
    this.applyQuaternion(q);

    return this;
  }

  rotateOnAxis(axis: Vector3, angle: number): Node<T> {
    const q: Quaternion = Quaternion.fromAxisAngle(axis, angle);
    this._quaternion.multiply(q);
    this._rotation.setFromQuaternion(this._quaternion);
    this.updateWorldMatrix(false, true);

    return this;
  }

  rotateOnX(angle: number): Node<T> {
    return this.rotateOnAxis(new Vector3(1, 0, 0), angle);
  }

  rotateOnY(angle: number): Node<T> {
    return this.rotateOnAxis(new Vector3(0, 1, 0), angle);
  }

  rotateOnZ(angle: number): Node<T> {
    return this.rotateOnAxis(new Vector3(0, 0, 1), angle);
  }

  /* Node Translation */
  translateOnAxis(axis: Vector3, distance: number): Node<T> {
    const v: Vector3 = axis.clone().applyQuaternion(this.quaternion);
    this.position.addVector(v.multiplyScalar(distance));
    this.updateWorldMatrix(false, true);
    return this;
  }

  translateOnX(distance: number): Node<T> {
    return this.translateOnAxis(new Vector3(1, 0, 0), distance);
  }

  translateOnY(distance: number): Node<T> {
    return this.translateOnAxis(new Vector3(0, 1, 0), distance);
  }

  translateOnZ(distance: number): Node<T> {
    return this.translateOnAxis(new Vector3(0, 0, 1), distance);
  }

  /* Node Scaling */
  scaleOnX(scale: number): Node<T> {
    this._scale.setComponent(0, scale);
    this.updateWorldMatrix(false, true);
    return this;
  }

  scaleOnY(scale: number): Node<T> {
    this._scale.setComponent(1, scale);
    this.updateWorldMatrix(false, true);
    return this;
  }

  scaleOnZ(scale: number): Node<T> {
    this._scale.setComponent(2, scale);
    this.updateWorldMatrix(false, true);
    return this;
  }

  /* Additional Method */
  // Transform from local space to world space
  localToWorld(v: Vector3): Vector3 {
    return v.applyMatrix4(this.worldMatrix);
  }

  // Transform from world space to local space
  worldToLocal(v: Vector3): Vector3 {
    return v.applyMatrix4(this.worldMatrix.inverse());
  }

  // @ts-ignore
  public getChildByName(name: string): Node<unknown> | null {
    const node = this.children.find((c) => c.name === name);
    return node || null;
  }

  public setPosition(value: Vector3) {
    this.position.copyFrom(value);
    this.updateWorldMatrix(false, true);

    return this;
  }

  public setScale(value: Vector3) {
    this.scale.copyFrom(value);
    this.updateWorldMatrix(false, true);

    return this;
  }

  public setFromEulerRotation(value: Euler) {
    this.rotation.setFromEuler(value);
    this.quaternion.fromEuler(value);
    this.updateWorldMatrix(false, true);

    return this;
  }

  public toNodeSerialized(): NodeSerialized {
    return {
      name: this.name,
      transform: {
        position: this.position.toJSON(),
        rotation: this.rotation.toJSON(),
        scale: this.scale.toJSON()
      }
    };
  }
}
