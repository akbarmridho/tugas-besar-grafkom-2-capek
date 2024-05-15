import { BufferAttribute } from '../objects/buffer-attribute.ts';

export type AttributeDataType = BufferAttribute | Float32Array | number[];

export type AttributeSetters = (v: AttributeDataType) => void;

interface BaseAttributeObject {
  [attributeName: string]: AttributeDataType;
}

export interface AttributeObject extends Partial<BaseAttributeObject> {}

interface BaseAttributeMapSetters {
  [attributeName: string]: AttributeSetters;
}

export interface AttributeMapSetters extends Partial<BaseAttributeMapSetters> {}
