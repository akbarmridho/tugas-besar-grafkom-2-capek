import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { Mesh } from '@/objects/mesh.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PModel } from '@/interfaces/parser.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { AnimationClip } from '@/interfaces/animation.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera';
import { ObliqueCamera } from '@/objects/camera/oblique-camera';
import { DirectionalLight } from '@/objects/light/directional-light.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { PyramidGeometry } from '@/objects/geometry/pyramid-geometry';
import { PrismGeometry } from '@/objects/geometry/prism-geometry';

export function test(): PModel {
  /**
   * Define scenes
   */
  const { scene } = generateBaseScene('test', Color.fromHex(0x36a0de));

  /**
   * Define materials
   */
  const canonMaterial = new BasicMaterial(Color.fromHex(0x63716e));
  const ballMaterial = new PhongMaterial(
    Color.Red(),
    Color.White(),
    Color.White(),
    0.5
  );

  const prismShape = new PrismGeometry(
    [
      [0.1, 0, 0],
      [0.3, 0, 0],
      [0.3, 0, 0.5],
      [0.1, 0, 0.5]
    ],
    0.5
  );
  const pyrShape = new PyramidGeometry(0.2, 0.5, 0.5);
  const ballShape = new BoxGeometry(0.1, 0.1, 0.1);

  const canonMesh = new Mesh('canon', prismShape, ballMaterial);

  // canonMesh.rotateOnX(1.57079633 * 4);
  // canonMesh.translateOnZ(0.25);
  canonMesh.scaleOnX(1);
  scene.addChildren(canonMesh);

  const piramida1 = new Mesh(
    'Pyramid1',
    pyrShape,
    ballMaterial,
    new Vector3(0.2, 0.1, 0.5)
  );

  const piramida2 = new Mesh(
    'Pyramid2',
    pyrShape,
    ballMaterial,
    new Vector3(0.2, 0.1, 0.5)
  );

  const piramida3 = new Mesh(
    'Pyramid3',
    pyrShape,
    ballMaterial,
    new Vector3(0.2, 0.1, 0.5)
  );

  const piramida4 = new Mesh(
    'Pyramid4',
    pyrShape,
    ballMaterial,
    new Vector3(0.2, 0.1, 0.5)
  );

  canonMesh.addChildren(piramida1);
  canonMesh.addChildren(piramida2);
  canonMesh.addChildren(piramida3);
  canonMesh.addChildren(piramida4);

  //const leftBallMesh = new Mesh(
  //  'LBall',
  //  ballShape,
  //  canonMaterial,
  //  new Vector3(-0.175, -0.325, 0)
  //);
  //const rightBallMesh = new Mesh(
  //  'RBall',
  //  ballShape,
  //  canonMaterial,
  //  new Vector3(0.3, -0.325, 0)
  //);
  //
  //canonMesh.addChildren(leftBallMesh);
  //canonMesh.addChildren(rightBallMesh);

  const clip: AnimationClip = {
    name: 'flip',
    frames: [
      {
        keyframe: {
          rotation: [0, 0, 0]
          // scale: [1, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [30, 0, 0]
          // scale: [1.1, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [60, 0, 0]
          // scale: [1.2, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [90, 0, 0]
          // scale: [1.3, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [120, 0, 0]
          // scale: [1.4, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [150, 0, 0]
          // scale: [1.5, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [180, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [210, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [240, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [270, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [300, 0, 0]
          // scale: [1.3, 1, 1]
        }
      },
      {
        keyframe: {
          rotation: [330, 0, 0]
          // scale: [1, 1, 1]
        }
      }
    ]
  };

  return serializeScene(scene, clip);
}
