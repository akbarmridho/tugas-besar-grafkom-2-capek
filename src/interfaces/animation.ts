export interface AnimationTRS {
  translation?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export interface AnimationPath {
  keyframe?: AnimationTRS;
  children?: {
    [childName: string]: AnimationPath;
  };
}

export interface AnimationClip {
  name: string;
  frames: AnimationPath[];
}
