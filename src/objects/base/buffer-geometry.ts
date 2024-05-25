import { Vector2 } from '@/utils/math/vector2.ts';
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
  tangent: BufferAttribute;
  bitangent: BufferAttribute;
}

export interface BufferGeometrySerialized {
  attributes: {
    position: BufferAttributeSerialized;
    normal?: BufferAttributeSerialized;
    texcoord?: BufferAttributeSerialized;
    tangent?: BufferAttribute;
    bitangent?: BufferAttribute;
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

    let tempNormal: BufferAttribute;

    if (attributes.normal) {
      this.hasDefaultNormal = true;
      tempNormal = attributes.normal;
    } else {
      this.hasDefaultNormal = false;
      tempNormal = new BufferAttribute(
        new Float32Array(attributes.position.length),
        attributes.position.size
      );
      this._computeNormal(attributes.position, tempNormal);
    }

    let tangent = new BufferAttribute(
      new Float32Array(attributes.position.length),
      attributes.position.size
    );
    let bitangent = new BufferAttribute(
      new Float32Array(attributes.position.length),
      attributes.position.size
    );

    if (attributes.texcoord) {
      this._computeTangentBitangent(
        attributes.position,
        attributes.texcoord,
        tangent,
        bitangent
      );
    }

    this._attributes = {
      position: attributes.position,
      texcoord: attributes.texcoord,
      normal: tempNormal,
      tangent: tangent,
      bitangent: bitangent
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

  _computeNormal(position: BufferAttribute, tempNormal: BufferAttribute) {
    const vA = new Vector3();
    const vB = new Vector3();

    for (let i = 0; i < position.count; i += 3) {
      const p1 = position.get(i);
      const p2 = position.get(i + 1);
      const p3 = position.get(i + 2);

      vA.fromArray(p1).subArray(p2);
      vB.fromArray(p3).subArray(p2);

      const n = vB.cross(vA);

      tempNormal.set(i, n.toArray());
      tempNormal.set(i + 1, n.toArray());
      tempNormal.set(i + 2, n.toArray());
    }
  }

  _computeTangentBitangent(
    position: BufferAttribute,
    texcoord: BufferAttribute,
    tangent: BufferAttribute,
    bitangent: BufferAttribute
  ) {
    const tangentVec = new Vector3();
    const bitangentVec = new Vector3();

    const edge1 = new Vector3();
    const edge2 = new Vector3();
    const deltaUV1 = new Vector2();
    const deltaUV2 = new Vector2();

    for (let i = 0; i < position.count; i += 3) {
      const p1 = position.get(i);
      const p2 = position.get(i + 1);
      const p3 = position.get(i + 2);

      const uv1 = texcoord.get(i);
      const uv2 = texcoord.get(i + 1);
      const uv3 = texcoord.get(i + 2);

      edge1.fromArray([p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]);
      edge2.fromArray([p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]]);

      deltaUV1.fromArray([uv2[0] - uv1[0], uv2[1] - uv1[1]]);
      deltaUV2.fromArray([uv3[0] - uv1[0], uv3[1] - uv1[1]]);

      // prettier-ignore
      const f = 1.0 / (deltaUV1.getComponent(0) * deltaUV2.getComponent(1) - deltaUV2.getComponent(0) * deltaUV1.getComponent(1));

      tangentVec.setComponents(
        f *
          (deltaUV2.getComponent(1) * edge1.getComponent(0) -
            deltaUV1.getComponent(1) * edge2.getComponent(0)),
        f *
          (deltaUV2.getComponent(1) * edge1.getComponent(1) -
            deltaUV1.getComponent(1) * edge2.getComponent(1)),
        f *
          (deltaUV2.getComponent(1) * edge1.getComponent(2) -
            deltaUV1.getComponent(1) * edge2.getComponent(2))
      );

      bitangentVec.setComponents(
        f *
          (deltaUV2.getComponent(0) * edge1.getComponent(0) +
            deltaUV1.getComponent(0) * edge2.getComponent(0)),
        f *
          (deltaUV2.getComponent(0) * edge1.getComponent(1) +
            deltaUV1.getComponent(0) * edge2.getComponent(1)),
        f *
          (deltaUV2.getComponent(0) * edge1.getComponent(2) +
            deltaUV1.getComponent(0) * edge2.getComponent(2))
      );

      tangent.set(i, tangentVec.toArray());
      tangent.set(i + 1, tangentVec.toArray());
      tangent.set(i + 2, tangentVec.toArray());

      bitangent.set(i, bitangentVec.toArray());
      bitangent.set(i + 1, bitangentVec.toArray());
      bitangent.set(i + 2, bitangentVec.toArray());
    }
  }
}
