import { Vector3 } from '@/utils/math/vector3';
import { Color, ColorSerialized } from '../base/color';
import { Light } from '../base/light';
import { NodeSerialized } from '../base/node';
import { Euler } from '@/utils/math/euler';

export interface PointLightProps {
  color: Color;
  intensity: number;
  constant: number;
  linear: number;
  quadratic: number;
}

export interface PointLightSerialized extends NodeSerialized {
  color: ColorSerialized;
  intensity: number;
  constant: number;
  linear: number;
  quadratic: number;
}

export class PointLight extends Light<PointLightSerialized> {
  public constant: number;
  public linear: number;
  public quadratic: number;

  constructor(
    name: string,
    color?: Color,
    intensity?: number,
    position?: Vector3,
    constant?: number,
    linear?: number,
    quadratic?: number,
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

    if (constant) {
      this.constant = constant;
    } else {
      this.constant = 0.07;
    }

    if (linear) {
      this.linear = linear;
    } else {
      this.linear = 0.05;
    }

    if (quadratic) {
      this.quadratic = quadratic;
    } else {
      this.quadratic = 0.03;
    }
  }

  public toJSON(): PointLightSerialized {
    return {
      color: this._color.toJSON(),
      intensity: this._intensity,
      constant: this.constant,
      linear: this.linear,
      quadratic: this.quadratic,
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string) {
    return new PointLight(name);
  }
}
