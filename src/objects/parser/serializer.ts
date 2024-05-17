import { Scene } from '@/objects/scene.ts';
import { Node } from '../base/node';
import { Camera } from '@/objects/base/camera.ts';
import { Mesh } from '@/objects/mesh.ts';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import {
  PCamera,
  PMaterial,
  PMesh,
  PModel,
  PNode
} from '@/interfaces/parser.ts';
import { BufferGeometry } from '@/objects/base/buffer-geometry.ts';
import { BasicMaterial } from '@/objects/material/basic-material.ts';
import { PlaneGeometry } from '@/objects/geometry/plane-geometry.ts';
import { BoxGeometry } from '@/objects/geometry/box-geometry.ts';
import { OrthographicCamera } from '@/objects/camera/ortographic-camera.ts';
import { PyramidGeometry } from '../geometry/pyramid-geometry';
import { PrismGeometry } from '../geometry/prism-geometry';
import { AnimationClip } from '@/interfaces/animation.ts';

export function serializeScene(
  scene: Scene,
  animationClip?: AnimationClip
): PModel {
  // assume: node always unique
  const nodes: Node[] = [];
  const rawNodes: PNode[] = [];
  const cameras: Camera[] = [];
  const rawCameras: PCamera[] = [];
  const geometries: BufferGeometry[] = [];
  const rawGeometries: PMesh[] = [];
  const materials: ShaderMaterial[] = [];
  const rawMaterials: PMaterial[] = [];

  const toTraverse: Node[] = [...scene.children];

  while (toTraverse.length !== 0) {
    const node = toTraverse.shift()!;
    nodes.push(node);

    if (node.children.length !== 0) {
      toTraverse.push(...node.children);
    }

    if (node instanceof Mesh) {
      const inMaterials =
        materials.findIndex((m) => m === node.material) !== -1;

      if (!inMaterials) {
        materials.push(node.material);

        if (node.material instanceof BasicMaterial) {
          rawMaterials.push({
            type: 'BasicMaterial',
            primitives: node.material.toJSON()
          });
        } else {
          throw new Error('Invalid material type');
        }
      }

      const inGeometries =
        geometries.findIndex((g) => g === node.geometry) !== -1;

      if (!inGeometries) {
        geometries.push(node.geometry);

        /**
         * A mesh is defined as a combination of Geometry and Material.
         * So, one instance of geometry should not have different material type
         */
        if (node.geometry instanceof PlaneGeometry) {
          rawGeometries.push({
            type: 'PlaneGeometry',
            primitives: node.geometry.toJSON(false)
          });
        } else if (node.geometry instanceof BoxGeometry) {
          rawGeometries.push({
            type: 'BoxGeometry',
            primitives: node.geometry.toJSON(false)
          });
        } else if (node.geometry instanceof PyramidGeometry) {
          rawGeometries.push({
            type: 'PyramidGeometry',
            primitives: node.geometry.toJSON(false)
          });
        } else if (node.geometry instanceof PrismGeometry) {
          rawGeometries.push({
            type: 'PrismGeometry',
            primitives: node.geometry.toJSON(false)
          });
        } else {
          throw new Error('Invalid geometry type');
        }
      }
    } else if (node instanceof Camera) {
      cameras.push(node as Camera);

      if (node instanceof OrthographicCamera) {
        rawCameras.push({
          type: 'OrthographicCamera',
          projection: node.toJSON().projection
        });
      } else {
        throw new Error('Invalid camera type');
      }
    } else {
      throw new Error('Invalid instance type');
    }
  }

  for (const node of nodes) {
    const nodeSerialization = node.toNodeSerialized();
    const baseData: PNode = {
      name: node.name,
      children: node.children.map((child) => {
        return nodes.findIndex((n) => n === child);
      }),
      translation: nodeSerialization.transform.position,
      rotation: nodeSerialization.transform.rotation,
      scale: nodeSerialization.transform.scale
    };

    if (node instanceof Mesh) {
      baseData.mesh = geometries.findIndex((g) => node.geometry === g);
      baseData.meshMaterial = materials.findIndex((m) => m === node.material);
    } else if (node instanceof Camera) {
      baseData.camera = cameras.findIndex((c) => node === c);
    } else {
      throw new Error('Invalid instance of node');
    }

    rawNodes.push(baseData);
  }

  return {
    scene: {
      name: scene.name,
      color: scene.color.toJSON(),
      children: scene.children.map((child) =>
        nodes.findIndex((n) => child === n)
      )
    },
    nodes: rawNodes,
    cameras: rawCameras,
    meshes: rawGeometries,
    materials: rawMaterials,
    animationClip
  };
}
