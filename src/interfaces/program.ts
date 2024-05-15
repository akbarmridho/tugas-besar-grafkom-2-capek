import {
  AttributeMapSetters,
  AttributeObject
} from './attribute-properties.ts';
import { UniformMapSetters } from '@/interfaces/uniform-properties.ts';

export interface ProgramInfo<T extends AttributeObject> {
  program: WebGLProgram;
  attributeSetters: AttributeMapSetters<T>;
  uniformSetters: UniformMapSetters;
}
