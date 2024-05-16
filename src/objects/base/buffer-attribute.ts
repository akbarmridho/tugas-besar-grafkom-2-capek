import { Serializable } from './serializable.ts';
import { TypedArray, TypedArrayMap } from '@/interfaces/typed-array.ts';

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
  private _isDirty = true; // copy attributes at the start, at least once.
  public _buffer: WebGLBuffer | null = null;
  /**
   * Creates an instance of BufferAttribute
   * @param data
   * @param size
   * @param opt
   */
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

  // Getter, retrieves private variables.
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
  get isDirty() {
    return this._isDirty;
  }

  // Setter, sets private variables.
  set data(data: TypedArray) {
    this._data = data;
    this._isDirty = true;
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

  // Mark buffer as clean (No need for copying back to GPU);
  // Only called at setter attributes.
  consume() {
    this._isDirty = false;
  }

  // Retrive the length of a buffer & number of elements inside of said buffer.
  get length(): number {
    return this._data.length;
  }
  get count(): number {
    return this.length / this._size;
  }

  set(index: number, data: number[]) {
    // Sets elemen[index] with data, adjust it with offset and stride.

    if (data.length !== this._size) {
      throw new Error(
        `Data length does not match. Expect ${this.size} got ${data.length}`
      );
    }

    this._isDirty = true;
    index *= this._size;

    data.forEach((val, j) => {
      this.data[index + j] = val;
    });
  }

  get(index: number, size?: number) {
    // Takes elemen[index] into data, adjust it with offset and stride.
    index *= this._size;
    if (!size) {
      size = this._size;
    }

    return Array.from(this.data.slice(index, index + size));
  }

  toJSON(): BufferAttributeSerialized {
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
