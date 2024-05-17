import { ColorSerialized } from '@/objects/base/color.ts';
import { Vector3Serialized } from '@/utils/math/vector3.ts';
import { EulerSerialized } from '@/utils/math/euler.ts';
import { OrthographicProjection } from '@/objects/camera/ortographic-camera.ts';
import { BasicMaterialSerialized } from '@/objects/material/basic-material.ts';
import { PlaneGeometryProps } from '@/objects/geometry/plane-geometry.ts';
import { BoxGeometryProps } from '@/objects/geometry/box-geometry.ts';
import { PyramidGeometryProps } from '@/objects/geometry/pyramid-geometry';
import { PrismGeometryProps } from '@/objects/geometry/prism-geometry';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { Scene } from '@/objects/scene.ts';
import { Camera } from '@/objects/base/camera.ts';
import { AnimationClip } from '@/interfaces/animation.ts';

export interface PNode {
  name: string;
  children: number[];
  camera?: number;
  mesh?: number;
  translation: Vector3Serialized;
  rotation?: EulerSerialized;
  scale?: Vector3Serialized;
}

export interface POrthographicCamera {
  type: 'OrthographicCamera';
  projection: OrthographicProjection;
}

export interface PBasicMaterial {
  type: 'BasicMaterial';
  primitives: BasicMaterialSerialized;
}

export type PCamera = POrthographicCamera;

export type PMaterial = PBasicMaterial;

export interface PMesh {
  type: 'PlaneGeometry' | 'BoxGeometry' | 'PyramidGeometry' | 'PrismGeometry';
  primitives: PlaneGeometryProps | BoxGeometryProps | PyramidGeometryProps | PrismGeometryProps;
  material: number;
}

export interface PModel {
  scene: {
    name: string;
    color: ColorSerialized;
    children: number[];
  };
  nodes: PNode[];
  cameras: PCamera[];
  meshes: PMesh[];
  materials: PMaterial[];
  animationClip?: AnimationClip;
}

export interface ParseModelResult {
  materials: ShaderMaterial[];
  scene: Scene;
  cameras: Camera[];
  animationClip?: AnimationClip;
}
