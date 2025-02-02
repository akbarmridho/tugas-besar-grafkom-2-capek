import { Serializable } from './serializable.ts';
import {
  ImageFormat,
  ImageType,
  MagFilter,
  MinFilter,
  TextureData,
  TextureDataInput,
  ValueOf,
  WrapMode
} from '@/interfaces/texture.ts';
import { Color, ColorSerialized } from '@/objects/base/color.ts';
import { fromByteArray, toByteArray } from 'base64-js';
import { TextureOption } from '@/factory/texture-selector.ts';
import { PhongMaterial } from '@/objects/material/phong-material.ts';

export interface TextureSerialized {
  data:
    | {
        url: string;
      }
    | { buffer: string; height: number; width: number }
    | ColorSerialized
    | null;
  wrapS?: ValueOf<typeof WrapMode>;
  wrapT?: ValueOf<typeof WrapMode>;
  minFilter?: ValueOf<typeof MinFilter>;
  magFilter?: ValueOf<typeof MagFilter>;
  format?: ValueOf<typeof ImageFormat>;
  type?: ValueOf<typeof ImageType>;
}

export class Texture extends Serializable<TextureSerialized> {
  private _textureSrc: string | null = null;
  private _image: HTMLImageElement = new Image();
  private _data: TextureData | null = null;
  private _callbackFn: (() => void) | null = null;
  private _width: number = 0;
  private _height: number = 0;
  private _defaultColor: Color = Color.White();
  private _plainColor: boolean = false;

  // Control how texture coordinated outside of [0, 1] are handled
  private _wrapS: ValueOf<typeof WrapMode>;
  private _wrapT: ValueOf<typeof WrapMode>;

  // Control how texture is sampled when magnified or minified
  private _minFilter: ValueOf<typeof MinFilter>;
  private _magFilter: ValueOf<typeof MagFilter>;

  // Describe the texture
  private _format: ValueOf<typeof ImageFormat>;
  private _type: ValueOf<typeof ImageType>;

  public _texture: WebGLTexture | null = null; // don't change
  public needsUpload: boolean = true;
  public parameterChanged: boolean = true;

  get wrapS() {
    return this._wrapS;
  }

  get isPlainColor() {
    return this._plainColor;
  }

  get textureSrc() {
    return this._textureSrc;
  }

  set wrapS(value: ValueOf<typeof WrapMode>) {
    this._wrapS = value;
  }

  get wrapT() {
    return this._wrapT;
  }

  set wrapT(value: ValueOf<typeof WrapMode>) {
    this._wrapT = value;
  }

  get minFilter() {
    return this._minFilter;
  }

  set minFilter(value: ValueOf<typeof MinFilter>) {
    this._minFilter = value;
  }

  get magFilter() {
    return this._magFilter;
  }

  get format() {
    return this._format;
  }

  get type() {
    return this._type;
  }

  constructor(
    data?: {
      data?: string | HTMLImageElement | Uint8Array | TextureDataInput | Color;
      width?: number;
      height?: number;
    },
    params: {
      wrapS?: ValueOf<typeof WrapMode>;
      wrapT?: ValueOf<typeof WrapMode>;
      minFilter?: ValueOf<typeof MinFilter>;
      magFilter?: ValueOf<typeof MagFilter>;
      format?: ValueOf<typeof ImageFormat>;
      type?: ValueOf<typeof ImageType>;
    } = {
      wrapS: WrapMode.Repeat,
      wrapT: WrapMode.Repeat,
      minFilter: MinFilter.NearestMipmapLinear,
      magFilter: MagFilter.Linear,
      format: ImageFormat.RGBA,
      type: ImageType.UnsignedByte
    }
  ) {
    super();
    this._setLoader(this._image);

    this._wrapS = params.wrapS || WrapMode.Repeat;
    this._wrapT = params.wrapT || WrapMode.Repeat;
    this._minFilter = params.minFilter || MinFilter.NearestMipmapLinear;
    this._magFilter = params.magFilter || MagFilter.Linear;
    this._format = params.format || ImageFormat.RGBA;
    this._type = params.type || ImageType.UnsignedByte;

    this.setData(data?.data, data?.width, data?.height);
  }

  get isLoaded() {
    return this._data !== null;
  }

  // this is used when there are no data
  get defaultColor() {
    return this._defaultColor;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get data() {
    return this._data;
  }

  private _setLoader(image: HTMLImageElement) {
    image.onload = () => {
      this._data = this._image;
      this.needsUpload = true;
      this.parameterChanged = true;
      this._height = this._image.height;
      this._width = this._image.width;
      if (this._callbackFn !== null) {
        this._callbackFn();
      }
    };
  }

  setData(
    data?: string | HTMLImageElement | Uint8Array | TextureDataInput | Color,
    width?: number,
    height?: number
  ) {
    if (typeof data === 'string') {
      this._image.src = data;
      this._data = null;
      this._textureSrc = data;
    } else if (data instanceof Color) {
      this._defaultColor = data;
      this._plainColor = true;
      this._data = null;
      this._height = 2;
      this._height = 2;
    } else {
      this._image.src = '';
      this._data = data || null;

      if (
        data instanceof Uint8Array &&
        width !== undefined &&
        height !== undefined
      ) {
        this._width = width;
        this._height = height;
      }
    }

    this.needsUpload = true;
  }

  onLoad(callbackFn: () => void) {
    this._callbackFn = callbackFn;
  }

  public static fromJSON(raw: TextureSerialized): Texture {
    const { data, ...props } = raw;

    if (data === null) {
      return new Texture({}, props);
    } else if (Object.hasOwn(data, 'url')) {
      const url = (
        data as {
          url: string;
        }
      ).url;

      return new Texture({ data: url }, props);
    } else if (Object.hasOwn(data, 'r')) {
      const color = data as ColorSerialized;
      return new Texture({ data: Color.fromJSON(color) }, props);
    }

    const buffer = data as { buffer: string; height: number; width: number };

    const array = toByteArray(buffer.buffer);

    return new Texture(
      {
        data: array,
        height: buffer.height,
        width: buffer.width
      },
      props
    );
  }

  public toJSON(): TextureSerialized {
    let data:
      | {
          url: string;
        }
      | { buffer: string; height: number; width: number }
      | ColorSerialized
      | null;

    if (this._data instanceof HTMLImageElement) {
      data = { url: this._data.src };
    } else if (this._textureSrc !== null) {
      data = { url: this._textureSrc };
    } else if (this._plainColor) {
      data = this.defaultColor.toJSON();
    } else if (this._data instanceof Uint8Array) {
      data = {
        buffer: fromByteArray(this._data),
        height: this._height,
        width: this._width
      };
    } else {
      data = this._data;
    }

    return {
      data,
      wrapS: this._wrapS,
      wrapT: this._wrapT,
      minFilter: this._minFilter,
      magFilter: this._magFilter,
      format: this._format,
      type: this._type
    };
  }
}
