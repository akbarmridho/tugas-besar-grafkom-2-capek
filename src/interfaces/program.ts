import {
  AttributeMapSetters,
  AttributeObject
} from './attribute-properties.ts';

export interface ProgramInfo<T extends AttributeObject, U extends Object> {
  program: WebGLProgram;
  attributeSetters: AttributeMapSetters<T>;
  // uniformSetters: U
}
