import { Scene } from '@/objects/scene.ts';
import { AnimationClip } from '@/interfaces/animation.ts';

export class AnimationRunner {
  private _isPlaying: boolean = false;
  private _fps: number;

  private _root: Scene;
  private _currentFrame: number = 0;
  private _deltaFrame: number = 0;
  private _currentAnimation?: AnimationClip;

  constructor(root: Scene, fps: number, animation?: AnimationClip) {
    this._root = root;
    this._fps = fps;
    this._currentAnimation = animation;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  get length() {
    return this._currentAnimation!.frames.length;
  }

  private get frame() {
    return this._currentAnimation!.frames[this.currentFrame];
  }

  update(deltaSecond: number) {
    if (this._isPlaying) {
      this._deltaFrame += deltaSecond * this._fps;
      if (this._deltaFrame >= 1) {
        // 1 frame
        this._currentFrame =
          (this._currentFrame + Math.floor(this._deltaFrame)) % this.length;
        this._deltaFrame %= 1;
        this.updateSceneGraph();
      }
    }
  }

  private updateSceneGraph() {
    // Update scene graph with current frame
    const frame = this.frame;
    // Use root as the parent and traverse according to the frame

    // todo
  }
}
