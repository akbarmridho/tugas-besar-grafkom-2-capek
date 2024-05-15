import { Matrix4 } from '../utils/math/matrix4.ts';

export const UniformSetterWebGLType = {
  [WebGLRenderingContext.FLOAT]: '1f',
  [WebGLRenderingContext.FLOAT_VEC2]: '2f',
  [WebGLRenderingContext.FLOAT_VEC3]: '3f',
  [WebGLRenderingContext.FLOAT_VEC4]: '4f',
  [WebGLRenderingContext.INT]: '1i',
  [WebGLRenderingContext.INT_VEC2]: '2i',
  [WebGLRenderingContext.INT_VEC3]: '3i',
  [WebGLRenderingContext.INT_VEC4]: '4i',
  [WebGLRenderingContext.BOOL]: '1i',
  [WebGLRenderingContext.BOOL_VEC2]: '2i',
  [WebGLRenderingContext.BOOL_VEC3]: '3i',
  [WebGLRenderingContext.BOOL_VEC4]: '4i',
  [WebGLRenderingContext.FLOAT_MAT2]: 'Matrix2fv',
  [WebGLRenderingContext.FLOAT_MAT3]: 'Matrix3fv',
  [WebGLRenderingContext.FLOAT_MAT4]: 'Matrix4fv'
};

export type UniformDataType = Matrix4 | Iterable<number>;

export type UniformSetters = (val: UniformDataType) => void;

export interface UniformObject {
  [uniformName: string]: UniformDataType;
}

export type UniformMapSetters = {
  [keyName: string]: UniformSetters;
};
