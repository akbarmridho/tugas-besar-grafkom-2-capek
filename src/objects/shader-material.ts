import { Serializable } from './serializable.ts';

export class ShaderMaterial {
  /* Attribute */
  private _vertexShader: String
  private _fragmentShader: String
  private _uniforms = {}

  /* Constructor */
  constructor(vertexShader: String = '', fragmentShader: String = '', uniforms = {}) {
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = uniforms;
  }
}
