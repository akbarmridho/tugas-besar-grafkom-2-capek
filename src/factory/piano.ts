import { Scene } from '@/objects/scene.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '@/objects/camera/perspective-camera.ts';
import { ObliqueCamera } from '@/objects/camera/oblique-camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { AmbientLight } from '@/objects/light/ambient-light.ts';
import { DirectionalLight } from '@/objects/light/directional-light.ts';
import { Color } from '@/objects/base/color.ts';
import { PModel } from '@/interfaces/parser.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { CylinderGeometry } from '@/objects/geometry/cylinder-geometry.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Mesh } from '@/objects/mesh.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { PointLight } from '@/objects/light/point-light.ts';
import { AnimationClip, AnimationPath } from '@/interfaces/animation.ts';
import { Tweener } from '@/objects/tweener.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';

export function piano(): PModel {
  const scene = new Scene('piano-scene', Color.fromHex(0x141717));
  const orthographicCamera = new OrthographicCamera('orthographic camera');
  const perspectiveCamera = new PerspectiveCamera('perspective camera');
  const obliqueCamera = new ObliqueCamera('oblique camera');
  orthographicCamera.setPosition(new Vector3(0, 5, 5));
  perspectiveCamera.setPosition(new Vector3(0, 5, 5));
  obliqueCamera.setPosition(new Vector3(0, 5, 5));
  scene.addChildren(orthographicCamera);
  scene.addChildren(perspectiveCamera);
  scene.addChildren(obliqueCamera);

  const ambientLight = new AmbientLight('ambient', Color.White(), 0.5);
  scene.addChildren(ambientLight);
  const directionalLight = new DirectionalLight(
    'directional',
    Color.White(),
    new Vector3(-1, -1, -1),
    0.5
  );
  scene.addChildren(directionalLight);

  // piano body
  const pianoBodyGeometry = new BoxGeometry(17, 1, 3);
  const pianoBodyMaterial = PhongMaterial.fromTextureOption(
    {
      name: 'metal',
      diffuse: '/textures/metal/diffuse.png',
      displacement: '/textures/metal/displacement.png',
      normal: '/textures/metal/normal.png',
      specular: '/textures/metal/specular.png'
    },
    Color.Black(),
    24,
    0.01,
    -0.01
  );

  const pianoBodyMesh = new Mesh(
    'piano-body',
    pianoBodyGeometry,
    pianoBodyMaterial,
    new Vector3(0, 0.5, 0)
  );

  scene.addChildren(pianoBodyMesh);

  // piano legs
  const legGeometry = new CylinderGeometry(0.1, 0.1, 1);
  const legMaterial = PhongMaterial.fromTextureOption(
    {
      name: 'metal-plate',
      diffuse: '/textures/metal-plate/diffuse.png',
      displacement: '/textures/metal-plate/displacement.png',
      normal: '/textures/metal-plate/normal.png',
      specular: '/textures/metal-plate/specular.png'
    },
    Color.Black(),
    24,
    0.01,
    -0.01
  );

  const legPositions = [
    new Vector3(-2.2, -0.5, 1.2),
    new Vector3(2.2, -0.5, 1.2),
    new Vector3(-2.2, -0.5, -1.2),
    new Vector3(2.2, -0.5, -1.2)
  ];

  legPositions.forEach((position, index) => {
    const legMesh = new Mesh(`leg-${index}`, legGeometry, legMaterial, position);
    pianoBodyMesh.addChildren(legMesh);
  });

  // piano keys
  const keyWidth = 0.3;
  const keyHeight = 0.1;
  const keyDepth = 1;
  const whiteKeyMaterial = new PhongMaterial(Color.White(), Color.White(), Color.fromHex(0x808080), 24);
  const blackKeyMaterial = new PhongMaterial(Color.Black(), Color.Black(), Color.fromHex(0x808080), 24);

  for (let i = 0; i < 52; i++) {
    const keyPosition = new Vector3(-7.8 + i * keyWidth, 0.6, 1.2);
    const keyGeometry = new BoxGeometry(keyWidth, keyHeight, keyDepth);
    const keyMesh = new Mesh(`white-key-${i}`, keyGeometry, whiteKeyMaterial, keyPosition);
    pianoBodyMesh.addChildren(keyMesh);
  }

  const blackKeyOffsets = [0, 1, 3, 4, 5];
  for (let i = 0; i < 36; i++) {
    const octave = Math.floor(i / 5);
    const positionInOctave = i % 5;
    const keyPosition = new Vector3(
      -7.65 + (octave * 7 + blackKeyOffsets[positionInOctave]) * keyWidth,
      0.65,
      0.8
    );
    const keyGeometry = new BoxGeometry(keyWidth * 0.6, keyHeight * 1.5, keyDepth * 0.6);
    const keyMesh = new Mesh(`black-key-${i}`, keyGeometry, blackKeyMaterial, keyPosition);
    pianoBodyMesh.addChildren(keyMesh);
  }

  // setup point lights
  const p1Material = new BasicMaterial(Color.fromHex(0xf23542));
  const p1Geometry = new BoxGeometry(0.1, 0.1, 0.1);
  const p1Mesh = new Mesh('p1', p1Geometry, p1Material, new Vector3(2, 2, 2));
  const p1Light = new PointLight(
    'p1',
    Color.fromHex(0xf23542),
    1,
    0,
    new Vector3(2, 2, 2)
  );

  scene.addChildren(p1Mesh);
  scene.addChildren(p1Light);

  const p2Material = new BasicMaterial(Color.fromHex(0x7b47f5));
  const p2Geometry = new BoxGeometry(0.1, 0.1, 0.1);
  const p2Mesh = new Mesh('p2', p2Geometry, p2Material, new Vector3(-2, 2, -2));
  const p2Light = new PointLight(
    'p2',
    Color.fromHex(0x7b47f5),
    1,
    0,
    new Vector3(-2, 2, -2)
  );

  scene.addChildren(p2Mesh);
  scene.addChildren(p2Light);

  const p3Material = new BasicMaterial(Color.fromHex(0xffffff));
  const p3Geometry = new BoxGeometry(0.1, 0.1, 0.1);
  const p3Mesh = new Mesh('p3', p3Geometry, p3Material, new Vector3(0, 2, 0));
  const p3Light = new PointLight(
    'p3',
    Color.fromHex(0xffffff),
    1,
    0,
    new Vector3(0, 2, 0)
  );

  scene.addChildren(p3Mesh);
  scene.addChildren(p3Light);

   // Animation for piano legs
   const generateLegsAnimation = (): AnimationClip => {
    const frames: AnimationPath[] = [];

    // Define the animation path for each leg
    const legMeshes: Mesh[] = []; // Declare the legMeshes variable

    // Declare and assign the value for pianoLeg1Mesh
    const pianoLeg1Mesh = new Mesh('piano-leg-1', legGeometry, legMaterial, new Vector3(-7.8, 0.3, 1.2));
    const pianoLeg2Mesh = new Mesh('piano-leg-2', legGeometry, legMaterial, new Vector3(-7.8, 0.3, 1.2));
    const pianoLeg3Mesh = new Mesh('piano-leg-3', legGeometry, legMaterial, new Vector3(-7.8, 0.3, 1.2));
    const pianoLeg4Mesh = new Mesh('piano-leg-4', legGeometry, legMaterial, new Vector3(-7.8, 0.3, 1.2));
    
    // Add the legMeshes to the array
    legMeshes.push(pianoLeg1Mesh);
    legMeshes.push(pianoLeg2Mesh);
    legMeshes.push(pianoLeg3Mesh);
    legMeshes.push(pianoLeg4Mesh);

    legMeshes.forEach((legMesh, index) => {
    const startRotation = legMesh.rotation.y; // Initial rotation of the leg

      // Define rotation keyframes for a complete revolution (360 degrees)
      for (let i = 0; i < 360; i++) {
        const rotationY = startRotation + degreeToRadian(i); // Rotate the leg gradually

        const result: AnimationPath = {
          children: {
            [`leg-${index}`]: {
              keyframe: {
                rotation: [0, rotationY, 0] // Only rotate around the Y-axis
              }
            }
          }
        };

        frames.push(result);
      }
    });

    return {
      name: 'legs-animation-clip',
      frames
    };
  };

  const legsAnimationClip = generateLegsAnimation();


  return serializeScene(scene);
}
