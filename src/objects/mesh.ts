import { BufferGeometry } from './buffer-geometry.ts';
import { Serializable } from './serializable.ts';
import { ShaderMaterial } from './shader-material.ts';

export class Mesh extends Serializable {
  geometry: BufferGeometry;
  material: ShaderMaterial;

  constructor(geometry: BufferGeometry, material: ShaderMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
  }

  public toJSON() {
    return {
      geometry: this.geometry.toJSON(),
      material: this.material.toJSON()
    };
  }
}
