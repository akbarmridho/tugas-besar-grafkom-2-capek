import { Camera } from '@/objects/base/camera.ts';

export class OrbitControl {
  camera: Camera;

  private rotateStart: { x: number; y: number } | null = null;
  private leftRotationValue: number = 0;
  private upRotationValue: number = 0;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  update() {
    const scene = this.camera.parent;

    if (scene === null) {
      return;
    }

    const rotation = scene.rotation.clone();

    rotation.y += this.leftRotationValue;
    rotation.x += this.upRotationValue;
    rotation.x = Math.max(
      -Math.PI / 2 + 0.000001,
      Math.min(Math.PI / 2 - 0.000001, rotation.x)
    );

    scene.setFromEulerRotation(rotation);
    scene.updateWorldMatrix();
  }

  public handleMouseDownRotate(pos: { x: number; y: number }) {
    this.rotateStart = { ...pos };
  }

  public handleMouseUpRotate() {
    this.rotateStart = null;
  }

  public handleMouseMoveRotate(pos: { x: number; y: number }): boolean {
    if (this.rotateStart === null) return false;

    const rotateDelta = {
      x: pos.x - this.rotateStart.x,
      y: pos.y - this.rotateStart.y
    };

    this.leftRotationValue = (2 * Math.PI * rotateDelta.x) / 800;
    this.upRotationValue = (2 * Math.PI * rotateDelta.y) / 800;
    this.rotateStart = { ...pos };

    this.update();
    return true;
  }
}
