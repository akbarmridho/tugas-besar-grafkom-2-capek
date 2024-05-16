import { Node, NodeSerialized } from './base/node.ts';
import { Color, ColorSerialized } from '@/objects/base/color.ts';

export interface SceneSerialized extends NodeSerialized {
  color: ColorSerialized;
}

export class Scene extends Node<SceneSerialized> {
  protected _color: Color;

  constructor(name: string, color: Color) {
    super(name);
    this._color = color;
  }

  get color() {
    return this._color;
  }

  toJSON(): SceneSerialized {
    return {
      color: this._color.toJSON(),
      ...this.toNodeSerialized()
    };
  }
}
