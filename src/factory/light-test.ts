import { PModel } from '@/interfaces/parser.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { Mesh } from '@/objects/mesh.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';

export function lightTest(): PModel {
  const { scene } = generateBaseScene('light-test');

  const material = new PhongMaterial(
    Color.fromHex(0x7a4606),
    // Color.Black(),
    Color.fromHex(0xdb9032),
    // Color.Blue(),
    Color.Blue(),
    1
  );

  const box = new BoxGeometry(4, 0.1, 4);

  const planeMesh = new Mesh('floor', box, material, new Vector3(0, -0.25, 0));

  scene.addChildren(planeMesh);

  return serializeScene(scene);
}
