import { Vector3 } from '@/utils/math/vector3';
import { Color } from '../base/color';
import { Light } from '../base/light';
import { NodeSerialized } from '../base/node';
import { Euler } from '@/utils/math/euler';

export interface PointLightProps {
  color: Color;
  intensity: number;
}

export interface PointLightSerialized extends NodeSerialized {
  color: Color;
  intensity: number;
}

export class PointLight extends Light<PointLightSerialized> {
  constructor(
    name: string,
    color?: Color,
    intensity?: number,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(
      name,
      color,
      intensity,
      position ? position : new Vector3(0, 1, 0),
      rotation,
      scale
    );
  }

  public toJSON(): PointLightSerialized {
    return {
      color: this._color,
      intensity: this._intensity,
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string) {
    return new PointLight(name);
  }
}
