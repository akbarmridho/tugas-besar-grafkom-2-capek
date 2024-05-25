import {
  AnimationClip,
  AnimationPath,
  AnimationTRS
} from '@/interfaces/animation.ts';
import { TweenOption } from '@/utils/math/tweener.ts';

export class Tweener {
  private fn: TweenOption;
  private animationClip: AnimationClip;

  constructor(animationClip: AnimationClip, fn: TweenOption) {
    this.fn = fn;
    this.animationClip = animationClip;
  }

  private calculate(low: number, high: number, t: number) {
    const factor = this.fn.fn(t);
    return low + (high - low) * factor;
  }

  private isTRSComplete(trs: AnimationTRS | undefined): boolean {
    return !!(trs && trs.translation && trs.scale && trs.scale);
  }

  private isPathComplete(path: AnimationPath): boolean {
    if (!path.keyframe || !this.isTRSComplete(path.keyframe)) {
      return false;
    }

    if (path.children) {
      for (const key in Object.keys(path.children)) {
        if (!this.isPathComplete(path.children[key])) {
          return false;
        }
      }
    }

    return true;
  }

  private tweenTRS(
    start: AnimationTRS,
    end: AnimationTRS,
    t: number,
    existing: AnimationTRS = {}
  ): AnimationTRS {
    const result: AnimationTRS = { ...existing };

    if (start.translation && end.translation) {
      result.translation = result.translation || [
        this.calculate(start.translation[0], end.translation[0], t),
        this.calculate(start.translation[1], end.translation[1], t),
        this.calculate(start.translation[2], end.translation[2], t)
      ];
    }

    if (start.rotation && end.rotation) {
      result.rotation = result.rotation || [
        this.calculate(start.rotation[0], end.rotation[0], t),
        this.calculate(start.rotation[1], end.rotation[1], t),
        this.calculate(start.rotation[2], end.rotation[2], t)
      ];
    }

    if (start.scale && end.scale) {
      result.scale = result.scale || [
        this.calculate(start.scale[0], end.scale[0], t),
        this.calculate(start.scale[1], end.scale[1], t),
        this.calculate(start.scale[2], end.scale[2], t)
      ];
    }

    return result;
  }

  private tweenPath(
    start: AnimationPath,
    end: AnimationPath,
    t: number,
    existing: AnimationPath = {}
  ): AnimationPath {
    const result: AnimationPath = { ...existing };

    if (start.keyframe && end.keyframe) {
      result.keyframe = this.tweenTRS(start.keyframe, end.keyframe, t);
    }

    if (start.children && end.children) {
      result.children = result.children || {};

      for (const key in Object.keys(start.children)) {
        if (Object.hasOwn(end.children, key)) {
          result.children[key] = this.tweenPath(
            start.children[key],
            end.children[key],
            t,
            existing.children?.[key]
          );
        }
      }
    }

    return result;
  }

  public tweenClip(): AnimationClip {
    const result = structuredClone(this.animationClip);

    const frames = result.frames;

    for (let i = 0; i < frames.length; i++) {
      if (this.isPathComplete(frames[i])) continue;

      let prevFrameIndex = i - 1;

      while (
        prevFrameIndex >= 0 &&
        !this.isPathComplete(frames[prevFrameIndex])
      ) {
        prevFrameIndex--;
      }

      let nextFrameIndex = i + 1;
      while (
        nextFrameIndex < frames.length &&
        !this.isPathComplete(frames[nextFrameIndex])
      ) {
        nextFrameIndex++;
      }

      if (prevFrameIndex >= 0 && nextFrameIndex < frames.length) {
        const t = (i - prevFrameIndex) / (nextFrameIndex - prevFrameIndex);
        frames[i] = this.tweenPath(
          frames[prevFrameIndex],
          frames[nextFrameIndex],
          t,
          frames[i]
        );
      } else if (nextFrameIndex < frames.length) {
        frames[i] = this.tweenPath(
          frames[i],
          frames[nextFrameIndex],
          0,
          frames[i]
        );
      }
    }

    return result;
  }
}
