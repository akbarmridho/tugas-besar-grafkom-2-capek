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
import { OrthographicCamera } from '@/objects/camera/ortographic-camera.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Mesh } from '@/objects/mesh.ts';
import {
  BoxGeometry,
  BoxGeometryProps
} from '@/objects/geometry/box-geometry.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';

export function parseModel(data: PModel): ParseModelResult {
  const scene = new Scene(data.scene.name, Color.fromJSON(data.scene.color));

  // initialize materials
  const materials: ShaderMaterial[] = [];

  for (const rawMaterial of data.materials) {
    if (rawMaterial.type === 'BasicMaterial') {
      materials.push(BasicMaterial.fromJSON(rawMaterial.primitives));
    } else {
      throw new Error('Invalid material type');
    }
  }

  // initialize meshes

  const baseMesh: { geometry: BufferGeometry; material: ShaderMaterial }[] = [];

  for (const rawMesh of data.meshes) {
    if (rawMesh.type === 'PlaneGeometry') {
      const primitives = rawMesh.primitives as PlaneGeometryProps;
      const geometry = PlaneGeometry.fromJSON(primitives);
      const material = materials[rawMesh.material];

      baseMesh.push({
        geometry,
        material
      });
    } else if (rawMesh.type === 'BoxGeometry') {
      const primitives = rawMesh.primitives as BoxGeometryProps;
      const geometry = BoxGeometry.fromJSON(primitives);
      const material = materials[rawMesh.material];

      baseMesh.push({
        geometry,
        material
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
      } else {
        throw new Error('Invalid camera type');
      }

      cameras.push(node as Camera);
    } else if (rawNode.mesh !== undefined) {
      const meshData = baseMesh[rawNode.mesh];

      node = new Mesh(
        rawNode.name,
        meshData.geometry,
        meshData.material,
        position,
        rotation,
        scale
      );
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
