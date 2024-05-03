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
  
  // setRotMatrix

  // setQuaternion

  setVec3(v: {x:number, y:number, z:number}, order:string = this._order):this {
    return this.set(v.x, v.y, v.z, order);
  }

  // reorder

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
