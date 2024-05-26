import { AnimationClip, AnimationPath } from '@/interfaces/animation';
import { PModel } from '@/interfaces/parser';
import { Color } from '@/objects/base/color';
import { Texture } from '@/objects/base/texture';
import { ObliqueCamera } from '@/objects/camera/oblique-camera';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera';
import { BoxGeometry } from '@/objects/geometry/box-geometry';
import { GlassGeometry } from '@/objects/geometry/glass-geometry';
import { AmbientLight } from '@/objects/light/ambient-light';
import { DirectionalLight } from '@/objects/light/directional-light';
import { PointLight } from '@/objects/light/point-light';
import { BasicMaterial } from '@/objects/material/basic-material';
import { PhongMaterial } from '@/objects/material/phong-material';
import { Mesh } from '@/objects/mesh';
import { serializeScene } from '@/objects/parser/serializer';
import { Scene } from '@/objects/scene';
import { Tweener } from '@/objects/tweener';
import { Vector3 } from '@/utils/math/vector3';
import { Box } from 'lucide-react';

export function tes(): PModel {
  const scene = new Scene('ArticulatedModel', Color.fromHex(0x0f0f0f));
  const orthographicCamera = new OrthographicCamera('orthographic camera');
  const perspectiveCamera = new PerspectiveCamera('perspective camera');
  const obliqueCamera = new ObliqueCamera('Oblique Camera');

  orthographicCamera.setPosition(new Vector3(0, 0, 1));
  perspectiveCamera.setPosition(new Vector3(0, 0, 1));
  obliqueCamera.setPosition(new Vector3(0, 0, 1));

  scene.addChildren(orthographicCamera);
  scene.addChildren(perspectiveCamera);
  scene.addChildren(obliqueCamera);

  // Light
  const ambientLight = new AmbientLight('ambient light', Color.White(), 0.7);
  const directionalLight = new DirectionalLight(
    'sun',
    Color.White(),
    new Vector3(-1, -1, -1),
    0.7
  );
  const pointLight = new PointLight(
    'point light',
    Color.fromHex(0x1f1f1f),
    0.3,
    0,
    new Vector3(0, 1, -1.75)
  );

  // Grass Mesh
  const floorGeometry = new BoxGeometry(3, 0.1, 5);
  const grassMaterial = new PhongMaterial(
    Color.Black(),
    new Texture({ data: '../textures/grass/diffuse.png' }),
    new Texture({ data: '../textures/grass/specula.png' }),
    32,
    {
      normalMap: new Texture({ data: '../textures/grass/normal.png' })
    }
  );
  const grassMesh = new Mesh('grassland', floorGeometry, grassMaterial);
  grassMesh.translateOnY(-0.69);

  // Sheep Body Mesh
  const torsoGeometry = new BoxGeometry(0.5, 0.5, 0.75);
  const torsoMaterial = new PhongMaterial(
    Color.Black(),
    Color.White(),
    Color.White(),
    64
  );
  const torsoMesh = new Mesh('sheep-torso', torsoGeometry, torsoMaterial);
  torsoMesh.translateOnY(-0.2).translateOnZ(-1.75);

  // Sheep Leg Mesh
  const legGeometry = new BoxGeometry(0.2, 0.17, 0.2);
  const legMaterial = new PhongMaterial(
    Color.Black(),
    Color.White(),
    Color.White(),
    64
  );

  const leftFrontLegMesh = new Mesh(
    'sheep-leftfront-leg',
    legGeometry,
    legMaterial
  );
  leftFrontLegMesh.translateOnY(-0.3).translateOnX(0.125).translateOnZ(0.225);

  const rightFrontLegMesh = new Mesh(
    'sheep-rightfront-leg',
    legGeometry,
    legMaterial
  );
  rightFrontLegMesh.translateOnY(-0.3).translateOnX(-0.125).translateOnZ(0.225);

  const rightBackLegMesh = new Mesh(
    'sheep-rightback-leg',
    legGeometry,
    legMaterial
  );
  rightBackLegMesh.translateOnY(-0.3).translateOnX(-0.125).translateOnZ(-0.225);

  const leftBackLegMesh = new Mesh(
    'sheep-leftback-leg',
    legGeometry,
    legMaterial
  );
  leftBackLegMesh.translateOnY(-0.3).translateOnX(0.125).translateOnZ(-0.225);

  // Sheep Foot Mesh
  const footGeometry = new BoxGeometry(0.19, 0.08, 0.19);
  const footMaterial = new PhongMaterial(
    Color.Black(),
    Color.Red(),
    Color.White(),
    64
  );

  const leftFrontFootMesh = new Mesh(
    'sheep-leftfront-foot',
    footGeometry,
    footMaterial
  );
  leftFrontFootMesh.translateOnY(-0.1);

  const rightFrontFootMesh = new Mesh(
    'sheep-rightfront-foot',
    footGeometry,
    footMaterial
  );
  rightFrontFootMesh.translateOnY(-0.1);

  const rightBackFootMesh = new Mesh(
    'sheep-rightback-foot',
    footGeometry,
    footMaterial
  );
  rightBackFootMesh.translateOnY(-0.1);

  const leftBackFootMesh = new Mesh(
    'sheep-leftback-foot',
    footGeometry,
    footMaterial
  );
  leftBackFootMesh.translateOnY(-0.1);

  // Sheep Head Mesh
  const headGeometry = new BoxGeometry(0.3, 0.3, 0.3);
  const headMaterial = new PhongMaterial(
    Color.Black(),
    Color.White(),
    Color.White(),
    64
  );
  const headMesh = new Mesh('sheep-head', headGeometry, headMaterial);
  headMesh.translateOnY(0.2).translateOnZ(0.4);

  const faceGeometry = new BoxGeometry(0.28, 0.28, 0.05);
  const faceMaterial = new PhongMaterial(
    Color.Black(),
    Color.Red(),
    Color.White(),
    64
  );
  const faceMesh = new Mesh('sheep-face', faceGeometry, faceMaterial);
  faceMesh.translateOnZ(0.15);

  const eyeGeometry = new BoxGeometry(0.05, 0.02, 0.001);
  const eyeMaterial = new BasicMaterial(Color.White());
  const leftEyeMesh = new Mesh('sheep-left-eye', eyeGeometry, eyeMaterial);
  leftEyeMesh
    .translateOnX(0.08)
    .translateOnY(0.035)
    .translateOnZ(0.025)
    .scaleOnX(1.8)
    .scaleOnY(1.8);

  const rightEyeMesh = new Mesh('sheep-right-eye', eyeGeometry, eyeMaterial);
  rightEyeMesh
    .translateOnX(-0.08)
    .translateOnY(0.035)
    .translateOnZ(0.025)
    .scaleOnX(1.8)
    .scaleOnY(1.8);

  const pupilGeometry = new BoxGeometry(0.025, 0.02, 0.001);
  const pupilMaterial = new BasicMaterial(Color.Black());
  const leftPupilMesh = new Mesh(
    'sheep-left-pupil',
    pupilGeometry,
    pupilMaterial
  );
  leftPupilMesh.translateOnZ(0.001).translateOnX(-0.01);

  const rightPupilMesh = new Mesh(
    'sheep-right-pupil',
    pupilGeometry,
    pupilMaterial
  );
  rightPupilMesh.translateOnZ(0.001).translateOnX(0.01);

  const mouthGeometry = new BoxGeometry(0.05, 0.05, 0.001);
  const mouthMaterial = new BasicMaterial(Color.White());
  const mouthMesh = new Mesh('sheep-mouth', mouthGeometry, mouthMaterial);
  mouthMesh.translateOnY(-0.08).translateOnZ(0.025).scaleOnX(2).scaleOnY(1.5);

  scene.addChildren(ambientLight);
  scene.addChildren(directionalLight);
  scene.addChildren(pointLight);
  scene.addChildren(grassMesh);

  scene.addChildren(torsoMesh);
  torsoMesh.addChildren(leftFrontLegMesh);
  torsoMesh.addChildren(rightFrontLegMesh);
  torsoMesh.addChildren(rightBackLegMesh);
  torsoMesh.addChildren(leftBackLegMesh);
  leftFrontLegMesh.addChildren(leftFrontFootMesh);
  rightFrontLegMesh.addChildren(rightFrontFootMesh);
  rightBackLegMesh.addChildren(rightBackFootMesh);
  leftBackLegMesh.addChildren(leftBackFootMesh);
  torsoMesh.addChildren(headMesh);
  headMesh.addChildren(faceMesh);
  faceMesh.addChildren(leftEyeMesh);
  faceMesh.addChildren(rightEyeMesh);
  faceMesh.addChildren(mouthMesh);
  leftEyeMesh.addChildren(leftPupilMesh);
  rightEyeMesh.addChildren(rightPupilMesh);

  // Animation
  const frames: AnimationPath[] = [];

  // first 120 frames
  {
    const zStart = -1.75;
    const zEnd = 1.75;
    const dist1 = zEnd - zStart;
    const step1 = dist1 / 120;
    for (let i = 0; i < 120; i++) {
      const result: AnimationPath = {
        children: {
          'sheep-torso': {
            keyframe: {
              translation: [0, -0.2, zStart + step1 * i]
            }
          },
          'point light': {
            keyframe: {
              translation: [0, 1, zStart + step1 * i]
            }
          }
        }
      };

      frames[i] = result;
    }
  }

  {
    const zStart = 0;
    const zEnd = -25;
    const dist1 = zEnd - zStart;
    const step1 = dist1 / 15;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 15; j++) {
        if (i % 2 == 0) {
          frames[i * 15 + j].children!['sheep-torso'].children = {
            'sheep-leftfront-leg': {
              keyframe: {
                translation: [0.125, -0.3, 0.225],
                rotation: [zStart + step1 * j, 0, 0]
              }
            },
            'sheep-rightback-leg': {
              keyframe: {
                translation: [-0.125, -0.3, -0.225],
                rotation: [zStart + step1 * j, 0, 0]
              }
            },
            'sheep-rightfront-leg': {
              keyframe: {
                translation: [-0.125, -0.3, 0.225],
                rotation: [zEnd - step1 * j, 0, 0]
              }
            },
            'sheep-leftback-leg': {
              keyframe: {
                translation: [0.125, -0.3, -0.225],
                rotation: [zEnd - step1 * j, 0, 0]
              }
            }
          };
        } else {
          frames[i * 15 + j].children!['sheep-torso'].children = {
            'sheep-leftfront-leg': {
              keyframe: {
                translation: [0.125, -0.3, 0.225],
                rotation: [zEnd - step1 * j, 0, 0]
              }
            },
            'sheep-rightback-leg': {
              keyframe: {
                translation: [-0.125, -0.3, -0.225],
                rotation: [zEnd - step1 * j, 0, 0]
              }
            },
            'sheep-rightfront-leg': {
              keyframe: {
                translation: [-0.125, -0.3, 0.225],
                rotation: [zStart + step1 * j, 0, 0]
              }
            },
            'sheep-leftback-leg': {
              keyframe: {
                translation: [0.125, -0.3, -0.225],
                rotation: [zStart + step1 * j, 0, 0]
              }
            }
          };
        }
      }
    }
  }

  // next 30 frames
  {
    const zStart = 0;
    const zEnd = -25;
    const dist1 = zEnd - zStart;
    const step1 = dist1 / 15;
    for (let i = 120; i < 150; i++) {
      const result: AnimationPath = {
        children: {
          'sheep-torso': {
            keyframe: {
              translation: [0, -0.2, 1.75]
            }
          },
          'point light': {
            keyframe: {
              translation: [0, 1, 1.75]
            }
          }
        }
      };

      frames[i] = result;
    }
  }

  // next 30 frames
  {
    const zStart = 0;
    const zEnd = 50;
    const dist1 = zEnd - zStart;
    const step1 = dist1 / 30;
    for (let i = 150; i < 180; i++) {
      const result: AnimationPath = {
        children: {
          'sheep-torso': {
            children: {
              'sheep-head': {
                keyframe: {
                  translation: [0, 0.2, 0.4],
                  rotation: [zStart + step1 * (i - 150), 0, 0]
                }
              }
            },
            keyframe: {
              translation: [0, -0.2, 1.75]
            }
          },
          'point light': {
            keyframe: {
              translation: [0, 1, 1.75]
            }
          }
        }
      };

      frames[i] = result;
    }
  }

  // next 30 frames
  {
    const zStart = 0;
    const zEnd = 50;
    const dist1 = zEnd - zStart;
    const step1 = dist1 / 30;
    for (let i = 180; i < 210; i++) {
      const result: AnimationPath = {
        children: {
          'sheep-torso': {
            children: {
              'sheep-head': {
                keyframe: {
                  translation: [0, 0.2, 0.4],
                  rotation: [zEnd - step1 * (i - 180), 0, 0]
                }
              }
            },
            keyframe: {
              translation: [0, -0.2, 1.75]
            }
          },
          'point light': {
            keyframe: {
              translation: [0, 1, 1.75]
            }
          }
        }
      };

      frames[i] = result;
    }
  }

  const clip: AnimationClip = {
    name: 'sheep behaviour',
    frames
  };

  return serializeScene(scene, clip);
}
