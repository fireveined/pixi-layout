export type Query = string | {};

export class QueryCache {
  private _map = new Map<string, PIXI.DisplayObject>();
  private _scene: PIXI.Container;

  public query(query: string): PIXI.DisplayObject | undefined {
    const cached = this._map.get(query) as PIXI.DisplayObject;

    const isDestroyed = !cached.transform;
    if (cached && !isDestroyed) {
      return cached;
    }

    const result = this.findChildRecurrently(
      this._scene,
      child => child.name === query
    );
    // this._map.
    // return result;
  }

  public findChildRecurrently(
    target: PIXI.Container,
    callback: (child: PIXI.DisplayObject) => boolean
  ): PIXI.DisplayObject {
    const child = target.children.find(callback);
    if (child) {
      return child;
    }

    const containers = target.children.filter(
      value => (value as any).children.length
    );

    for (const container of containers) {
      const found = this.findChildRecurrently(container as any, callback);
      if (found) {
        return found;
      }
    }
  }
}
