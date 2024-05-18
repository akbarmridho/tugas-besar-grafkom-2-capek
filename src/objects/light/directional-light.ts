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

  constructor(
    name: string,
    color?: Color,
    direction?: Vector3,
    intensity?: number,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(name, color, intensity, position, rotation, scale);

    if (direction) {
      this._direction = direction.clone();
    } else {
      this._direction = new Vector3(0, -1, 0);
    }
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
}
