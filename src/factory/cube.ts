import { PModel } from '@/interfaces/parser.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { Texture } from '@/objects/base/texture.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { Mesh } from '@/objects/mesh.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';

export function basicCubeWithTexture(): PModel {
  /**
   * Define scenes
   */
  const { scene } = generateBaseScene('neo-amstrong');

  const material = new BasicMaterial(
    null,
    new Texture({ data: '/textures/f.png' })
  );

  const cubeShape = new BoxGeometry(0.5, 0.5, 0.5);

  const cubeMesh = new Mesh('cube', cubeShape, material);

  scene.addChildren(cubeMesh);

  return serializeScene(scene);
}
