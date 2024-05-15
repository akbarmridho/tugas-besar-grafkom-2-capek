import { Node, NodeSerialized } from './base/node.ts';
import { Color, ColorSerialized } from '@/objects/base/color.ts';

export interface SceneSerialized extends NodeSerialized {
  color: ColorSerialized;
}

export class Scene extends Node<SceneSerialized> {
  protected color: Color;

  constructor(name: string, color: Color) {
    super(name);
    this.color = color;
  }

  toJSON(): SceneSerialized {
    return {
      color: this.color.toJSON(),
      ...this.toNodeSerialized()
    };
  }
}
