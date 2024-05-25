import { PModel } from '@/interfaces/parser.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { Mesh } from '@/objects/mesh.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { SphereGeometry } from '@/objects/geometry/sphere-geometry.ts';
import { Scene } from '@/objects/scene.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';
import { ObliqueCamera } from '@/objects/camera/oblique-camera.ts';
import { AmbientLight } from '@/objects/light/ambient-light.ts';
import { DirectionalLight } from '@/objects/light/directional-light.ts';
import { PointLight } from '@/objects/light/point-light.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { AnimationClip, AnimationPath } from '@/interfaces/animation.ts';
import { Spherical } from '@/utils/math/spherical.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';
import { Texture } from '@/objects/base/texture.ts';

export function lightTest(): PModel {
  const rootName = 'light-test';
  const scene = new Scene(rootName, Color.Black());

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

  const pointLightRadius = 1;

  const pointLight = new PointLight(
    'p1',
    Color.fromHex(0x16b516),
    0.5,
    new Vector3(0, 0, -pointLightRadius)
  );

  scene.addChildren(pointLight);

  const pointLightMaterial = new BasicMaterial(Color.fromHex(0x16b516));
  const pointLightShape = new BoxGeometry(0.025, 0.025, 0.025);

  const pointLightMesh = new Mesh(
    'p1',
    pointLightShape,
    pointLightMaterial,
    new Vector3(0, 0, -pointLightRadius)
  );

  scene.addChildren(pointLightMesh);

  const pointLightTwo = new PointLight(
    'p2',
    Color.fromHex(0x735ed1),
    0.5,
    new Vector3(0, 0, pointLightRadius)
  );

  scene.addChildren(pointLightTwo);

  const pointLightTwoMaterial = new BasicMaterial(Color.fromHex(0x735ed1));
  const pointLightTwoShape = new BoxGeometry(0.025, 0.025, 0.025);

  const pointLightTwoMesh = new Mesh(
    'p2',
    pointLightTwoShape,
    pointLightTwoMaterial,
    new Vector3(0, 0, pointLightRadius)
  );

  scene.addChildren(pointLightTwoMesh);

  const diffuseMap = new Texture({ data: '/textures/wood.png' });
  const specularMap = new Texture({ data: '/textures/wood-specular.png' });

  const floorMaterial = new PhongMaterial(
    Color.Black(),
    diffuseMap,
    specularMap,
    16
  );

  const floorGeometry = new BoxGeometry(4, 0.1, 4);

  const planeMesh = new Mesh(
    'floor',
    floorGeometry,
    floorMaterial,
    new Vector3(0, -0.25, 0)
  );

  const sphereMaterial = new PhongMaterial(
    Color.Black(),
    new Texture({ data: '/textures/metal.png' }),
    new Texture({ data: '/textures/metal-specular.png' }),
    8
  );

  const sphere = new SphereGeometry(0.1);

  const sphereMesh = new Mesh('sphere', sphere, sphereMaterial);

  scene.addChildren(planeMesh);
  scene.addChildren(sphereMesh);

  const frames: AnimationPath[] = [];
  const spherical = new Spherical(pointLightRadius);
  const posResult = new Vector3();
  spherical.setFromCartesianCoordinates(0, 0, -pointLightRadius);

  const sphericalTwo = new Spherical(pointLightRadius);
  const posResultTwo = new Vector3();
  sphericalTwo.setFromCartesianCoordinates(0, 0, pointLightRadius);

  for (let i = 0; i < 360; i++) {
    posResult.setFromSpherical(spherical);
    posResultTwo.setFromSpherical(sphericalTwo);
    frames.push({
      children: {
        p1: {
          keyframe: {
            translation: [posResult.x, posResult.y, posResult.z]
          }
        },
        p2: {
          keyframe: {
            translation: [posResultTwo.x, posResultTwo.y, posResultTwo.z]
          }
        }
      }
    });
    spherical.theta += degreeToRadian(1);
    sphericalTwo.theta += degreeToRadian(1);
  }

  const clip: AnimationClip = {
    name: 'point orbit',
    frames
  };

  return serializeScene(scene, clip);
}
