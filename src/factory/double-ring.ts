import { PModel } from '@/interfaces/parser.ts';
import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';
import { ObliqueCamera } from '@/objects/camera/oblique-camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { AmbientLight } from '@/objects/light/ambient-light.ts';
import { DirectionalLight } from '@/objects/light/directional-light.ts';
import { DoubleRingGeometry } from '@/objects/geometry/double-ring-geometry.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { Mesh } from '@/objects/mesh.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';

export const doubleRing = (): PModel => {
  const scene = new Scene('double-ring', Color.Black());

  const orthographicCamera = new OrthographicCamera('orthographic camera');
  const perspectiveCamera = new PerspectiveCamera('perspective camera');
  const obliqueCamera = new ObliqueCamera('Oblique Camera');

  orthographicCamera.setPosition(new Vector3(0, 0, 1));
  perspectiveCamera.setPosition(new Vector3(0, 0, 1));
  obliqueCamera.setPosition(new Vector3(0, 0, 1));

  scene.addChildren(orthographicCamera);
  scene.addChildren(perspectiveCamera);
  scene.addChildren(obliqueCamera);

  const ambientLight = new AmbientLight('ambient', undefined, 0.5);

  scene.addChildren(ambientLight);

  const directionalLight = new DirectionalLight(
    'sun',
    Color.White(),
    new Vector3(-1, -1, -1),
    1
  );

  scene.addChildren(directionalLight);

  const geometry = new DoubleRingGeometry();
  const material = new BasicMaterial(Color.Blue());

  const mesh = new Mesh('double-ring', geometry, material);

  scene.addChildren(mesh);

  return serializeScene(scene);
};
