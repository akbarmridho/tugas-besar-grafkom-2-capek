import { Serializable } from './serializable.ts';
import { UniformObject } from '@/interfaces/uniform-properties.ts';

export abstract class ShaderMaterial<T> extends Serializable<T> {
  static #idCounter = 0;
  private readonly _id: string = 'M' + ShaderMaterial.#idCounter++;
  /* Attribute */
  private _vertexShader: string;
  private _fragmentShader: string;
  private _uniforms: Partial<UniformObject>;

  /* Constructor */
  protected constructor(
    vertexShader: string = '',
    fragmentShader: string = '',
    uniforms: Partial<UniformObject> = {}
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

  equals(material: ShaderMaterial<never>) {
    return this._id == material._id;
  }
}
