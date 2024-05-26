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
import { PhongMaterial } from '@/objects/material/phong-material.ts';
import { Mesh } from '@/objects/mesh.ts';
import { CylinderGeometry } from '@/objects/geometry/cylinder-geometry.ts';
import { Euler } from '@/utils/math/euler.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { PointLight } from '@/objects/light/point-light.ts';

export function tank(): PModel {
  const scene = new Scene('neo-armstrong-cyclone', Color.fromHex(0x141717));
  const orthographicCamera = new OrthographicCamera('orthographic camera');
  const perspectiveCamera = new PerspectiveCamera('perspective camera');
  const obliqueCamera = new ObliqueCamera('Oblique Camera');
  orthographicCamera.setPosition(new Vector3(0, 0, 1));
  perspectiveCamera.setPosition(new Vector3(0, 0, 1));
  obliqueCamera.setPosition(new Vector3(0, 0, 1));
  scene.addChildren(orthographicCamera);
  scene.addChildren(perspectiveCamera);
  scene.addChildren(obliqueCamera);

  const ambientLight = new AmbientLight('ambient', Color.White(), 0.1);
  scene.addChildren(ambientLight);
  const directionalLight = new DirectionalLight(
    'moonlight',
    Color.White(),
    new Vector3(-1, -1, -1),
    0.25
  );
  scene.addChildren(directionalLight);

  // base tank material
  const baseTankShape = new BoxGeometry(2.5, 0.5, 1.5);
  const baseTankMaterial = PhongMaterial.fromTextureOption(
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

  const baseTankMesh = new Mesh(
    'tank',
    baseTankShape,
    baseTankMaterial,
    undefined,
    undefined,
    new Vector3(0.5, 0.5, 0.5)
  );

  scene.addChildren(baseTankMesh);

  // setup tire
  {
    const tireGeometry = new CylinderGeometry(0.25, 0.25, 0.25, 64, 64);
    const tireMaterial = new PhongMaterial(
      Color.Black(),
      Color.fromHex(0x677370),
      Color.fromHex(0xaaadad),
      32
    );

    const frontRightTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(1.25, 0, 0.88),
      new Euler(degreeToRadian(90))
    );

    const front1RTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(0.75, -0.25, 0.88),
      new Euler(degreeToRadian(90))
    );

    const front2RTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(0.25, -0.25, 0.88),
      new Euler(degreeToRadian(90))
    );

    const front3RTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(-0.25, -0.25, 0.88),
      new Euler(degreeToRadian(90))
    );

    const front4RTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(-0.75, -0.25, 0.88),
      new Euler(degreeToRadian(90))
    );

    const backRightTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(-1.25, 0, 0.88),
      new Euler(degreeToRadian(90))
    );

    const frontLeftTire = new Mesh(
      'tire-l',
      tireGeometry,
      tireMaterial,
      new Vector3(1.25, 0, -0.88),
      new Euler(degreeToRadian(-90))
    );

    const front1LTire = new Mesh(
      'tire-l',
      tireGeometry,
      tireMaterial,
      new Vector3(0.75, -0.25, -0.88),
      new Euler(degreeToRadian(-90))
    );

    const front2LTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(0.25, -0.25, -0.88),
      new Euler(degreeToRadian(-90))
    );

    const front3LTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(-0.25, -0.25, -0.88),
      new Euler(degreeToRadian(-90))
    );

    const front4LTire = new Mesh(
      'tire-r',
      tireGeometry,
      tireMaterial,
      new Vector3(-0.75, -0.25, -0.88),
      new Euler(degreeToRadian(-90))
    );

    const backLeftTire = new Mesh(
      'tire-l',
      tireGeometry,
      tireMaterial,
      new Vector3(-1.25, 0, -0.88),
      new Euler(degreeToRadian(-90))
    );

    baseTankMesh.addChildren(frontRightTire);
    baseTankMesh.addChildren(frontLeftTire);
    baseTankMesh.addChildren(backRightTire);
    baseTankMesh.addChildren(backLeftTire);
    baseTankMesh.addChildren(front1RTire);
    baseTankMesh.addChildren(front2RTire);
    baseTankMesh.addChildren(front3RTire);
    baseTankMesh.addChildren(front4RTire);
    baseTankMesh.addChildren(front1LTire);
    baseTankMesh.addChildren(front2LTire);
    baseTankMesh.addChildren(front3LTire);
    baseTankMesh.addChildren(front4LTire);
    baseTankMesh.addChildren(frontRightTire);
  }

  // setup front-back armor
  {
    const armorMaterial = PhongMaterial.fromTextureOption(
      {
        name: 'diamond-plate',
        diffuse: '/textures/diamond-plate/diffuse.png',
        displacement: '/textures/diamond-plate/displacement.png',
        normal: '/textures/diamond-plate/normal.png'
      },
      Color.Black(),
      16,
      0.01,
      -0.01
    );

    const frontArmorShape = new BoxGeometry(0.375, 0.375, 1.5);

    const frontArmor = new Mesh(
      'front-armor',
      frontArmorShape,
      armorMaterial,
      new Vector3(1.375, 0.05, 0)
    );

    const backArmorArmor = new Mesh(
      'back-armor',
      frontArmorShape,
      armorMaterial,
      new Vector3(-1.375, 0.05, 0)
    );

    baseTankMesh.addChildren(frontArmor);
    baseTankMesh.addChildren(backArmorArmor);
  }

  // setup head
  {
    const bodyShape = new BoxGeometry(2.75, 0.25, 2);
    const bodyMesh = new Mesh(
      'body',
      bodyShape,
      baseTankMaterial,
      new Vector3(0, 0.3, 0)
    );

    baseTankMesh.addChildren(bodyMesh);

    const headShape = new BoxGeometry(1.75, 0.4, 1.25);
    const headTankMaterial = PhongMaterial.fromTextureOption(
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

    const headMesh = new Mesh(
      'head',
      headShape,
      headTankMaterial,
      new Vector3(0, 0.25, 0)
    );
    bodyMesh.addChildren(headMesh);

    // setup cannon
    {
      const canonShape = new BoxGeometry(2, 0.1, 0.1);
      const canonMaterial = PhongMaterial.fromTextureOption(
        {
          name: 'metal',
          diffuse: '/textures/metal/diffuse.png',
          displacement: '/textures/metal/displacement.png',
          normal: '/textures/metal/normal.png',
          specular: '/textures/metal/specular.png'
        },
        Color.Black(),
        24,
        0,
        0
      );

      const canonMesh = new Mesh(
        'canon',
        canonShape,
        canonMaterial,
        new Vector3(1.8, 0.05, 0)
      );

      headMesh.addChildren(canonMesh);
    }
  }

  // setup terrain
  {
    const terrainShape = new BoxGeometry(8, 0.25, 8);
    const terrainMaterial = PhongMaterial.fromTextureOption(
      {
        name: 'tiles',
        diffuse: '/textures/tiles/diffuse.png',
        displacement: '/textures/tiles/displacement.png',
        normal: '/textures/tiles/normal.png',
        specular: '/textures/tiles/specular.png'
      },
      Color.Black(),
      16,
      0,
      0
    );

    const terrainMesh = new Mesh(
      'terrain',
      terrainShape,
      terrainMaterial,
      new Vector3(0, -0.4)
    );

    scene.addChildren(terrainMesh);
  }

  // setup point lights
  const p1Material = new BasicMaterial(Color.fromHex(0xf23542));
  const p1Geometry = new BoxGeometry(0.1, 0.1, 0.1);
  const p1Mesh = new Mesh('p1', p1Geometry, p1Material, new Vector3(2, 0.5, 2));
  const p1Light = new PointLight(
    'p1',
    Color.fromHex(0xf23542),
    1,
    0,
    new Vector3(2, 0.5, 2)
  );

  scene.addChildren(p1Mesh);
  scene.addChildren(p1Light);

  // setup point lights
  const p2Material = new BasicMaterial(Color.fromHex(0x7b47f5));
  const p2Geometry = new BoxGeometry(0.1, 0.1, 0.1);
  const p2Mesh = new Mesh(
    'p2',
    p2Geometry,
    p2Material,
    new Vector3(2, 0.5, -2)
  );
  const p2Light = new PointLight(
    'p2',
    Color.fromHex(0x7b47f5),
    1,
    0,
    new Vector3(2, 0.5, -2)
  );

  scene.addChildren(p2Mesh);
  scene.addChildren(p2Light);

  const p3Material = new BasicMaterial(Color.fromHex(0xffffff));
  const p3Geometry = new BoxGeometry(0.1, 0.1, 0.1);
  const p3Mesh = new Mesh(
    'p3',
    p3Geometry,
    p3Material,
    new Vector3(-2, 0.5, 0)
  );
  const p3Light = new PointLight(
    'p3',
    Color.fromHex(0xffffff),
    1,
    0,
    new Vector3(-2, 0.5, 0)
  );

  scene.addChildren(p3Mesh);
  scene.addChildren(p3Light);

  return serializeScene(scene);
}
