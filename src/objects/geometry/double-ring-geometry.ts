import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Spherical } from '@/utils/math/spherical.ts';
import {
  quadFromCoord,
  quadFromCoordExtrapolated,
  quadFromPoints
} from '@/utils/coordinates.ts';
import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { degreeToRadian } from '@/utils/math/angle.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Quaternion } from '@/utils/math/quaternion.ts';

export class DoubleRingGeometry extends BufferGeometry<BufferGeometrySerialized> {
  public constructor() {
    const ringRadius = 0.5;
    const ringHeight = 0.1;
    const ringThickness = 0.05;

    const xzRingCenter = -0.25;
    const xyRingCenter = 0.25;

    const nSegment = 36;

    const positions: number[] = [];
    const uvs: number[] = [];

    // create xz ring
    const innerResult = new Vector3();
    const outerResult = new Vector3();
    const innerSphere = new Spherical(ringRadius);
    innerSphere.setFromCartesianCoordinates(ringRadius, 0, 0);
    const outerSphere = new Spherical(ringRadius + ringThickness);
    outerSphere.setFromCartesianCoordinates(ringRadius + ringThickness, 0, 0);

    for (let i = 0; i < nSegment; i++) {
      const degree = 360 / nSegment;

      innerResult.setFromSpherical(innerSphere);
      const baseInner = [
        innerResult.x + xzRingCenter,
        innerResult.y,
        innerResult.z
      ];
      outerResult.setFromSpherical(outerSphere);
      const baseOuter = [
        outerResult.x + xzRingCenter,
        outerResult.y,
        outerResult.z
      ];

      innerSphere.theta += degreeToRadian(degree);
      outerSphere.theta += degreeToRadian(degree);

      innerResult.setFromSpherical(innerSphere);
      const nextInner = [
        innerResult.x + xzRingCenter,
        innerResult.y,
        innerResult.z
      ];
      outerResult.setFromSpherical(outerSphere);
      const nextOuter = [
        outerResult.x + xzRingCenter,
        outerResult.y,
        outerResult.z
      ];

      const tA = [nextOuter[0], nextOuter[1] + ringHeight / 2, nextOuter[2]];
      const tB = [nextInner[0], nextInner[1] + ringHeight / 2, nextInner[2]];
      const tC = [baseInner[0], baseInner[1] + ringHeight / 2, baseInner[2]];
      const tD = [baseOuter[0], baseOuter[1] + ringHeight / 2, baseOuter[2]];

      const bA = [nextOuter[0], nextOuter[1] - ringHeight / 2, nextOuter[2]];
      const bB = [nextInner[0], nextInner[1] - ringHeight / 2, nextInner[2]];
      const bC = [baseInner[0], baseInner[1] - ringHeight / 2, baseInner[2]];
      const bD = [baseOuter[0], baseOuter[1] - ringHeight / 2, baseOuter[2]];

      const tTopLeft = [0, 0];
      const tBottomLeft = [0, 1];
      const tTopRight = [1, 0];
      const tBottomRight = [1, 1];

      const faceTexCoord = quadFromCoord(
        tTopLeft,
        tBottomLeft,
        tBottomRight,
        tTopRight
      );

      positions.push(
        ...quadFromPoints(tA, tB, tC, tD),
        ...quadFromPoints(bA, bD, bC, bB),
        ...quadFromPoints(tB, bB, bC, tC),
        ...quadFromPoints(tA, tD, bD, bA)
      );
      uvs.push(
        ...faceTexCoord,
        ...faceTexCoord,
        ...faceTexCoord,
        ...faceTexCoord
      );
    }

    for (let i = 0; i < nSegment; i++) {
      const degree = 360 / nSegment;

      innerResult.setFromSpherical(innerSphere);
      const baseInner = [
        innerResult.x + xyRingCenter,
        innerResult.y,
        innerResult.z
      ];
      outerResult.setFromSpherical(outerSphere);
      const baseOuter = [
        outerResult.x + xyRingCenter,
        outerResult.y,
        outerResult.z
      ];

      innerSphere.theta += degreeToRadian(degree);
      outerSphere.theta += degreeToRadian(degree);

      innerResult.setFromSpherical(innerSphere);
      const nextInner = [
        innerResult.x + xyRingCenter,
        innerResult.y,
        innerResult.z
      ];
      outerResult.setFromSpherical(outerSphere);
      const nextOuter = [
        outerResult.x + xyRingCenter,
        outerResult.y,
        outerResult.z
      ];

      const rotation = new Euler(degreeToRadian(90));
      const quat = new Quaternion();
      quat.fromEuler(rotation);

      const tA = new Vector3(
        ...[nextOuter[0], nextOuter[1] + ringHeight / 2, nextOuter[2]]
      )
        .applyQuaternion(quat)
        .toArray();
      const tB = new Vector3(
        ...[nextInner[0], nextInner[1] + ringHeight / 2, nextInner[2]]
      )
        .applyQuaternion(quat)
        .toArray();
      const tC = new Vector3(
        ...[baseInner[0], baseInner[1] + ringHeight / 2, baseInner[2]]
      )
        .applyQuaternion(quat)
        .toArray();
      const tD = new Vector3(
        ...[baseOuter[0], baseOuter[1] + ringHeight / 2, baseOuter[2]]
      )
        .applyQuaternion(quat)
        .toArray();

      const bA = new Vector3(
        ...[nextOuter[0], nextOuter[1] - ringHeight / 2, nextOuter[2]]
      )
        .applyQuaternion(quat)
        .toArray();

      const bB = new Vector3(
        ...[nextInner[0], nextInner[1] - ringHeight / 2, nextInner[2]]
      )
        .applyQuaternion(quat)
        .toArray();

      const bC = new Vector3(
        ...[baseInner[0], baseInner[1] - ringHeight / 2, baseInner[2]]
      )
        .applyQuaternion(quat)
        .toArray();

      const bD = new Vector3(
        ...[baseOuter[0], baseOuter[1] - ringHeight / 2, baseOuter[2]]
      )
        .applyQuaternion(quat)
        .toArray();

      const tTopLeft = [0, 0];
      const tBottomLeft = [0, 1];
      const tTopRight = [1, 0];
      const tBottomRight = [1, 1];

      const faceTexCoord = quadFromCoord(
        tTopLeft,
        tBottomLeft,
        tBottomRight,
        tTopRight
      );

      positions.push(
        ...quadFromPoints(tA, tB, tC, tD),
        ...quadFromPoints(bA, bD, bC, bB),
        ...quadFromPoints(tB, bB, bC, tC),
        ...quadFromPoints(tA, tD, bD, bA)
      );
      uvs.push(
        ...faceTexCoord,
        ...faceTexCoord,
        ...faceTexCoord,
        ...faceTexCoord
      );
    }

    super({
      position: new BufferAttribute(new Float32Array(positions), 3),
      texcoord: new BufferAttribute(new Float32Array(uvs), 2)
    });
  }

  toJSON(): BufferGeometrySerialized {
    const data = {
      attributes: {}
    } as BufferGeometrySerialized;

    for (const key of Object.keys(this.attributes)) {
      const value = this.attributes[key];

      if (value) {
        if (value instanceof BufferAttribute) {
          data.attributes[key] = value.toJSON();
        } else {
          // @ts-ignore
          data.attributes[key] = value;
        }
      }
    }

    return data;
  }
}
