export abstract class Serializable {
  public abstract toJSON(): Object;
  public abstract fromJSON<T>(raw: Object): T;
}
