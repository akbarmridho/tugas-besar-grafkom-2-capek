import { Vector3 } from '@/utils/math/vector3';
import { Light } from '../base/light';
import { Euler } from '@/utils/math/euler';
import { Color } from '../base/color';
import { NodeSerialized } from '../base/node';

export interface AmbientLightProps {
  color: Color;
  intensity: number;
}

export interface AmbientLightSerialized extends NodeSerialized {
  color: Color;
  intensity: number;
}

export class AmbientLight extends Light<AmbientLightSerialized> {
  constructor(name: string, color?: Color, intensity?: number) {
    super(name, color, intensity);
  }

  public toJSON(): AmbientLightSerialized {
    return {
      color: this._color,
      intensity: this._intensity,
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string) {
    return new AmbientLight(name);
  }
}
