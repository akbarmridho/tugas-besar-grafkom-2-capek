import { Euler } from '../utils/math/euler.ts';
import { Matrix4 } from '../utils/math/matrix4.ts';
import { Quaternion } from '../utils/math/quaternion.ts';
import { Transformation } from '../utils/math/transformation.ts';
import { Vector3 } from '../utils/math/vector3.ts';
import { Serializable } from './serializable.ts';

export class Node {
  /* Attribute */
  // Transform attributes
  private _position: Vector3 = new Vector3();
  private _rotation: Euler = new Euler();
  private _quaternion: Quaternion = new Quaternion();
  private _scale: Vector3 = new Vector3(1, 1, 1);

  // Matrices
  private _localMatrix: Matrix4 = Matrix4.identity();
  private _worldMatrix: Matrix4 = Matrix4.identity();

  // Relation to other nodes
  private _parent: Node|null = null;
  private _children: Node[] = [];

  // Other
  visible: boolean = true;

  /* Constructor */
  // Initialize Node object
  constructor() {}

  /* Getter */
  get position(): Vector3 {return this._position;}
  get rotation(): Euler {return this._rotation;}
  get quaternion(): Quaternion {return this._quaternion;}
  get scale(): Vector3 {return this._scale;}
  get localMatrix(): Matrix4 {return this._localMatrix;}
  get worldMatrix(): Matrix4 {return this._worldMatrix;}
  get parent(): Node|null {return this._parent;}
  get children(): Node[] {return this._children;}

  /* Manage Relation With Other Nodes */
  // Set parent for this node
  set parent(parent: Node|null) {
    if (this._parent !== parent) {
      this._parent = parent;
    }
  }

  // Add a new children for this node
  // If the children already have parent, replace parent with this node
  addChildren(node: Node): Node {
    node.removeFromParent();
    node.parent = this;
    this._children.push(node);

    return this;
  }

  // Remove a children and set that children parent to null
  removeChildren(node: Node): Node {
    const indexToRemove = this._children.indexOf(node);

    if (indexToRemove !== -1) {
      node.parent = null;
      this._children.splice(indexToRemove, 1);
    }

    return this;
  }

  // Remove this node from its parent
  removeFromParent(): Node {
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

    this._localMatrix = Transformation.translation(position.getComponent(0), position.getComponent(1), position.getComponent(2))
                    .multiplyMatrix(Transformation.zRotation(rotation.z)
                    .multiplyMatrix(Transformation.yRotation(rotation.y)
                    .multiplyMatrix(Transformation.xRotation(rotation.x)
                    .multiplyMatrix(Transformation.scaling(scale.getComponent(0), scale.getComponent(1), scale.getComponent(2))))));
  }

  // Update the matrix of all node 
  updateWorldMatrix(updateParents: boolean = true, updateChildren: boolean = true): void {
    if (updateParents && this._parent !== null) {
      this._parent.updateWorldMatrix(true, false);
    }

    this.updateLocalMatrix();

    if (this._parent !== null) {
      this._worldMatrix = this._parent.worldMatrix.multiplyMatrix(this._localMatrix);
    }
    else {
      this._worldMatrix = this._localMatrix.copy();
    }

    if (updateChildren) {
      for (let i = 0; i < this._children.length; i++) {
        this._children[i].updateWorldMatrix(false, true);
      }
    }
  }

  /* Node Rotation */
  applyQuaternion(q: Quaternion): Node {
    this._quaternion = q.multiply(this._quaternion);
    return this;
  }

  setRotationFromAxisAngle(axis: Vector3, angle: number) {
    this._quaternion = Quaternion.fromAxisAngle(axis, angle);
  }

  setRotationFromRotationMatrix(m: Matrix4) {
    this._quaternion = Quaternion.fromRotationMatrix(m);
  }

  setRotationFromQuaternion(q: Quaternion) {
    this._quaternion = new Quaternion(q.elements[0], q.elements[1], q.elements[2], q.elements[3]);
  }

  rotateOnWorldAxis(axis: Vector3, angle: number): Node {
    const q: Quaternion = Quaternion.fromAxisAngle(axis, angle);
    this.applyQuaternion(q);

    return this;
  }

  rotateOnAxis(axis: Vector3, angle: number): Node {
    const q: Quaternion = Quaternion.fromAxisAngle(axis, angle);
    this._quaternion = this._quaternion.multiply(q);

    return this;
  }

  rotateOnX(angle: number): Node {
    return this.rotateOnAxis(new Vector3(1, 0, 0), angle);
  }

  rotateOnY(angle: number): Node {
    return this.rotateOnAxis(new Vector3(0, 1, 0), angle);
  }

  rotateOnZ(angle: number): Node {
    return this.rotateOnAxis(new Vector3(0, 0, 1), angle);
  }

  /* Node Translation */
  translateOnAxis(axis: Vector3, distance: number): Node {
    const v: Vector3 = (new Vector3()).copyFrom(axis).applyQuaternion(this.quaternion);
    this.position.addVector(v.multiplyScalar(distance));
    
    return this;
  }

  translateOnX(distance: number): Node {
    return this.translateOnAxis(new Vector3(1, 0, 0), distance);
  }

  translateOnY(distance: number): Node {
    return this.translateOnAxis(new Vector3(0, 1, 0), distance);
  }

  translateOnZ(distance: number): Node {
    return this.translateOnAxis(new Vector3(0, 0, 1), distance);
  }

  /* Additional Method */
  // Transform from local space to world space
  localToWorld(v: Vector3): Vector3 {
    this.updateWorldMatrix(true, false);
    return v.applyMatrix4(this.worldMatrix);
  }

  // Transform from world space to local space
  worldToLocal(v: Vector3): Vector3 {
    this.updateWorldMatrix(true, false);
    return v.applyMatrix4(this.worldMatrix.inverse());
  }
  
}
