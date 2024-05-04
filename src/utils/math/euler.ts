export class Euler {
  isEuler : boolean;
  private _x : number;
  private _y : number;
  private _z : number;
  private _order : string;
  static DEFAULT_ORDER : string = "XYZ";

  static clamp(val:number, min:number, max:number):number {
    return Math.max(min, Math.min(max, val));
  }

  constructor(x:number=0, y:number=0, z:number=0, order:string=Euler.DEFAULT_ORDER) {
    this.isEuler = true;
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get z(): number {
    return this._z;
  }

  get order(): string {
    return this._order;
  }

  set x(nilai: number) {
    this._x = nilai;
  }

  set y(nilai: number) {
    this._y = nilai;
  }

  set z(nilai: number) {
    this._z = nilai;
  }

  set order(nilai: string) {
    this._order = nilai;
  }

  set(x:number, y:number, z:number, order:string = this._order):this {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
    return this;
  }
  
  setRotMatrix(m: {elements:number[]}, order: string=this._order, update:boolean=true):this {
    const t: number[] = m.elements,
          m11: number = t[0], m12: number = t[3], m13: number = t[6],
          m21: number = t[1], m22: number = t[4], m23: number = t[7],
          m31: number = t[2], m32: number = t[5], m33: number = t[8];

    switch (order) {
      case "XYZ":
        this._y = Math.asin(Euler.clamp(m13, -1, 1));
        if (Math.abs(m13) < 1) {
          this._x = Math.atan2(-m23, m33); this._z = Math.atan2(-m12, m11);
        } else {
          this._x = Math.atan2(m32, m22); this._z = 0;
        } break;

      case "XZY":
        this._z = Math.asin(-1 * (Euler.clamp(m12, -1, 1)));
        if (Math.abs(m12) < 1) {
          this._x = Math.atan2(m32, m22); this._y = Math.atan2(m13, m11);
        } else {
          this._x = Math.atan2(-m23, m33); this._y = 0;
        } break;

      case "YXZ":
        this._x = Math.asin(-1 * (Euler.clamp(m23, -1, 1)));
        if (Math.abs(m23) < 1) {
          this._y = Math.atan2(m13, m33); this._z = Math.atan2(m21, m22);
        } else {
          this._y = Math.atan2(-m31, m11); this._z = 0;
        } break;

      case "YZX":
        this._z = Math.asin(Euler.clamp(m21, -1, 1));
        if (Math.abs(m21) < 1) {
          this._x = Math.atan2(-m23, m22); this._y = Math.atan2(-m31, m11);
        } else {
          this._x = 0; this._y = Math.atan2(m13, m33);
        } break;

      case "ZXY":
        this._x = Math.asin(Euler.clamp(m32, -1, 1));
        if (Math.abs(m32) < 1) {
          this._y = Math.atan2(-m31, m33); this._z = Math.atan2(-m12, m22);
        } else {
          this._y = 0; this._z = Math.atan2(m21, m11);
        } break;

      case "ZYX":
        this._y = Math.asin(-1 * (Euler.clamp(m31, -1, 1)));
        if (Math.abs(m31) < 1) {
          this._x = Math.atan2(m32, m33); this._z = Math.atan2(m21, m11);
        } else {
          this._x = 0; this._z = Math.atan2(-m12, m22);
        } break;

      default:
        console.warn("Unknown order: "+ order);
    }
    this._order = order;
    return this;
  }

  // setQuaternion (butuh matrix4.ts)

  setVec3(v: {x:number, y:number, z:number}, order:string = this._order):this {
    return this.set(v.x, v.y, v.z, order);
  }

  // reorder (butuh quaternion.ts)

  clone(): Euler {
    return new Euler(this._x, this._y, this._z, this._order);
  }

  copy(euler:Euler):void {
    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;
  }

  isEqual(euler:Euler):boolean {
    return ((euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order));
  }

  ArrayToEuler(array:[number, number, number, string?]):this {
    this._x = array[0];
    this._y = array[1];
    this._z = array[2];
    this._order = array[3] || Euler.DEFAULT_ORDER;

    return this;
  }

  EulerToArray(array:[number, number, number, string]=[0, 0, 0, Euler.DEFAULT_ORDER], n:number=0):[number, number, number, string] {
    array[n] = this._x;
    array[n+1] = this._y;
    array[n+2] = this._z;
    array[n+3] = this._order;

    return array;
  }

  *[Symbol.iterator]():IterableIterator<number|string> {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._order;
  }

}
