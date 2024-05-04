import { Serializable } from './serializable.ts';
import { TypedArray, TypedArrayMap } from '../interfaces/typed-array.ts';

export interface BufferAttributeSerialized {
  data: {
    type: string;
    data: number[];
  };
  size: number;
  dtype: number;
  normalize: boolean;
  stride: number;
  offset: number;
}

export class BufferAttribute extends Serializable<BufferAttributeSerialized> {
  private _data: TypedArray;
  private _size: number;
  private _dtype: number;
  private _normalize = false;
  private _stride = 0;
  private _offset = 0;
  private _buffer: Float32Array | null = null;

  constructor(
    data: TypedArray,
    size: number,
    opt: {
      dtype?: number;
      normalize?: boolean;
      stride?: number;
      offset?: number;
    } = {}
  ) {
    super();
    this._data = data;
    this._size = size;
    this._dtype = opt.dtype || WebGLRenderingContext.FLOAT;
    this._normalize = opt.normalize || false;
    this._stride = opt.stride || 0;
    this._offset = opt.offset || 0;
  }

  get data() {
    return this._data;
  }
  get size() {
    return this._size;
  }
  get dtype() {
    return this._dtype;
  }
  get normalize() {
    return this._normalize;
  }
  get stride() {
    return this._stride;
  }
  get offset() {
    return this._offset;
  }

  set data(data: TypedArray) {
    this._data = data;
  }
  set size(size: number) {
    this._size = size;
  }
  set dtype(dtype: number) {
    this._dtype = dtype;
  }
  set normalize(normalize: boolean) {
    this._normalize = normalize;
  }
  set stride(stride: number) {
    this._stride = stride;
  }
  set offset(offset: number) {
    this._offset = offset;
  }

  get length(): number {
    return this._data.length;
  }
  get count(): number {
    return length / this._size;
  }

  private updateBuffer(): void {
    if (!this._buffer) {
      this._buffer = new Float32Array(this._data);
    }
  }

  set(id: number, data: number[]): void {
    id *= this._size;
    for (let i = 0; i < data.length; i++) {
      this._data[id + i] = data[i];
    }
    this._buffer = null;
  }

  get(id: number, size?: number): number[] {
    id *= this._size;
    if (!size) {
      size = this._size;
    }
    const data: number[] = [];
    this.updateBuffer();
    for (let i = 0; i < size; i++) {
      data.push(this._buffer![id + i]);
    }
    return data;
  }

  toJSON() {
    return {
      data: {
        type: this._data.constructor.name,
        data: Array.from(this._data)
      },
      size: this._size,
      dtype: this._dtype,
      normalize: this._normalize,
      stride: this._stride,
      offset: this._offset
    };
  }

  public static fromJSON(raw: BufferAttributeSerialized): BufferAttribute {
    const data = new TypedArrayMap[raw.data.type as keyof typeof TypedArrayMap](
      raw.data.data
    );

    return new BufferAttribute(data, raw.size, {
      dtype: raw.dtype,
      normalize: raw.normalize,
      stride: raw.stride,
      offset: raw.offset
    });
  }
}
