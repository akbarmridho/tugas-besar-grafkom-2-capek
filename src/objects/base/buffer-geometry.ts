import {
  BufferAttribute,
  BufferAttributeSerialized
} from './buffer-attribute.ts';
import { Serializable } from './serializable.ts';
import { AttributeObject } from '@/interfaces/attribute-properties.ts';
import { Vector3 } from '@/utils/math/vector3.ts';

export interface BaseBufferGeometryAttribute extends AttributeObject {
  position: BufferAttribute;
  normal: BufferAttribute;
  texcoord?: BufferAttribute;
}

export interface BufferGeometrySerialized {
  attributes: {
    position: BufferAttributeSerialized;
    normal?: BufferAttributeSerialized;
    texcoord?: BufferAttributeSerialized;
  } & Partial<{ [attr: string]: BufferAttributeSerialized }>;
}

export abstract class BufferGeometry<
  // @ts-ignore
  T extends BufferGeometrySerialized = unknown
> extends Serializable<T> {
  protected _attributes: BaseBufferGeometryAttribute;
  protected hasDefaultNormal: boolean;

  protected constructor(attributes: {
    position: BufferAttribute;
    normal?: BufferAttribute;
    texcoord?: BufferAttribute;
  }) {
    super();

    let normal: BufferAttribute;

    if (attributes.normal) {
      this.hasDefaultNormal = true;
      normal = attributes.normal;
    } else {
      this.hasDefaultNormal = false;
      normal = new BufferAttribute(
        new Float32Array(attributes.position.length),
        attributes.position.size
      );
    }

    this._computeNormal(attributes.position, normal);

    this._attributes = {
      position: attributes.position,
      texcoord: attributes.texcoord,
      normal: normal
    };
  }

  get attributes() {
    return this._attributes;
  }

  set attributes(attributes: BaseBufferGeometryAttribute) {
    this._attributes = attributes;
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

  calculateNormal(newAttribute = false) {
    const position = this.attributes.position;

    let normal: BufferAttribute;

    if (newAttribute) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    } else {
      normal = this.attributes.normal;
    }

    this._computeNormal(position, normal);

    this.attributes.normal = normal;
  }

  _computeNormal(position: BufferAttribute, normal: BufferAttribute) {
    const vA = new Vector3();
    const vB = new Vector3();

    for (let i = 0; i < position.count; i += 3) {
      const p1 = position.get(i);
      const p2 = position.get(i + 1);
      const p3 = position.get(i + 2);

      vA.fromArray(p1).subArray(p2);
      vB.fromArray(p3).subArray(p2);

      const n = vB.cross(vA);

      normal.set(i, n.toArray());
      normal.set(i + 1, n.toArray());
      normal.set(i + 2, n.toArray());
    }
  }
}
