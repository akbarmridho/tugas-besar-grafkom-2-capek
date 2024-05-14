import { Serializable } from './serializable.ts';

export interface ShaderMaterialSerialized {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, unknown>;
}

export class ShaderMaterial {
  /* Attribute */
  private _vertexShader: string
  private _fragmentShader: string
  private _uniforms = {}

  /* Constructor */
  constructor(vertexShader: string = '', fragmentShader: string = '', uniforms = {}) {
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = uniforms;
  }

  toJSON(): ShaderMaterialSerialized {
    return {
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      uniforms: this._uniforms
    };
  }
}
