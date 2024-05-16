import { ColorSerialized } from '@/objects/base/color.ts';
import { Vector3Serialized } from '@/utils/math/vector3.ts';
import { EulerSerialized } from '@/utils/math/euler.ts';
import { OrthographicProjection } from '@/objects/camera/ortographic-camera.ts';
import { BasicMaterialSerialized } from '@/objects/material/basic-material.ts';
import { PlaneGeometryProps } from '@/objects/geometry/plane-geometry.ts';
import { BoxGeometryProps } from '@/objects/geometry/box-geometry.ts';

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

type PCamera = POrthographicCamera;

type PMaterial = PBasicMaterial;

export interface PMesh {
  type: 'PlaneGeometry' | 'BoxGeometry';
  primitives: PlaneGeometryProps | BoxGeometryProps;
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
}
