import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { Mesh } from '@/objects/mesh.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { OrthographicCamera } from '@/objects/camera/ortographic-camera.ts';
import { PrismGeometry } from '@/objects/geometry/prism-geometry';
import { PyramidGeometry } from '@/objects/geometry/pyramid-geometry';

export function Test() {
  /**
   * Define scenes
   */
  const scene = new Scene('test', Color.fromHex(0x76a0de));

  /**
   * Define materials
   */
  const canonMaterial = new BasicMaterial(Color.fromHex(0x63716e));

  const baseCanonShape = new PrismGeometry([[0.1,0,0], [0.3,0,0], [0.1,0,0.5], [0.3,0,0.5], [0.2,0,1]], 0.75);
  const ballShape = new BoxGeometry(0.1, 0.1, 0.1);

  const canonMesh = new Mesh('canon', baseCanonShape, canonMaterial);


  //canonMesh.rotateOnX(1.57079633);
  // canonMesh.rotateOnX(1.57079633 * 4);
  // canonMesh.translateOnZ(0.25);
  scene.addChildren(canonMesh);

  // const leftBallMesh = new Mesh(
  //   'LBall',
  //   ballShape,
  //   canonMaterial,
  //   new Vector3(-0.175, -0.325, 0)
  // );
  // const rightBallMesh = new Mesh(
  //   'RBall',
  //   ballShape,
  //   canonMaterial,
  //   new Vector3(0.175, -0.325, 0)
  // );
  //
  // canonMesh.addChildren(leftBallMesh);
  // canonMesh.addChildren(rightBallMesh);

  const mainCamera = new OrthographicCamera('orthographic camera');

  scene.addChildren(mainCamera);

  return serializeScene(scene);
}
