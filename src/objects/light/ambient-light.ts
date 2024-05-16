import { Vector3 } from '@/utils/math/vector3';
import { Light, LightSerialized } from '../base/light';
import { Euler } from '@/utils/math/euler';
import { Color } from '../base/color';

export interface AmbientLightSerialized extends LightSerialized {}

export class AmbientLight extends Light<AmbientLightSerialized> {
  constructor(
    name: string,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3,
    color: Color = new Color(255, 255, 255),
    intensity: number = 1
  ) {
    super(name, position, rotation, scale, color, intensity);
    this.position.setComponents(0, 1, 0);
    this.updateWorldMatrix();
  }

  public toJSON(): AmbientLightSerialized {
    return {
      color: this._color,
      intensity: this.intensity,
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string) {
    return new AmbientLight(name);
  }
}
