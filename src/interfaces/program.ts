import {
  AttributeMapSetters,
  AttributeObject
} from './attribute-properties.ts';
import { UniformMapSetters } from '@/interfaces/uniform-properties.ts';

export interface ProgramInfo {
  program: WebGLProgram;
  attributeSetters: AttributeMapSetters;
  uniformSetters: UniformMapSetters;
}
