import { ColorSerialized } from '@/objects/base/color.ts';
import { Vector3Serialized } from '@/utils/math/vector3.ts';
import { EulerSerialized } from '@/utils/math/euler.ts';
import { OrthographicProjection } from '@/objects/camera/orthographic-camera.ts';
import { BasicMaterialSerialized } from '@/objects/material/basic-material.ts';
import { PlaneGeometryProps } from '@/objects/geometry/plane-geometry.ts';
import { BoxGeometryProps } from '@/objects/geometry/box-geometry.ts';
import { PyramidGeometryProps } from '@/objects/geometry/pyramid-geometry';
import { PrismGeometryProps } from '@/objects/geometry/prism-geometry';
import {
  CylinderGeometry,
  CylinderGeometryProps
} from '@/objects/geometry/cylinder-geometry';
import { SphereGeometryProps } from '@/objects/geometry/sphere-geometry';
import { ShaderMaterial } from '@/objects/base/shader-material.ts';
import { Scene } from '@/objects/scene.ts';
import { Camera } from '@/objects/base/camera.ts';
import { AnimationClip } from '@/interfaces/animation.ts';
import { PhongMaterialSerialized } from '@/objects/material/phong-material';
import { PerspectiveProjection } from '@/objects/camera/perspective-camera';
import { ObliqueProjection } from '@/objects/camera/oblique-camera';
import {
  AmbientLightProps,
  AmbientLightSerialized
} from '@/objects/light/ambient-light';
import {
  DirectionalLightProps,
  DirectionalLightSerialized
} from '@/objects/light/directional-light';
import {
  PointLightProps,
  PointLightSerialized
} from '@/objects/light/point-light';

export interface PNode {
  name: string;
  theta?: number;
  children: number[];
  camera?: number;
  mesh?: number;
  meshMaterial?: number;
  light?: number;
  translation: Vector3Serialized;
  rotation?: EulerSerialized;
  scale?: Vector3Serialized;
}

export interface POrthographicCamera {
  type: 'OrthographicCamera';
  projection: OrthographicProjection;
}

export interface PPerspectiveCamera {
  type: 'PerspectiveCamera';
  projection: PerspectiveProjection;
}

export interface PObliqueCamera {
  type: 'ObliqueCamera';
  projection: ObliqueProjection;
}

export interface PBasicMaterial {
  type: 'BasicMaterial';
  primitives: BasicMaterialSerialized;
}

export interface PPhongMaterial {
  type: 'PhongMaterial';
  primitives: PhongMaterialSerialized;
}

export interface PAmbientLight {
  type: 'AmbientLight';
  primitives: AmbientLightSerialized;
}

export interface PDirectionalLight {
  type: 'DirectionalLight';
  primitives: DirectionalLightSerialized;
}

export interface PPointLight {
  type: 'PointLight';
  primitives: PointLightSerialized;
}

export type PCamera = POrthographicCamera | PPerspectiveCamera | PObliqueCamera;

export type PMaterial = PBasicMaterial | PPhongMaterial;

export type PLight = PAmbientLight | PDirectionalLight | PPointLight;

export interface PMesh {
  type:
    | 'PlaneGeometry'
    | 'BoxGeometry'
    | 'PyramidGeometry'
    | 'PrismGeometry'
    | 'CylinderGeometry'
    | 'SphereGeometry';
  primitives:
    | PlaneGeometryProps
    | BoxGeometryProps
    | PyramidGeometryProps
    | PrismGeometryProps
    | CylinderGeometryProps
    | SphereGeometryProps;
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
  lights: PLight[];
  animationClip?: AnimationClip;
}

export interface ParseModelResult {
  materials: ShaderMaterial[];
  scene: Scene;
  cameras: Camera[];
  animationClip?: AnimationClip;
}
