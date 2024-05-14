import { Matrix4 } from '../../utils/math/matrix4';
import { Node } from '../node'; 

class Camera extends Node {
    matrixWorldInverse: Matrix4;
    projectionMatrix: Matrix4;
    projectionMatrixInverse: Matrix4;

    constructor() {
        super();
        this.matrixWorldInverse = new Matrix4([]);
        this.projectionMatrix = new Matrix4([]); 
        this.projectionMatrixInverse = new Matrix4([]);
    }

    // getWorldDirection(target?: Vector3): Vector3 {
    //     return super.getWorldDirection(target).negate();
    // }


    updateWorldMatrix(updateParents?: boolean, updateChildren?: boolean): void {
        super.updateWorldMatrix(updateParents, updateChildren);
        this.matrixWorldInverse.copy().inverse();
    }

}

export { Camera };
