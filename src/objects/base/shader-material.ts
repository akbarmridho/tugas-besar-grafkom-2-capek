import { Serializable } from './serializable.ts';
import { UniformObject } from '@/interfaces/uniform-properties.ts';

export abstract class ShaderMaterial<T = unknown> extends Serializable<T> {
  static #idCounter = 0;
  private readonly _id: string = 'M' + ShaderMaterial.#idCounter++;
  /* Attribute */
  private _vertexShader: string;
  private _fragmentShader: string;
  private _uniforms: UniformObject;

  protected _hasTexture: boolean = false;

  /* Constructor */
  protected constructor(
    vertexShader: string = '',
    fragmentShader: string = '',
    uniforms: UniformObject = {}
  ) {
    super();
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._uniforms = uniforms;
  }

  get id() {
    return this._id;
  }

  get vertexShader() {
    return this._vertexShader;
  }

  get fragmentShader() {
    return this._fragmentShader;
  }

  get uniforms() {
    return this._uniforms;
  }

  get hasTexture() {
    return this._hasTexture;
  }

  equals(material: ShaderMaterial<never>) {
    return this._id == material._id;
  }
}
