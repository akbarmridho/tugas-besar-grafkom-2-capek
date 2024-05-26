import { PModel } from '@/interfaces/parser.ts';
import { generateBaseScene } from '@/factory/base.ts';
import { Texture } from '@/objects/base/texture.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { Mesh } from '@/objects/mesh.ts';
import { serializeScene } from '@/objects/parser/serializer.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Color } from '@/objects/base/color.ts';
import { PyramidGeometry } from '@/objects/geometry/pyramid-geometry';
import { PrismGeometry } from '@/objects/geometry/prism-geometry';
import { CylinderGeometry } from '@/objects/geometry/cylinder-geometry';
import { BasicMaterial } from '@/objects/material/basic-material';
import { Vector3 } from '@/utils/math/vector3';
import { Euler } from '@/utils/math/euler';

export function spongebobWithTexture(): PModel {
  /**
   * Define scenes
   */
  const { scene } = generateBaseScene('spongebob', new Color(76, 76, 76));

  const material = new PhongMaterial(
    Color.fromHex(0x0f0f0f),
    new Texture({ data: '/textures/spongebob.png' }),
    new Texture({ data: '/textures/solid_yellow.png' }),
    8
  );

  const cubeShape = new BoxGeometry(2, 2, 0.5);

  const cubeMesh = new Mesh('cube', cubeShape, material);
  const sleeveShape = new CylinderGeometry(0.2, 0.1, 0.4, 1000);
  const armShape = new CylinderGeometry(0.06, 0.06, 0.7, 1000);
  const fingerShape = new CylinderGeometry(0.03, 0.03, 0.2, 1000);
  const upperPantsShape = new BoxGeometry(2, 0.25, 0.5);
  const lowerPantsShape = new BoxGeometry(2, 0.4, 0.5);
  const legConnectorShape = new CylinderGeometry(0.18, 0.2, 0.2, 1000);
  const feetShape = new CylinderGeometry(0.06, 0.06, 0.3, 1000);
  const sockLongShape = new CylinderGeometry(0.06, 0.06, 0.2, 1000);
  const sockShortShape = new CylinderGeometry(0.06, 0.06, 0.1, 1000);
  const sockShorterShape = new CylinderGeometry(0.06, 0.06, 0.05, 1000);
  const shoesShape = new CylinderGeometry(0.2, 0.2, 0.5, 1000);
  const hatShape = new PyramidGeometry(3, 1, 2);
  
  const sleeveMaterial = new BasicMaterial(Color.fromHex(0xffffff));

  const ballMaterial = new PhongMaterial(
    Color.White(),
    Color.White(),
    Color.White(),
    0.5
  );

  const limbMaterial = new PhongMaterial(
    new Color(255, 255, 0),
    new Color(255, 255, 0),
    new Color(255, 255, 0),
    0.5
  );

  const pantsMaterial = new PhongMaterial(
    new Color(116, 71, 0),
    new Color(116, 71, 0),
    new Color(116, 71, 0),
    10
  );

  const sockBlueMaterial = new PhongMaterial(
    new Color(0, 0, 255),
    new Color(0, 0, 255),
    new Color(0, 0, 255),
    10
  );

  const sockRedMaterial = new PhongMaterial(
    new Color(255, 0, 0),
    new Color(255, 0, 0),
    new Color(255, 0, 0),
    10
  );

  const blackMaterial = new PhongMaterial(
    new Color(0, 0, 0),
    new Color(0, 0, 0),
    new Color(0, 0, 0),
    10
  );

  scene.addChildren(cubeMesh);

  const rightSleeve = new Mesh(
    'RSleeve',
    sleeveShape,
    ballMaterial,
    new Vector3(-1.14, -0.7, 0),
    new Euler(0, 0, 90) 
  );

  const leftSleeve = new Mesh(
    'LSleeve',
    sleeveShape,
    ballMaterial,
    new Vector3(1.14, -0.7, 0),
    new Euler(0, 0, -90)
  );

  cubeMesh.addChildren(leftSleeve);
  cubeMesh.addChildren(rightSleeve);

  const leftArm = new Mesh(
    'LArm',
    armShape,
    limbMaterial,
    new Vector3(0, 0.3, 0),
    new Euler(0, 0, 135)
  );

  const rightArm = new Mesh(
    'RArm',
    armShape,
    limbMaterial,
    new Vector3(0, 0.3, 0),
    new Euler(0, 0, 135.2)
  );
  //canonMesh.addChildren(rightBallMesh);
  leftSleeve.addChildren(leftArm);
  rightSleeve.addChildren(rightArm);

  const leftFingerOne = new Mesh(
    'LF1',
    fingerShape,
    limbMaterial,
    new Vector3(0.1, -0.32 ,0),
    new Euler(0, 0, 0.5  * Math.PI)
  );

  const leftFingerTwo = new Mesh(
    'LF2',
    fingerShape,
    limbMaterial,
    new Vector3(0.08, -0.42, 0),
    new Euler(0, 0, (1/6) * Math.PI)
  );

  const leftFingerThree = new Mesh(
    'LF3',
    fingerShape,
    limbMaterial,
    new Vector3(-0.04, -0.42, 0),
    new Euler(0, 0, (16/18) * Math.PI)
  );

  const leftFingerFour = new Mesh(
    'LF4',
    fingerShape,
    limbMaterial,
    new Vector3(-0.1, -0.32 ,0),
    new Euler(0, 0, 0.5  * Math.PI)
  );

  const rightFingerOne = new Mesh(
    'RF1',
    fingerShape,
    limbMaterial,
    new Vector3(-0.1, -0.32 ,0),
    new Euler(0, 0, 0.5  * Math.PI)
  );

  const rightFingerTwo = new Mesh(
    'RF2',
    fingerShape,
    limbMaterial,
    new Vector3(0.08, -0.42, 0),
    new Euler(0, 0, (1/6) * Math.PI)
  );

  const rightFingerThree = new Mesh(
    'RF3',
    fingerShape,
    limbMaterial,
    new Vector3(-0.04, -0.42, 0),
    new Euler(0, 0, (16/18) * Math.PI)
  );

  const rightFingerFour = new Mesh(
    'RF4',
    fingerShape,
    limbMaterial,
    new Vector3(0.1, -0.32 ,0),
    new Euler(0, 0, 0.5  * Math.PI)
  );

  leftArm.addChildren(leftFingerOne);
  leftArm.addChildren(leftFingerTwo);
  leftArm.addChildren(leftFingerThree);
  leftArm.addChildren(leftFingerFour);
  rightArm.addChildren(rightFingerOne);
  rightArm.addChildren(rightFingerTwo);
  rightArm.addChildren(rightFingerThree);
  rightArm.addChildren(rightFingerFour);

  const upperPants = new Mesh(
    'UpperPants',
    upperPantsShape,
    ballMaterial,
    new Vector3(0, -1.125, 0)
  );

  const lowerPants = new Mesh(
    'LowerPants',
    lowerPantsShape,
    pantsMaterial,
    new Vector3(0, -1.45, 0)
  );

  const leftLegPants = new Mesh(
    'LLegPants',
    legConnectorShape,
    pantsMaterial,
    new Vector3(0.5, -0.25, 0)
  );

  const rightLegPants = new Mesh(
    'RLegPants',
    legConnectorShape,
    pantsMaterial,
    new Vector3(-0.5, -0.25, 0)
  );

  cubeMesh.addChildren(upperPants);
  cubeMesh.addChildren(lowerPants);
  lowerPants.addChildren(leftLegPants);
  lowerPants.addChildren(rightLegPants);

  const leftFoot = new Mesh(
    'LFoot',
    feetShape,
    limbMaterial,
    new Vector3(0, -0.25, 0)
  );

  const rightFoot = new Mesh(
    'RFoot',
    feetShape,
    limbMaterial,
    new Vector3(0, -0.25, 0)
  );

  const leftSockWhiteUpper = new Mesh(
    'LSockWU',
    sockShortShape,
    ballMaterial,
    new Vector3(0, -0.45, 0)
  );

  const leftSockBlue = new Mesh(
    'LSockBlue',
    sockShorterShape,
    sockBlueMaterial,
    new Vector3(0, -0.525, 0)
  );

  const leftSockWhiteMiddle = new Mesh(
    'LSockWM',
    sockShortShape,
    ballMaterial,
    new Vector3(0, -0.575, 0)
  );

  const leftSockRed = new Mesh(
    'LSockRed',
    sockShorterShape,
    sockRedMaterial,
    new Vector3(0, -0.65, 0)
  );

  const leftSockLong = new Mesh(
    'LSockLong',
    sockLongShape,
    ballMaterial,
    new Vector3(0, -0.77, 0)
  );

  const rightSockWhiteUpper = new Mesh(
    'RSockWU',
    sockShortShape,
    ballMaterial,
    new Vector3(0, -0.45, 0)
  );

  const rightSockBlue = new Mesh(
    'RSockBlue',
    sockShorterShape,
    sockBlueMaterial,
    new Vector3(0, -0.525, 0)
  );

  const rightSockWhiteMiddle = new Mesh(
    'RSockWM',
    sockShortShape,
    ballMaterial,
    new Vector3(0, -0.575, 0)
  );

  const rightSockRed = new Mesh(
    'RSockRed',
    sockShorterShape,
    sockRedMaterial,
    new Vector3(0, -0.65, 0)
  );

  const rightSockLong = new Mesh(
    'RSockLong',
    sockLongShape,
    ballMaterial,
    new Vector3(0, -0.77, 0)
  );

  const leftShoe = new Mesh(
    'LShoe',
    shoesShape,
    blackMaterial,
    new Vector3(0, -1, 0.1),
    new Euler(0, 0.5 * Math.PI, 0.5 * Math.PI)
  );

  const rightShoe = new Mesh(
    'RShoe',
    shoesShape,
    blackMaterial,
    new Vector3(0, -1, 0.1),
    new Euler(0, 0.5 * Math.PI, 0.5 * Math.PI)
  );

  const hat = new Mesh(
    'Hat',
    hatShape,
    pantsMaterial,
    new Vector3(0, 1.5, 0)
  );

  leftLegPants.addChildren(leftFoot);
  rightLegPants.addChildren(rightFoot);
  leftLegPants.addChildren(leftSockWhiteUpper);
  leftLegPants.addChildren(leftSockBlue);
  leftLegPants.addChildren(leftSockWhiteMiddle);
  leftLegPants.addChildren(leftSockRed);
  leftLegPants.addChildren(leftSockLong);
  rightLegPants.addChildren(rightSockWhiteUpper);
  rightLegPants.addChildren(rightSockBlue);
  rightLegPants.addChildren(rightSockWhiteMiddle);
  rightLegPants.addChildren(rightSockRed);
  rightLegPants.addChildren(rightSockLong);

  leftLegPants.addChildren(leftShoe);
  rightLegPants.addChildren(rightShoe);

  cubeMesh.addChildren(hat);

  return serializeScene(scene);
}