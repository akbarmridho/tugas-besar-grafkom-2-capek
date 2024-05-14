import { Node, NodeSerialized } from './node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';

export class Scene extends Node {
  public static fromJSON(raw: NodeSerialized): Scene {
    const position = Vector3.fromJSON(raw.transform.position);
    const scale = Vector3.fromJSON(raw.transform.scale);
    const rotation = Euler.fromJSON(raw.transform.rotation);

    const scene = new Scene(position, rotation, scale);

    for (const child of raw.children) {
      scene.addChildren(Node.fromJSON(child));
    }

    return scene;
  }
}
