import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';
import { ObliqueCamera } from '@/objects/camera/oblique-camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';

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

  return scene;
}
