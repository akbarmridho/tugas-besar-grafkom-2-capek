import { SerializationResult } from '../../interfaces/serializable.ts';

export abstract class Serializable<T> {
  public abstract toJSON(): T;

  public toJSONWithType(): SerializationResult<T> {
    return {
      type: this.constructor.name,
      data: this.toJSON()
    };
  }
}
