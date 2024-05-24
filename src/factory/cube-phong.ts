import { PModel } from '@/interfaces/parser.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { Texture } from '@/objects/base/texture.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { Mesh } from '@/objects/mesh.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';

export function phongCubeWithTexture(): PModel {
  /**
   * Define scenes
   */
  const { scene } = generateBaseScene('neo-amstrong', Color.Black());

  const material = new PhongMaterial(
    Color.fromHex(0x0f0f0f),
    new Texture({ data: '/textures/cube-diffuse-512.png' }),
    new Texture({ data: '/textures/cube-specular-512.png' }),
    8
  );

  const cubeShape = new BoxGeometry(0.5, 0.5, 0.5);

  const cubeMesh = new Mesh('cube', cubeShape, material);

  scene.addChildren(cubeMesh);

  return serializeScene(scene);
}
