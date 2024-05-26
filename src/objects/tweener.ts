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
    return !!trs && !!trs.scale && !!trs.translation && !!trs.rotation;
  }

  private isPathComplete(
    path: AnimationPath,
    expectMissingKeyFrame: boolean = false,
    expectHaveChildren: boolean = false
  ): boolean {
    if (
      !expectMissingKeyFrame &&
      (!path.keyframe || !this.isTRSComplete(path.keyframe))
    ) {
      return false;
    }

    if (path.children) {
      for (const key of Object.keys(path.children)) {
        if (!this.isPathComplete(path.children[key], false, false)) {
          return false;
        }
      }
    }

    if (expectHaveChildren && !path.children) {
      return false;
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
    } else if (start.translation) {
      result.translation = [...start.translation];
    } else if (end.translation) {
      result.translation = [...end.translation];
    }

    if (start.rotation && end.rotation) {
      result.rotation = result.rotation || [
        this.calculate(start.rotation[0], end.rotation[0], t),
        this.calculate(start.rotation[1], end.rotation[1], t),
        this.calculate(start.rotation[2], end.rotation[2], t)
      ];
    } else if (start.rotation) {
      result.rotation = [...start.rotation];
    } else if (end.rotation) {
      result.rotation = [...end.rotation];
    }

    if (start.scale && end.scale) {
      result.scale = result.scale || [
        this.calculate(start.scale[0], end.scale[0], t),
        this.calculate(start.scale[1], end.scale[1], t),
        this.calculate(start.scale[2], end.scale[2], t)
      ];
    } else if (start.scale) {
      result.scale = [...start.scale];
    } else if (end.scale) {
      result.scale = [...end.scale];
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
    } else if (start.keyframe) {
      result.keyframe = structuredClone(start.keyframe);
    } else if (end.keyframe) {
      result.keyframe = structuredClone(end.keyframe);
    }

    if (start.children && end.children) {
      result.children = result.children || {};

      for (const key of Object.keys(start.children)) {
        if (Object.hasOwn(end.children, key)) {
          result.children[key] = this.tweenPath(
            start.children[key],
            end.children[key],
            t,
            existing.children?.[key]
          );
        } else {
          result.children[key] = structuredClone(start.children[key]);
        }
      }

      for (const key of Object.keys(end.children)) {
        if (!Object.hasOwn(result.children, key)) {
          result.children[key] = structuredClone(end.children[key]);
        }
      }
    } else if (start.children) {
      result.children = structuredClone(start.children);
    } else if (end.children) {
      result.children = structuredClone(end.children);
    }

    return result;
  }

  public tweenClip(): AnimationClip {
    const result = structuredClone(this.animationClip);

    const frames = result.frames;

    let i = 0;

    while (i < frames.length) {
      if (this.isPathComplete(frames[i], true, true)) {
        i++;
        continue;
      }

      let prevFrameIndex = i - 1;

      while (
        prevFrameIndex >= 0 &&
        !this.isPathComplete(frames[prevFrameIndex], true, true)
      ) {
        prevFrameIndex--;
      }

      let nextFrameIndex = i + 1;
      while (
        nextFrameIndex < frames.length &&
        !this.isPathComplete(frames[nextFrameIndex], true, true)
      ) {
        nextFrameIndex++;
      }

      if (prevFrameIndex >= 0 && nextFrameIndex < frames.length) {
        const num = nextFrameIndex - prevFrameIndex;
        const t = (i - prevFrameIndex) / num;

        for (let j = 0; j < num; j++) {
          frames[i + j] = this.tweenPath(
            frames[prevFrameIndex],
            frames[nextFrameIndex],
            t * j,
            frames[i + j]
          );
        }

        i = nextFrameIndex;
      } else if (nextFrameIndex < frames.length) {
        for (let j = i; j < nextFrameIndex; j++) {
          frames[j] = this.tweenPath(
            frames[i],
            frames[nextFrameIndex],
            0,
            frames[j]
          );
        }
        i = nextFrameIndex;
      }
    }

    return result;
  }

  public static mergeAnimationPath(
    path1: AnimationPath,
    path2: AnimationPath
  ): AnimationPath {
    const mergedPath: AnimationPath = {};

    if (path1.keyframe || path2.keyframe) {
      mergedPath.keyframe = {
        ...path1.keyframe,
        ...path2.keyframe
      };
    }

    const childrenKeys = new Set<string>();

    if (path1.children || path2.children) {
      mergedPath.children = {};
    }

    if (path1.children) {
      Object.keys(path1.children).forEach((key) => childrenKeys.add(key));
    }

    if (path2.children) {
      Object.keys(path2.children).forEach((key) => childrenKeys.add(key));
    }

    childrenKeys.forEach((key) => {
      if (
        path1.children &&
        path1.children[key] &&
        path2.children &&
        path2.children[key]
      ) {
        mergedPath.children![key] = this.mergeAnimationPath(
          path1.children[key],
          path2.children[key]
        );
      } else if (path1.children && path1.children[key]) {
        mergedPath.children![key] = path1.children[key];
      } else if (path2.children && path2.children[key]) {
        mergedPath.children![key] = path2.children[key];
      }
    });

    return mergedPath;
  }
}
