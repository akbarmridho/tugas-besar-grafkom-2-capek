import { ParseModelResult, PModel } from '@/interfaces/parser.ts';
import { Scene } from '@/objects/scene.ts';
import { Color } from '@/objects/base/color.ts';
import { Node } from '@/objects/base/node.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { BufferGeometry } from '@/objects/base/buffer-geometry.ts';
import {
  PlaneGeometry,
  PlaneGeometryProps
} from '@/objects/geometry/plane-geometry.ts';
import { Camera } from '@/objects/base/camera.ts';
import { OrthographicCamera } from '@/objects/camera/orthographic-camera.ts';
import { PerspectiveCamera } from '../camera/perspective-camera';
import { ObliqueCamera } from '../camera/oblique-camera';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Mesh } from '@/objects/mesh.ts';
import {
  BoxGeometry,
  BoxGeometryProps
} from '@/objects/geometry/box-geometry.ts';
import {
  PyramidGeometry,
  PyramidGeometryProps
} from '@/objects/geometry/pyramid-geometry.ts';
import {
  PrismGeometry,
  PrismGeometryProps
} from '@/objects/geometry/prism-geometry.ts';
import {
  CylinderGeometry,
  CylinderGeometryProps
} from '@/objects/geometry/cylinder-geometry.ts';
import {
  SphereGeometry,
  SphereGeometryProps
} from '@/objects/geometry/sphere-geometry.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { PhongMaterial } from '../material/phong-material';
import { AmbientLight } from '../light/ambient-light';
import { Divide } from 'lucide-react';
import { DirectionalLight } from '../light/directional-light';
import { PointLight } from '../light/point-light';
import { GlassGeometry, GlassGeometryProps } from '../geometry/glass-geometry';
import { DoubleRingGeometry } from '@/objects/geometry/double-ring-geometry.ts';

export function parseModel(data: PModel): ParseModelResult {
  const scene = new Scene(data.scene.name, Color.fromJSON(data.scene.color));

  // initialize materials
  const materials: ShaderMaterial[] = [];

  for (const rawMaterial of data.materials) {
    if (rawMaterial.type === 'BasicMaterial') {
      materials.push(BasicMaterial.fromJSON(rawMaterial.primitives));
    } else if (rawMaterial.type === 'PhongMaterial') {
      materials.push(PhongMaterial.fromJSON(rawMaterial.primitives));
    } else {
      throw new Error('Invalid material type');
    }
  }

  // initialize meshes

  const baseMesh: { geometry: BufferGeometry }[] = [];

  for (const rawMesh of data.meshes) {
    if (rawMesh.type === 'PlaneGeometry') {
      const primitives = rawMesh.primitives as PlaneGeometryProps;
      const geometry = PlaneGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else if (rawMesh.type === 'BoxGeometry') {
      const primitives = rawMesh.primitives as BoxGeometryProps;
      const geometry = BoxGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else if (rawMesh.type === 'PyramidGeometry') {
      const primitives = rawMesh.primitives as PyramidGeometryProps;
      const geometry = PyramidGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else if (rawMesh.type === 'PrismGeometry') {
      const primitives = rawMesh.primitives as PrismGeometryProps;
      const geometry = PrismGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else if (rawMesh.type === 'DoubleRingGeometry') {
      baseMesh.push({
        geometry: new DoubleRingGeometry()
      });
    } else if (rawMesh.type === 'CylinderGeometry') {
      const primitives = rawMesh.primitives as CylinderGeometryProps;
      const geometry = CylinderGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else if (rawMesh.type === 'SphereGeometry') {
      const primitives = rawMesh.primitives as SphereGeometryProps;
      const geometry = SphereGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else if (rawMesh.type === 'HypercubeGeometry') {
      const primitives = rawMesh.primitives as GlassGeometryProps;
      const geometry = GlassGeometry.fromJSON(primitives);

      baseMesh.push({
        geometry
      });
    } else {
      throw new Error('Invalid raw mesh type');
    }
  }

  // initialize nodes
  const nodes: Node[] = [];
  const cameras: Camera[] = [];

  for (const rawNode of data.nodes) {
    const position = rawNode.translation
      ? Vector3.fromJSON(rawNode.translation)
      : undefined;
    const rotation = rawNode.rotation
      ? Euler.fromJSON(rawNode.rotation)
      : undefined;
    const scale = rawNode.scale ? Vector3.fromJSON(rawNode.scale) : undefined;

    let node: Node;

    if (rawNode.camera !== undefined) {
      const rawCameraData = data.cameras[rawNode.camera];

      if (rawCameraData.type === 'OrthographicCamera') {
        node = new OrthographicCamera(
          rawNode.name,
          rawCameraData.projection,
          position,
          rotation,
          scale
        );
      } else if (rawCameraData.type === 'PerspectiveCamera') {
        node = new PerspectiveCamera(
          rawNode.name,
          rawCameraData.projection,
          position,
          rotation,
          scale
        );
      } else if (rawCameraData.type === 'ObliqueCamera') {
        node = new ObliqueCamera(
          rawNode.name,
          rawCameraData.projection,
          position,
          rotation,
          scale
        );
      } else {
        throw new Error('Invalid camera type');
      }

      cameras.push(node as Camera);
    } else if (rawNode.mesh !== undefined) {
      const meshData = baseMesh[rawNode.mesh];

      node = new Mesh(
        rawNode.name,
        meshData.geometry,
        materials[rawNode.meshMaterial!],
        position,
        rotation,
        scale
      );
    } else if (rawNode.light !== undefined) {
      const rawLightData = data.lights[rawNode.light];
      if (rawLightData.type === 'AmbientLight') {
        node = new AmbientLight(
          rawNode.name,
          Color.fromJSON(rawLightData.primitives.color),
          rawLightData.primitives.intensity
        );
      } else if (rawLightData.type === 'DirectionalLight') {
        node = new DirectionalLight(
          rawNode.name,
          Color.fromJSON(rawLightData.primitives.color),
          Vector3.fromJSON(rawLightData.primitives.direction),
          rawLightData.primitives.intensity
        );
      } else if (rawLightData.type === 'PointLight') {
        node = new PointLight(
          rawNode.name,
          Color.fromJSON(rawLightData.primitives.color),
          rawLightData.primitives.intensity,
          rawLightData.primitives.radius,
          position,
          rawLightData.primitives.constant,
          rawLightData.primitives.linear,
          rawLightData.primitives.quadratic,
          rotation,
          scale
        );
      } else {
        throw new Error('Invalid light type');
      }
    } else {
      throw new Error('Invalid node type');
    }

    if (node) {
      nodes.push(node);
    } else {
      throw new Error('Node not set');
    }
  }

  // set the children node of a scene
  const toAssign: { parent: Node; children: number[] }[] = [
    {
      parent: scene,
      children: data.scene.children
    }
  ];

  while (toAssign.length !== 0) {
    const node = toAssign.shift()!;

    for (const childIdx of node.children) {
      const rawNode = data.nodes[childIdx];
      const child = nodes[childIdx];
      node.parent.addChildren(child);

      if (rawNode.children.length !== 0) {
        toAssign.push({
          parent: child,
          children: rawNode.children
        });
      }
    }
  }

  return {
    materials,
    scene,
    cameras,
    animationClip: data.animationClip
  };
}
