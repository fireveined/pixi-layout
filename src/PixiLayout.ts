import * as PIXI from 'pixi.js';
import DisplayObject = PIXI.DisplayObject;

export type ObjectQuery = DisplayObject | PIXI.Rectangle | string;

class PositionXSetter {
  private _source?: ObjectQuery;
  private _xFunc: LayoutFunc;
  private _value: number | string = 0;

  constructor(private query: ILayout) {}

  public set = (value: number | string): PositionXSetter => {
    this._value = value;
    this._xFunc = this._xFunc || (source => this.getValue(source.height));
    return this;
  };

  protected getValue(width: number): number {
    return (<any>this._value).indexOf
      ? (parseFloat(this._value as string) / 100) * width
      : (this._value as number);
  }

  public fromRightInwardEdge(): ILayout {
    return this.fromRightInwardEdgeOf(undefined);
  }

  public fromRightOutwardEdge(): ILayout {
    return this.fromRightOutwardEdgeOf(undefined);
  }

  public fromLeftInwardEdge(): ILayout {
    return this.fromLeftInwardEdgeOf(undefined);
  }

  public fromLeftOutwardEdge(): ILayout {
    return this.fromLeftOutwardEdgeOf(undefined);
  }

  public fromRightInwardEdgeOf(source?: ObjectQuery) {
    this._source = source;
    this._xFunc = (source, target) =>
      source.right - target.width - this.getValue(source.width);
    return this.query;
  }

  public fromRightOutwardEdgeOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._xFunc = (source, target) =>
      source.right + this.getValue(source.width);
    return this.query;
  }

  public fromLeftInwardEdgeOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._xFunc = (source, target) => source.left + this.getValue(source.width);
    return this.query;
  }

  public fromLeftOutwardEdgeOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._xFunc = (source, target) =>
      source.left - target.width - this.getValue(source.width);
    return this.query;
  }

  public inCenter(): ILayout {
    return this.inCenterOf(undefined);
  }

  public inCenterOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._xFunc = (source, target) =>
      source.left + source.width / 2 - target.width / 2;
    return this.query;
  }
}

class PositionYSetter {
  private _source?: ObjectQuery;
  private _yFunc: LayoutFunc;
  private _value: number | string = 0;

  constructor(private query: ILayout) {}

  public set = (value: number | string): PositionYSetter => {
    this._value = value;
    this._yFunc = this._yFunc || (source => this.getValue(source.height));
    return this;
  };

  protected getValue(height: number): number {
    return (<any>this._value).indexOf
      ? (parseFloat(this._value as string) / 100) * height
      : (this._value as number);
  }

  public fromBottomInwardEdge(): ILayout {
    return this.fromBottomInwardEdgeOf(undefined);
  }

  public fromBottomOutwardEdge(): ILayout {
    return this.fromBottomOutwardEdgeOf(undefined);
  }

  public fromTopInwardEdge(): ILayout {
    return this.fromTopInwardEdgeOf(undefined);
  }

  public fromTopOutwardEdge(): ILayout {
    return this.fromTopOutwardEdgeOf(undefined);
  }

  public fromBottomInwardEdgeOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._yFunc = (source, target) =>
      source.bottom - target.height - this.getValue(source.height);
    return this.query;
  }

  public fromBottomOutwardEdgeOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._yFunc = (source, target) =>
      source.bottom + this.getValue(source.height);
    return this.query;
  }

  public fromTopInwardEdgeOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._yFunc = (source, target) => source.top + this.getValue(source.height);
    return this.query;
  }

  public fromTopOutwardEdgeOf(source?: ObjectQuery) {
    this._source = source;
    this._yFunc = (source, target) =>
      source.top - target.height - this.getValue(source.height);
    return this.query;
  }

  public inCenter(): ILayout {
    return this.inCenterOf(undefined);
  }

  public inCenterOf(source?: ObjectQuery): ILayout {
    this._source = source;
    this._yFunc = (source, target) =>
      source.top + source.height / 2 - target.height / 2;
    return this.query;
  }
}

class WidthSetter {
  private _source?: ObjectQuery;
  private _widthFunc: LayoutFunc;
  private _value: number | string = 0;

  constructor(private query: ILayout) {}

  public set = (value: number | string): ILayout => {
    this._value = value;
    this._widthFunc =
      this._widthFunc ||
      ((source, target) => this.getValue(source.width) / target.width);
    return this.query;
  };

  protected getValue(width: number): number {
    return (<any>this._value).indexOf
      ? (parseFloat(this._value as string) / 100) * width
      : (this._value as number);
  }
}

class HeightSetter {
  private _source?: ObjectQuery;
  private _heightFunc: LayoutFunc;
  private _scaleFunc: LayoutFunc<{ x: number; y: number }>;
  private _value: number | string = 0;

  constructor(private query: ILayout) {}

  public set = (value: number | string): ILayout => {
    this._value = value;
    this._heightFunc =
      this._heightFunc ||
      ((source, target) => this.getValue(source.height) / target.height);
    return this.query;
  };

  public max = (value: number | string): ILayout => {
    const val = {
      x: 1,
      y: 1,
    };
    this._scaleFunc = (source, target) => {
      const calcMax = (<any>value).indexOf
        ? (parseFloat(value as string) / 100) * source.height
        : (value as number);
      val.x = val.y = Math.min(1, calcMax / target.height);
      return val;
    };

    return this.query;
  };

  protected getValue(height: number): number {
    return (<any>this._value).indexOf
      ? (parseFloat(this._value as string) / 100) * height
      : (this._value as number);
  }
}

class SizeSetter {
  private _keepAspectRatio = true;
  private _widthFunc: LayoutFunc;
  private _heightFunc: LayoutFunc;
  private _source: ObjectQuery;
  private _allFunc: LayoutFunc<AllLayoutType>;

  constructor(private query: ILayout) {}

  public withoutAspectRatio(): ILayout {
    this._keepAspectRatio = false;
    return this.query;
  }

  public cover(
    source: ObjectQuery,
    horizontalAlign: number | keyof typeof Align,
    verticalAlign?: number | keyof typeof Align
  ): ILayout {
    this._source = source;

    const val: AllLayoutType = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };

    const alignX =
      typeof horizontalAlign === 'string'
        ? AlignsMap[horizontalAlign]
        : horizontalAlign;
    const alignY =
      verticalAlign !== undefined
        ? typeof verticalAlign === 'string'
          ? AlignsMap[verticalAlign]
          : verticalAlign
        : alignX;

    this._allFunc = (source, target) => {
      const xRatio = source.width / target.width;
      const yRatio = source.height / target.height;
      const scale = Math.max(xRatio, yRatio);
      val.scaleY = val.scaleX = scale;
      val.x = source.x + source.width * alignX - target.width * scale * alignX;
      val.y =
        source.y + source.height * alignY - target.height * scale * alignY;
      return val;
    };

    return this.query;
  }

  public stretch(source: ObjectQuery): ILayout {
    this._source = source;
    const val: AllLayoutType = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };
    this._allFunc = (source, target) => {
      const xRatio = source.width / target.width;
      const yRatio = source.height / target.height;
      val.scaleX = xRatio;
      val.scaleY = yRatio;
      val.x = source.x;
      val.y = source.y;
      return val;
    };

    return this.query;
  }
}

export enum Align {
  START = 'START',
  CENTER = 'CENTER',
  END = 'END',
}

const AlignsMap = {
  [Align.START]: 0,
  [Align.CENTER]: 0.5,
  [Align.END]: 1,
};

export interface ILayout {
  x?: PositionXSetter;
  y?: PositionYSetter;
  size?: SizeSetter;
  width?: WidthSetter;
  height?: HeightSetter;
}

interface SetterInternal {
  _widthFunc: LayoutFunc;
  _heightFunc: LayoutFunc;
  _xFunc?: LayoutFunc;
  _yFunc?: LayoutFunc;
  _allFunc: LayoutFunc;
  _posFunc: LayoutFunc;
  _sizeFunc: LayoutFunc;
  _source: ObjectQuery;
}

interface ILayoutInternals {
  xSetter?: PositionXSetter;
  ySetter?: PositionYSetter;
  widthSetter?: WidthSetter;
  heightSetter?: HeightSetter;
  sizeSetter?: SizeSetter;
  source?: ObjectQuery;
}

type LayoutFunc<returnType = number> = (
  source: PIXI.Rectangle,
  target: PIXI.Rectangle,
  scale?: { x: number; y: number }
) => returnType;
type AllLayoutType = { x: number; y: number; scaleX: number; scaleY: number };

type LayoutFuncObj<returnType = number> = {
  func: LayoutFunc<returnType>;
  source: ObjectQuery;
};

interface LayoutCallbacks {
  x?: LayoutFuncObj;
  y?: LayoutFuncObj;
  width?: LayoutFuncObj;
  height?: LayoutFuncObj;
  scale?: LayoutFuncObj<{ x: number; y: number }>;
  size?: LayoutFuncObj<{ width: number; height: number }>;
  pos?: LayoutFuncObj<{ x: number; y: number }>;
  all?: LayoutFuncObj<AllLayoutType>;
}

interface IDynamicRectangle extends PIXI.Rectangle {
  _calculate(rect: PIXI.Rectangle): void;
}

interface CoordData {
  value: number;
  min: number;
  max: number;
}

export class PixiLayout {
  public globalScale = 1;
  public defaultLayoutSource: PIXI.Rectangle;

  public static isRendering: boolean = true;

  public queryScene: (name: string) => DisplayObject | undefined = name => {
    return undefined;
  };

  protected queryObject(obj: ObjectQuery): DisplayObject | undefined {
    if (obj instanceof DisplayObject) {
      return obj;
    }

    return this.queryScene(obj as string);
  }

  public createArea(calc: (rect: PIXI.Rectangle) => void): PIXI.Rectangle {
    const rect = new PIXI.Rectangle();
    (rect as IDynamicRectangle)._calculate = calc;
    return rect;
  }

  public calculate(
    target: DisplayObject,
    from: ObjectQuery,
    callbacks: LayoutCallbacks
  ) {
    const targetScale = target?.parent?.worldTransform.a;
    const targetBounds = target.getBounds(true);
    this._multiplyRectangle(targetBounds, this.globalScale);

    let globalSrcBounds: PIXI.Rectangle;
    if (from) {
      if (from instanceof PIXI.Rectangle) {
        if ((from as IDynamicRectangle)._calculate) {
          (from as IDynamicRectangle)._calculate(from);
        }
        globalSrcBounds = from;
      } else {
        globalSrcBounds = this.queryObject(from)!.getBounds(true);
      }
      this._multiplyRectangle(globalSrcBounds, this.globalScale);
    }

    if (callbacks['pos']) {
      const pos = this._callCallback(
        callbacks['pos'],
        globalSrcBounds,
        targetBounds
      );
      target.position.set(
        (pos.x - targetBounds.x) / targetScale,
        (pos.y - targetBounds.y) / targetScale
      );
    }

    if (callbacks['x']) {
      const x = this._callCallback(
        callbacks['x'],
        globalSrcBounds,
        targetBounds
      );
      target.x += (x - targetBounds.x) / targetScale / this.globalScale;
    }

    if (callbacks['y']) {
      const y = this._callCallback(
        callbacks['y'],
        globalSrcBounds,
        targetBounds
      );
      target.y += (y - targetBounds.y) / targetScale / this.globalScale;
    }

    if (callbacks['width']) {
      const x = this._callCallback(
        callbacks['width'],
        globalSrcBounds,
        targetBounds
      );
      target.scale.x *= x;
      targetBounds.width *= x;
      if (!callbacks['height']) {
        target.scale.y = target.scale.x;
        targetBounds.height *= x;
      }
    }

    if (callbacks['height']) {
      const y = this._callCallback(
        callbacks['height'],
        globalSrcBounds,
        targetBounds
      );
      target.scale.y *= y;
      targetBounds.height *= x;
      if (!callbacks['width']) {
        target.scale.x = target.scale.y;
        targetBounds.width *= x;
      }
    }

    if (callbacks['scale']) {
      const all = this._callCallback(
        callbacks['scale'],
        globalSrcBounds,
        targetBounds
      );
      target.scale.set(target.scale.x * all.x, target.scale.y * all.y);
    }

    if (callbacks['size']) {
      const size = this._callCallback(
        callbacks['size'],
        globalSrcBounds,
        targetBounds
      );
      (<any>target).width = size.width / targetScale;
      (<any>target).height = size.height / targetScale;
    }

    if (callbacks['all']) {
      const all = this._callCallback(
        callbacks['all'],
        globalSrcBounds,
        targetBounds
      );
      target.position.set(
        target.position.x +
          (all.x - targetBounds.x) / targetScale / this.globalScale,
        target.position.y +
          (all.y - targetBounds.y) / targetScale / this.globalScale
      );
      target.scale.set(
        target.scale.x * all.scaleX,
        target.scale.y * all.scaleY
      );
    }
  }

  private _callCallback<T>(
    callback: LayoutFuncObj<T>,
    globalSrcBounds: PIXI.Rectangle,
    targetBounds: PIXI.Rectangle
  ): T {
    let sourceBounds = globalSrcBounds;
    if (callback.source) {
      if (callback.source instanceof PIXI.Rectangle) {
        if ((callback.source as IDynamicRectangle)._calculate) {
          (callback.source as IDynamicRectangle)._calculate(callback.source);
        }
        sourceBounds = callback.source;
      } else {
        sourceBounds = this.queryObject(callback.source)!.getBounds(true);
      }
      this._multiplyRectangle(sourceBounds, this.globalScale);
    }
    return callback.func(sourceBounds, targetBounds);
  }

  private _multiplyRectangle(rect: PIXI.Rectangle, scale: number) {
    rect.x *= scale;
    rect.y *= scale;
    rect.width *= scale;
    rect.height *= scale;
    return rect;
  }

  public makeLayout(source?: ObjectQuery): ILayout {
    let query: ILayout & ILayoutInternals = {};
    query.xSetter = new PositionXSetter(query);
    query.ySetter = new PositionYSetter(query);
    query.widthSetter = new WidthSetter(query);
    query.heightSetter = new HeightSetter(query);
    query.sizeSetter = new SizeSetter(query);
    query.x = query.xSetter;
    query.y = query.ySetter;
    query.height = query.heightSetter;
    query.width = query.widthSetter;
    query.size = query.sizeSetter;
    query.source = source;
    return query;
  }

  public createLayout(target: DisplayObject, _query: ILayout) {
    const query: ILayout & ILayoutInternals = _query;

    const callbacks: LayoutCallbacks = {};
    const setters = [
      query.sizeSetter,
      query.xSetter,
      query.ySetter,
      query.widthSetter,
      query.heightSetter,
    ];
    const funcs = [
      '_xFunc',
      '_yFunc',
      '_widthFunc',
      '_heightFunc',
      '_scaleFunc',
      'sizeFunc',
      '_posFunc',
      '_allFunc',
    ];
    const callbacksKeys = [
      'x',
      'y',
      'width',
      'height',
      'scale',
      'size',
      'pos',
      'all',
    ];

    for (const setter of setters) {
      funcs.forEach((func, index) => {
        if (((setter as unknown) as SetterInternal)[func]) {
          callbacks[callbacksKeys[index]] = {
            func: ((setter as unknown) as SetterInternal)[func],
            source: ((setter as unknown) as SetterInternal)._source,
          };
        }
      });
    }

    return () => this.calculate(target, query.source, callbacks);
  }

  public applyLayout(target: DisplayObject, calculateLayout: Function) {
    const targetAny: any = target;

    if (!targetAny.__calculateLayout) {
      targetAny.__updateTransform = targetAny.updateTransform;
      target.updateTransform = polyfilledUpdateTransform.bind(target);
    }

    targetAny.__calculateLayout = calculateLayout;
  }
}

function polyfilledUpdateTransform() {
  this.__calculateLayout();
  PixiLayout.isRendering && this.__updateTransform();
}

declare module 'pixi.js' {
  export interface DisplayObject {
    layout: ILayout;
  }
}

export function setupPixiLayout(
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
) {
  renderer.on('prerender', () => (PixiLayout.isRendering = true));
  renderer.on('postrender', () => (PixiLayout.isRendering = false));

  Object.defineProperty(DisplayObject.prototype, 'layout', {
    set(layout: ILayout): void {
      const func = pixiLayout.createLayout(this, layout);
      pixiLayout.applyLayout(this, func);
    },
  });
}

export const pixiLayout = new PixiLayout();
