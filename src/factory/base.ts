import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';
import { ObliqueCamera } from '@/objects/camera/oblique-camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { AmbientLight } from '@/objects/light/ambient-light.ts';
import { DirectionalLight } from '@/objects/light/directional-light.ts';
import { PointLight } from '@/objects/light/point-light.ts';

export function generateBaseScene(name: string, color: Color = Color.White()) {
  /**
   * Define scenes
   */
  const scene = new Scene(name, color);

  const orthographicCamera = new OrthographicCamera('orthographic camera');
  const perspectiveCamera = new PerspectiveCamera('perspective camera');
  const obliqueCamera = new ObliqueCamera('Oblique Camera');

  orthographicCamera.setPosition(new Vector3(0, 0, 1));
  perspectiveCamera.setPosition(new Vector3(0, 0, 1));
  obliqueCamera.setPosition(new Vector3(0, 0, 1));

  scene.addChildren(orthographicCamera);
  scene.addChildren(perspectiveCamera);
  scene.addChildren(obliqueCamera);

  const ambientLight = new AmbientLight('ambient', undefined, 0.25);

  // scene.addChildren(ambientLight);

  const directionalLight = new DirectionalLight(
    'sun',
    Color.White(),
    new Vector3(-1, -1, -1),
    1
  );

  scene.addChildren(directionalLight);

  const pointLight = new PointLight(
    'whatever',
    Color.Red(),
    1,
    new Vector3(0, 0, 1)
  );

  // scene.addChildren(pointLight);

  return { scene, ambientLight, directionalLight };
}
