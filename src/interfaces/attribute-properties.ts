import { BufferAttribute } from '../objects/buffer-attribute.ts';

export type AttributeDataType = BufferAttribute | Float32Array | number[];

export type AttributeSetters = (v: AttributeDataType) => void;

export interface AttributeObject {
  [attributeName: string]: AttributeDataType;
}

export type AttributeMapSetters<T extends AttributeObject> = {
  [Property in keyof T]: AttributeSetters;
};
