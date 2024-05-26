import { AnimationPath, AnimationTRS } from '@/interfaces/animation.ts';
import { TweenOption } from '@/utils/math/tweener.ts';

export class Tweener {
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

  public static tweenFrame(
    start: AnimationTRS,
    end: AnimationTRS,
    delta: number,
    fn: TweenOption
  ): AnimationTRS {
    let position: [number, number, number] | undefined;
    let rotation: [number, number, number] | undefined;
    let scale: [number, number, number] | undefined;

    if (!start.translation) {
      position = end.translation;
    } else if (!end.translation) {
      position = start.translation;
    } else {
      position = start.translation.map((el, i) => {
        return el + (end.translation![i] - el) * fn.fn(delta);
      }) as [number, number, number];
    }

    if (!start.rotation) {
      rotation = end.rotation;
    } else if (!end.rotation) {
      rotation = start.rotation;
    } else {
      rotation = start.rotation.map((el, i) => {
        return el + (end.rotation![i] - el) * fn.fn(delta);
      }) as [number, number, number];
    }

    if (!start.scale) {
      scale = end.scale;
    } else if (!end.scale) {
      scale = start.scale;
    } else {
      scale = start.scale.map((el, i) => {
        return el + (end.scale![i] - el) * fn.fn(delta);
      }) as [number, number, number];
    }

    return { translation: position, rotation, scale };
  }
}
