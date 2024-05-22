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

export function neoArmstrongCycloneJetArmstrongCannon(): PModel {
  /**
   * Define scenes
   */
  const scene = generateBaseScene('neo-amstrong', Color.fromHex(0x36a0de));

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

  const baseCanonShape = new BoxGeometry(0.25, 0.75, 0.25);
  const ballShape = new BoxGeometry(0.1, 0.1, 0.1);

  const canonMesh = new Mesh('canon', baseCanonShape, ballMaterial);

  // canonMesh.rotateOnX(1.57079633 * 4);
  // canonMesh.translateOnZ(0.25);
  canonMesh.scaleOnX(2);
  scene.addChildren(canonMesh);

  const leftBallMesh = new Mesh(
    'LBall',
    ballShape,
    canonMaterial,
    new Vector3(-0.175, -0.325, 0)
  );
  const rightBallMesh = new Mesh(
    'RBall',
    ballShape,
    canonMaterial,
    new Vector3(0.3, -0.325, 0)
  );

  canonMesh.addChildren(leftBallMesh);
  canonMesh.addChildren(rightBallMesh);

  const directionalLight = new DirectionalLight('sun');

  scene.addChildren(directionalLight);

  const clip: AnimationClip = {
    name: 'flip',
    rootName: 'canon',
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
