import { Vector3 } from '@/utils/math/vector3';
import { Color } from './color';
import { Node, NodeSerialized } from './node';
import { Euler } from '@/utils/math/euler';

export interface LightSerialized extends NodeSerialized {
  color: Color;
  intensity: number;
}

export abstract class Light<
  // @ts-ignore
  T extends NodeSerialized = unknown
> extends Node<T> {
  /* Attributes */
  protected _color: Color = new Color(255, 255, 255);
  protected _intensity: number = 1;

  /* CSonstructor */
  constructor(
    name: string,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3,
    color: Color = new Color(255, 255, 255),
    intensity: number = 1
  ) {
    super(name, position, rotation, scale);
    this._color = color;
    this._intensity = intensity;
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
