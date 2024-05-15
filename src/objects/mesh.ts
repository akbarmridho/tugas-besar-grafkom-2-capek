import { BufferGeometry } from './base/buffer-geometry.ts';
import { ShaderMaterial } from './base/shader-material.ts';
import { Node, NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';

export interface MeshSerialized extends NodeSerialized {
  geometry: unknown;
  material: unknown;
}

export class Mesh extends Node<MeshSerialized> {
  // @ts-ignore
  geometry: BufferGeometry<unknown>;
  material: ShaderMaterial<unknown>;

  constructor(
    name: string,
    // @ts-ignore
    geometry: BufferGeometry<unknown>,
    material: ShaderMaterial<unknown>,
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(name, position, rotation, scale);
    this.geometry = geometry;
    this.material = material;
  }

  public toJSON() {
    return {
      geometry: this.geometry.toJSON(),
      material: this.material.toJSON(),
      ...super.toNodeSerialized()
    };
  }
}
