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

export interface TubeGeometryProps {}
export type TubeGeometrySerialized = BufferGeometrySerialized & TubeGeometryProps;

export class TubeGeometry extends BufferGeometry<TubeGeometrySerialized> {
    public constructor() {
        const ringRadius = 0.5;
        const ringHeight = 0.1;
        const ringThickness = 0.05;
        const wallThickness = 0.05;
    
        const nSegment = 36;
    
        const positions: number[] = [];
        const uvs: number[] = [];
    
        const createHollowRing = (ringCenterX: number, ringCenterY: number, rotation: number) => {
          const innerResult = new Vector3();
          const outerResult = new Vector3();
          const innerSphere = new Spherical(ringRadius);
          innerSphere.setFromCartesianCoordinates(ringRadius, 0, 0);
          const outerSphere = new Spherical(ringRadius + ringThickness);
          outerSphere.setFromCartesianCoordinates(ringRadius + ringThickness, 0, 0);
    
          const innerInnerSphere = new Spherical(ringRadius - wallThickness);
          innerInnerSphere.setFromCartesianCoordinates(ringRadius - wallThickness, 0, 0);
          const outerOuterSphere = new Spherical(ringRadius + ringThickness + wallThickness);
          outerOuterSphere.setFromCartesianCoordinates(ringRadius + ringThickness + wallThickness, 0, 0);
    
          for (let i = 0; i < nSegment; i++) {
            const degree = 360 / nSegment;
    
            innerResult.setFromSpherical(innerSphere);
            const baseInner = [
              innerResult.x + ringCenterX,
              innerResult.y,
              innerResult.z
            ];
            outerResult.setFromSpherical(outerSphere);
            const baseOuter = [
              outerResult.x + ringCenterX,
              outerResult.y,
              outerResult.z
            ];
    
            const baseInnerInner = [
              new Vector3().setFromSpherical(innerInnerSphere).x + ringCenterX,
              new Vector3().setFromSpherical(innerInnerSphere).y,
              new Vector3().setFromSpherical(innerInnerSphere).z
            ];
            const baseOuterOuter = [
              new Vector3().setFromSpherical(outerOuterSphere).x + ringCenterX,
              new Vector3().setFromSpherical(outerOuterSphere).y,
              new Vector3().setFromSpherical(outerOuterSphere).z
            ];
    
            innerSphere.theta += degreeToRadian(degree);
            outerSphere.theta += degreeToRadian(degree);
            innerInnerSphere.theta += degreeToRadian(degree);
            outerOuterSphere.theta += degreeToRadian(degree);
    
            innerResult.setFromSpherical(innerSphere);
            const nextInner = [
              innerResult.x + ringCenterX,
              innerResult.y,
              innerResult.z
            ];
            outerResult.setFromSpherical(outerSphere);
            const nextOuter = [
              outerResult.x + ringCenterX,
              outerResult.y,
              outerResult.z
            ];
    
            const nextInnerInner = [
              new Vector3().setFromSpherical(innerInnerSphere).x + ringCenterX,
              new Vector3().setFromSpherical(innerInnerSphere).y,
              new Vector3().setFromSpherical(innerInnerSphere).z
            ];
            const nextOuterOuter = [
              new Vector3().setFromSpherical(outerOuterSphere).x + ringCenterX,
              new Vector3().setFromSpherical(outerOuterSphere).y,
              new Vector3().setFromSpherical(outerOuterSphere).z
            ];
    
            const rotationEuler = new Euler(degreeToRadian(rotation));
            const rotationQuat = new Quaternion();
            rotationQuat.fromEuler(rotationEuler);
    
            const tA = new Vector3(...[nextOuter[0], nextOuter[1] + ringHeight / 2, nextOuter[2]]).applyQuaternion(rotationQuat).toArray();
            const tB = new Vector3(...[nextInner[0], nextInner[1] + ringHeight / 2, nextInner[2]]).applyQuaternion(rotationQuat).toArray();
            const tC = new Vector3(...[baseInner[0], baseInner[1] + ringHeight / 2, baseInner[2]]).applyQuaternion(rotationQuat).toArray();
            const tD = new Vector3(...[baseOuter[0], baseOuter[1] + ringHeight / 2, baseOuter[2]]).applyQuaternion(rotationQuat).toArray();
    
            const tE = new Vector3(...[nextOuterOuter[0], nextOuterOuter[1] + ringHeight / 2, nextOuterOuter[2]]).applyQuaternion(rotationQuat).toArray();
            const tF = new Vector3(...[nextInnerInner[0], nextInnerInner[1] + ringHeight / 2, nextInnerInner[2]]).applyQuaternion(rotationQuat).toArray();
            const tG = new Vector3(...[baseInnerInner[0], baseInnerInner[1] + ringHeight / 2, baseInnerInner[2]]).applyQuaternion(rotationQuat).toArray();
            const tH = new Vector3(...[baseOuterOuter[0], baseOuterOuter[1] + ringHeight / 2, baseOuterOuter[2]]).applyQuaternion(rotationQuat).toArray();
    
            const bA = new Vector3(...[nextOuter[0], nextOuter[1] - ringHeight / 2, nextOuter[2]]).applyQuaternion(rotationQuat).toArray();
            const bB = new Vector3(...[nextInner[0], nextInner[1] - ringHeight / 2, nextInner[2]]).applyQuaternion(rotationQuat).toArray();
            const bC = new Vector3(...[baseInner[0], baseInner[1] - ringHeight / 2, baseInner[2]]).applyQuaternion(rotationQuat).toArray();
            const bD = new Vector3(...[baseOuter[0], baseOuter[1] - ringHeight / 2, baseOuter[2]]).applyQuaternion(rotationQuat).toArray();
    
            const bE = new Vector3(...[nextOuterOuter[0], nextOuterOuter[1] - ringHeight / 2, nextOuterOuter[2]]).applyQuaternion(rotationQuat).toArray();
            const bF = new Vector3(...[nextInnerInner[0], nextInnerInner[1] - ringHeight / 2, nextInnerInner[2]]).applyQuaternion(rotationQuat).toArray();
            const bG = new Vector3(...[baseInnerInner[0], baseInnerInner[1] - ringHeight / 2, baseInnerInner[2]]).applyQuaternion(rotationQuat).toArray();
            const bH = new Vector3(...[baseOuterOuter[0], baseOuterOuter[1] - ringHeight / 2, baseOuterOuter[2]]).applyQuaternion(rotationQuat).toArray();

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
          ...quadFromPoints(tA, tD, bD, bA), 

          ...quadFromPoints(tE, tF, tG, tH), 
          ...quadFromPoints(bE, bH, bG, bF),
          ...quadFromPoints(tF, bF, bG, tG), 
          ...quadFromPoints(tE, tH, bH, bE), 

          ...quadFromPoints(tA, tE, bE, bA),
          ...quadFromPoints(tB, tF, bF, bB), 
          ...quadFromPoints(tC, tG, bG, bC), 
          ...quadFromPoints(tD, tH, bH, bD)  
        );
        uvs.push(
          ...faceTexCoord,
          ...faceTexCoord,
          ...faceTexCoord,
          ...faceTexCoord,

          ...faceTexCoord,
          ...faceTexCoord,
          ...faceTexCoord,
          ...faceTexCoord,

          ...faceTexCoord,
          ...faceTexCoord,
          ...faceTexCoord,
          ...faceTexCoord
        );
      }
    };

    createHollowRing(-0.25, 0, 0);
    createHollowRing(0.25, 0, 90);
    createHollowRing(0, -0.25, 0); 
    createHollowRing(0, 0.25, 90);
    createHollowRing(-0.25, -0.25, 0); 
    createHollowRing(-0.25, 0.25, 90);
    createHollowRing(0.25, -0.25, 90); 
    createHollowRing(0.25, 0.25, 0);

        super({
          position: new BufferAttribute(new Float32Array(positions), 3),
          texcoord: new BufferAttribute(new Float32Array(), 2)
        });
  }

  public toJSON(withNodeAttributes: boolean = true): TubeGeometrySerialized {
    const data: TubeGeometrySerialized = {} as TubeGeometrySerialized;

    if (withNodeAttributes) {
      // @ts-ignore
      data.attributes = {};

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
    }

    return data;
  }

  public static fromJSON(data: TubeGeometryProps): TubeGeometry {
    return new TubeGeometry();
  }
}
