import { Vector3 } from '@/utils/math/vector3';
import { Light } from '../base/light';
import { Node, NodeSerialized } from '../base/node';
import { MeshSerialized } from '../mesh';
import { Euler } from '@/utils/math/euler';
import { Color } from '../base/color';

export interface DirectionalLightProps {
  color: Color;
  intensity: number;
  direction: Vector3;
}

export interface DirectionalLightSerialized extends NodeSerialized {
  color: Color;
  intensity: number;
  direction: Vector3;
}

export class DirectionalLight extends Light<DirectionalLightSerialized> {
  _direction: Vector3;
  _adjustedDirection: Vector3; // direction that has been multiplied with world rotation

  constructor(
    name: string,
    color?: Color,
    direction?: Vector3,
    intensity?: number
  ) {
    super(name, color, intensity);

    if (direction) {
      this._direction = direction.clone();
    } else {
      this._direction = new Vector3(0, -1, 0);
    }

    this._adjustedDirection = this._direction.clone();
  }

  get direction() {
    return this._adjustedDirection;
  }

  get rawDirection() {
    return this._direction;
  }

  set rawDirection(val: Vector3) {
    this._direction.copyFrom(val);
    this.updateWorldMatrix(false, false);
  }

  public toJSON(): DirectionalLightSerialized {
    return {
      color: this._color,
      intensity: this._intensity,
      direction: this._direction,
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string) {
    return new DirectionalLight(name);
  }

  updateWorldMatrix(
    updateParents: boolean = true,
    updateChildren: boolean = true
  ): void {
    super.updateWorldMatrix(updateParents, updateChildren);
    this._adjustedDirection = this._direction
      .clone()
      .applyQuaternion(this.parent!.quaternion);
  }
}
