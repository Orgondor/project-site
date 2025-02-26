export type Sprite = {
  rotation: number;
  flippedY: boolean;
  pixels: Uint8Array<ArrayBuffer>[];
  edges: string[];
  image: ImageBitmap;
  weight: number;
};

export type EdgeMap = Record<Edge, Record<string, boolean>>;

export type Tile = {
  chosenSprite?: Sprite;
  options: Sprite[];
  edgeMap: EdgeMap;
  x: number;
  y: number;
};

export enum Edge {
  Top = 0,
  Right,
  Bottom,
  Left,
}

export const opposingEdge: Record<Edge, Edge> = {
  [Edge.Top]: Edge.Bottom,
  [Edge.Right]: Edge.Left,
  [Edge.Bottom]: Edge.Top,
  [Edge.Left]: Edge.Right,
};

export type Neighbor = {
  tile: Tile;
  edge: Edge;
};

export type RunControl = {
  setRunning: (running: boolean) => void;
  setCancel: (cancel: boolean) => void;
};

export type PathMap = Record<string, string>;

export enum RotateMode {
  All = "all",
  Select = "select",
  Individual = "individual",
}

export type RotateAll = {
  rotateMode: RotateMode.All;
};

export type RotateSelect = {
  rotateMode: RotateMode.Select;
  spritesToRotate: number[];
};

export enum RotationDegrees {
  Zero = "0",
  Ninety = "90",
  OneEighty = "180",
  TwoForty = "240",
}

export type RotateIndividual = {
  rotateMode: RotateMode.Individual;
  spritesToRotate: Record<number, RotationDegrees[]>;
};

export type Rotation = RotateAll | RotateSelect | RotateIndividual;

export enum FlipMode {
  All = "all",
  Select = "select",
  Individual = "individual",
}

export type FlipAll = {
  flipMode: FlipMode.All;
};

export type FlipSelect = {
  flipMode: FlipMode.Select;
  spritesToFlip: number[];
};

export enum FlipDegrees {
  X = "x",
  Y = "y",
  YNinety = "y90",
  YTwoForty = "y240",
}

export const flipRotation: Record<FlipDegrees, RotationDegrees> = {
  [FlipDegrees.Y]: RotationDegrees.Zero,
  [FlipDegrees.YNinety]: RotationDegrees.Ninety,
  [FlipDegrees.X]: RotationDegrees.OneEighty,
  [FlipDegrees.YTwoForty]: RotationDegrees.TwoForty,
};

export type FlipIndividual = {
  flipMode: FlipMode.Individual;
  spritesToFlip: Record<number, FlipDegrees[]>;
};

export type Flip = FlipAll | FlipSelect | FlipIndividual;

export type MapSetting = {
  spriteSize: number;
  numberOfSprites: number;
  rotation: Rotation;
  flip: Flip;
  weights?: Record<number, number>;
  customEdges?: Record<number, string[]>;
};

export type MapPath = "SimpleSprites" | "Forest" | "CircuitTiles";

export type MapSettings = Record<MapPath, MapSetting>;

export type RotationMap = Record<RotationDegrees | string, boolean>;
