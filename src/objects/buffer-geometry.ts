import { BufferAttribute } from './buffer-attribute.ts';
import { Serializable } from './serializable.ts';

export interface BufferGeometrySerialized {
  attributes: { [name: string]: BufferAttribute };
  indices?: BufferAttribute;
}

export class BufferGeometry extends Serializable<BufferGeometrySerialized> {
  private _attributes: { [name: string]: BufferAttribute };
  private _indices?: BufferAttribute;

  constructor(
    attributes: { [name: string]: BufferAttribute } = {},
    indices?: BufferAttribute
  ) {
    super();
    this._attributes = attributes;
    this._indices = indices;
  }

  get attributes() {
    return this._attributes;
  }
  get indices(): BufferAttribute | undefined {
    return this._indices;
  }

  set attributes(attributes: { [name: string]: BufferAttribute }) {
    this._attributes = attributes;
  }
  set indices(indices: BufferAttribute) {
    this._indices = indices;
  }

  getAttribute(name: string) {
    return this._attributes[name];
  }
  setAttribute(name: string, attribute: BufferAttribute) {
    this._attributes[name] = attribute;
  }

  deleteAttribute(name: string) {
    delete this._attributes[name];
    return this;
  }

  removeIndices() {
    this._indices = undefined;
    return this;
  }

  calculateNormal(newAttribute = false) {
    const pos = this.getAttribute('position');
    let norm = this.getAttribute('normal');
    if (!pos) {
      return;
    }
    if (newAttribute || !norm) {
      norm = new BufferAttribute(new Float32Array(pos.length), pos.size);
    }
    this.setAttribute('normal', norm);
  }

  toJSON(): BufferGeometrySerialized {
    return {
      attributes: this._attributes,
      indices: this._indices
    };
  }

  public static fromJSON(raw: BufferGeometrySerialized): BufferGeometry {
    return new BufferGeometry(raw.attributes, raw.indices);
  }
}
  //public static fromJSON(raw: BufferAttributeSerialized): BufferAttribute {
  //  const data = new TypedArrayMap[raw.data.type as keyof typeof TypedArrayMap](
  //    raw.data.data
  //  );
//
  //  return new BufferAttribute(data, raw.size, {
  //    dtype: raw.dtype,
  //    normalize: raw.normalize,
  //    stride: raw.stride,
  //    offset: raw.offset
  //  });
