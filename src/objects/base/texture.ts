import { Serializable } from './serializable.ts';

export class Texture {
  /* Attribute */
  // Image source for texture
  private _image: ArrayBuffer | null;

  // Control how texture coordinated outside of [0, 1] are handled
  private _wrapS: number;
  private _wrapT: number;

  // Control how texture is sampled when magnified or minified
  private _magFilter: number;
  private _minFilter: number;

  // Describe the texture
  private _format: number;
  private _dtype: number;

  // Flag to generate mipmaps or not
  private _generateMipmaps: boolean;

  /* Constructor */
  constructor(
    image: ArrayBuffer | null = null,
    wrapS: number,
    wrapT: number,
    magFilter: number,
    minFilter: number,
    format: number,
    dtype: number,
    generateMipmaps: boolean
  ) {
    this._image = image;
    this._wrapS = wrapS;
    this._wrapT = wrapT;
    this._magFilter = magFilter;
    this._minFilter = minFilter;
    this._format = format;
    this._dtype = dtype;
    this._generateMipmaps = generateMipmaps;
  }

  /* Getter */
  get image(): ArrayBuffer | null {
    return this._image;
  }

  /* Setter */
  set image(newImage: ArrayBuffer | null) {
    this._image = newImage;
  }
}
//
// const canvas = document.createElement('canvas')
// const gl = canvas.getContext('webgl2')
// gl?.REPEAT
