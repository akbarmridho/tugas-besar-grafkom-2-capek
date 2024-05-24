import { PModel } from '@/interfaces/parser.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { Texture } from '@/objects/base/texture.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { Mesh } from '@/objects/mesh.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';
import { PyramidGeometry } from '@/objects/geometry/pyramid-geometry';
import { PrismGeometry } from '@/objects/geometry/prism-geometry';

export function spongebobWithTexture(): PModel {
  /**
   * Define scenes
   */
  const { scene } = generateBaseScene('spongebob', Color.Black());

  const material = new PhongMaterial(
    Color.fromHex(0x0f0f0f),
    new Texture({ data: '/textures/cube-diffuse.png' }),
    new Texture({ data: '/textures/cube-specular.png' }),
    8
  );

  const cubeShape = new PrismGeometry([[0.3, 0, 0.1], [0.2, 0, 0], [0.1, 0, 0.1], [0.1, 0, 0.2], [0.2, 0, 0.3],[0.3, 0, 0.2]],0.5);

  const cubeMesh = new Mesh('cube', cubeShape, material);

  scene.addChildren(cubeMesh);

  return serializeScene(scene);
}
