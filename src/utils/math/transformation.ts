import { Vector3 } from './vector3.ts';
import { Matrix4 } from './matrix4.ts';

export class Transformation {
  /**
   * Create a lookAt matrix
   * This is a world matrix for a camera. In other worlds, it will transform
   * from the origin to a place and orientation in the world. For a view
   * matrix take the inverse of this
   * @param cameraPosition
   * @param target
   * @param up
   */
  public static lookAt(
    cameraPosition: Vector3,
    target: Vector3,
    up: Vector3
  ): Matrix4 {
    const zAxis = cameraPosition.subVector(target).normalize();
    const xAxis = up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis).normalize();

    // prettier-ignore
    return new Matrix4([
        xAxis.getComponent(0), yAxis.getComponent(0), zAxis.getComponent(0), cameraPosition.getComponent(0),
        xAxis.getComponent(1), yAxis.getComponent(1), zAxis.getComponent(1), cameraPosition.getComponent(1),
        xAxis.getComponent(2), yAxis.getComponent(2), zAxis.getComponent(2), cameraPosition.getComponent(2),
        0, 0, 0, 1
    ]);
  }

  /**
   * Compute a 4x4 pespective transformation matrix given the angular height
   * of the frustum, the aspect ratio, and the near and far clipping planes.
   * The arguments define a frustum extending in the negative z direction. The given
   * angle is the vertical angle of the frustum, and the horizontal angle is
   * determined to produce the given aspect ratio. The arguments near and far are the
   * distance to the near and far clipping planes. Note that near and far are not z coordinates,
   * but rather they are distances along the negative z-axis. The matrix generated sends the
   * viewing frustum to the unit box. We assume a unit box extending from -1 to 1 in the x and y
   * dimensions and from -1 to 1 in the z dimension.
   *
   * @param fieldOfViewInRadians field of view in y axis
   * @param aspect aspect of viewport (width / height)
   * @param near near Z clipping plane
   * @param far far far Z clipping plane
   */
  public static perspective(
    fieldOfViewInRadians: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (near - far);

    // prettier-ignore
    return new Matrix4([
        f/aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near+far)*rangeInv, near*far*rangeInv*2,
        0, 0, -1, 0
    ])
  }

  /**
   * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
   * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
   * generated sends that box to the unit box.  Note that although left and right
   * are x coordinates and bottom and top are y coordinates, near and far
   * are not z coordinates, but rather they are distances along the negative
   * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
   * dimensions and from -1 to 1 in the z dimension.
   * @param {number} left The x coordinate of the left plane of the box.
   * @param {number} right The x coordinate of the right plane of the box.
   * @param {number} bottom The y coordinate of the bottom plane of the box.
   * @param {number} top The y coordinate of the right plane of the box.
   * @param {number} near The negative z coordinate of the near plane of the box.
   * @param {number} far The negative z coordinate of the far plane of the box.
   */
  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    // prettier-ignore
    return new Matrix4([
        2/(right-left), 0, 0, (left+right) / (left-right),
        0, 2/(top-bottom), 0, (bottom+top) / (bottom-top),
        0, 0, 2/(near-far), (near+far) / (near-far),
        0, 0, 0, 1
    ])
  }

  /**
   * Computes a 4-by-4 perspective transformation matrix given the left, right,
   * top, bottom, near and far clipping planes. The arguments define a frustum
   * extending in the negative z direction. The arguments near and far are the
   * distances to the near and far clipping planes. Note that near and far are not
   * z coordinates, but rather they are distances along the negative z-axis. The
   * matrix generated sends the viewing frustum to the unit box. We assume a unit
   * box extending from -1 to 1 in the x and y dimensions and from -1 to 1 in the z
   * dimension.
   * @param {number} left The x coordinate of the left plane of the box.
   * @param {number} right The x coordinate of the right plane of the box.
   * @param {number} bottom The y coordinate of the bottom plane of the box.
   * @param {number} top The y coordinate of the right plane of the box.
   * @param {number} near The negative z coordinate of the near plane of the box.
   * @param {number} far The negative z coordinate of the far plane of the box.
   */
  public static frustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    const dx = right - left;
    const dy = top - bottom;
    const dz = far - near;

    // prettier-ignore
    return new Matrix4([
        2*near/dx, 0, (left+right)/dx, 0,
        0, 2*near/dy, (top+bottom)/dy, 0,
        0, 0, -(far+near)/dz, -2*near*far/dz,
        0, 0, -1, 0
    ])
  }

  /**
   * Makes a translation matrix
   * @param {number} tx x translation.
   * @param {number} ty y translation.
   * @param {number} tz z translation.
   */
  public static translation(tx: number, ty: number, tz: number): Matrix4 {
    // prettier-ignore
    return new Matrix4([
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    ]);
  }

  /**
   * Make an x rotation matrix
   * @param angleInRadians amount to rotate
   */
  public static xRotation(angleInRadians: number): Matrix4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    // prettier-ignore
    return new Matrix4([
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1
    ]);
  }

  /**
   * Make an y rotation matrix
   * @param angleInRadians amount to rotate
   */
  public static yRotation(angleInRadians: number): Matrix4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    // prettier-ignore
    return new Matrix4([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    ]);
  }

  /**
   * Make an z rotation matrix
   * @param angleInRadians amount to rotate
   */
  public static zRotation(angleInRadians: number): Matrix4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    // prettier-ignore
    return new Matrix4([
        c, -s,  0, 0,
        s,  c,  0, 0,
        0,  0,  1, 0,
        0,  0,  0, 1
    ]);
  }

  /**
   * Makes an rotation matrix around an arbitrary axis
   * @param axis axis to rotate around
   * @param angleInRadians amount to rotate
   */
  public static axisRotation(axis: Vector3, angleInRadians: number): Matrix4 {
    const norm = axis.normalize();
    const x = norm.getComponent(0);
    const y = norm.getComponent(1);
    const z = norm.getComponent(2);

    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const omc = 1 - c;

    // prettier-ignore
    return new Matrix4([
        xx+(1-xx)*c, x*y*omc-z*s, x*z*omc+y*s, 0,
        x*y*omc+z*s, yy+(1-yy)*c, y*z*omc-x*s, 0,
        x*z*omc-y*s, y*z*omc+x*s, zz+(1-zz)*c, 0,
        0,           0,           0, 1,
    ])
  }

  /**
   * Makes a scale matrix
   * @param sx x scale.
   * @param sy y scale.
   * @param sz z scale.
   */
  public static scaling(sx: number, sy: number, sz: number): Matrix4 {
    // prettier-ignore
    return new Matrix4([
        sx,  0,  0,  0,
         0, sy,  0,  0,
         0,  0, sz,  0,
         0,  0,  0,  1,
    ])
  }

  // todo compose function
  // https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/m4.js#L1031

  // todo decompose
  // https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/m4.js#L1031
}
