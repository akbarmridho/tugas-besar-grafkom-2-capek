export type TextureData = HTMLImageElement | Uint8Array;

export type TextureDataInput = string | TextureData;

export type ValueOf<T> = T[keyof T];

export const WrapMode = {
  ClampToEdge: WebGLRenderingContext.CLAMP_TO_EDGE,
  Repeat: WebGLRenderingContext.REPEAT,
  MirroredRepeat: WebGLRenderingContext.MIRRORED_REPEAT
} as const;

export const MagFilter = {
  Nearest: WebGLRenderingContext.NEAREST,
  Linear: WebGLRenderingContext.LINEAR
} as const;

export const MinFilter = {
  Nearest: WebGLRenderingContext.NEAREST,
  Linear: WebGLRenderingContext.LINEAR,
  NearestMipmapNearest: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
  NearestMipmapLinear: WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
  LinearMipmapNearest: WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
  LinearMipmapLinear: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
} as const;

export const ImageFormat = {
  RGBA: WebGLRenderingContext.RGBA,
  RGB: WebGLRenderingContext.RGB,
  LuminanceAlpha: WebGLRenderingContext.LUMINANCE_ALPHA,
  Luminance: WebGLRenderingContext.LUMINANCE
} as const;
export const ImageType = {
  UnsignedByte: WebGLRenderingContext.UNSIGNED_BYTE,
  UnsignedShort4444: WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
  UnsignedShort5551: WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1,
  UnsignedShort565: WebGLRenderingContext.UNSIGNED_SHORT_5_6_5
} as const;
