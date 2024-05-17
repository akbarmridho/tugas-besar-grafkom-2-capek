import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { Mesh } from '@/objects/mesh.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { OrthographicCamera } from '@/objects/camera/ortographic-camera.ts';
import { PModel } from '@/interfaces/parser.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { AnimationClip } from '@/interfaces/animation.ts';

export function neoArmstrongCycloneJetArmstrongCannon(): PModel {
  /**
   * Define scenes
   */
  const scene = new Scene('neo-amstrong', Color.fromHex(0x36a0de));

  /**
   * Define materials
   */
  const canonMaterial = new BasicMaterial(Color.fromHex(0x63716e));

  const baseCanonShape = new BoxGeometry(0.25, 0.75, 0.25);
  const ballShape = new BoxGeometry(0.1, 0.1, 0.1);

  const canonMesh = new Mesh('canon', baseCanonShape, canonMaterial);

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
    new Vector3(0.175, -0.325, 0)
  );

  canonMesh.addChildren(leftBallMesh);
  canonMesh.addChildren(rightBallMesh);

  const mainCamera = new OrthographicCamera('orthographic camera');

  scene.addChildren(mainCamera);

  const clip: AnimationClip = {
    name: 'flip',
    frames: [
      {
        keyframe: {
          rotation: [0, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [30, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [60, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [90, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [120, 0, 0]
        }
      },
      {
        keyframe: {
          rotation: [150, 0, 0]
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
        }
      },
      {
        keyframe: {
          rotation: [330, 0, 0]
        }
      }
    ]
  };

  return serializeScene(scene, clip);
}
