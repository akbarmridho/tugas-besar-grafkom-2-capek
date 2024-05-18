import { Vector3 } from '@/utils/math/vector3';
import { Color } from './color';
import { Node, NodeSerialized } from './node';
import { Euler } from '@/utils/math/euler';

export abstract class Light<
  // @ts-ignore
  T extends NodeSerialized = unknown
> extends Node<T> {
  /* Attributes */
  protected _color: Color;
  protected _intensity: number;

  /* CSonstructor */
  constructor(
    name: string,
    color?: Color,
    intensity?: number,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(name, position, rotation, scale);

    if (color) {
      this._color = color.clone();
    } else {
      this._color = Color.White();
    }

    if (intensity) {
      this._intensity = intensity;
    } else {
      this._intensity = 1;
    }
  }

  /* Getter */
  get color() {
    return this._color;
  }

  get intensity() {
    return this._intensity;
  }

  set color(color) {
    this._color = color;
  }

  set intensity(intensity) {
    this._intensity = intensity;
  }
}
