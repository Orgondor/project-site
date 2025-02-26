import { pixelSize } from "./defines";
import {
  Edge,
  FlipMode,
  flipRotation,
  RotateMode,
  RotationDegrees,
} from "./types";
import type {
  EdgeMap,
  MapSetting,
  RotationMap,
  Sprite,
} from "./types";

export const randomInt = (max: number): number => {
  return Math.min(Math.floor(Math.random() * (max + 1)), max);
};

export const randomEntry = <T>(array: Array<T>): T =>
  array[randomInt(array.length - 1)];

type WeightedEntry = {
  weight: number;
};

export const weightedRandomEntry = <T extends WeightedEntry>(
  array: Array<T>
): T => {
  let range = 0;
  array.forEach((value) => {
    range += value.weight;
  });

  const value = Math.random() * range;
  let count = array[0].weight;

  return array.find((_, i) => {
    if (i >= array.length - 1) {
      return true;
    }

    if (value < count) {
      return true;
    }

    count += array[i + 1].weight;
    return false;
  }) || array[0];
};

export const arrayEqual = (
  a: Array<unknown> | Uint8Array<ArrayBuffer>,
  b: Array<unknown> | Uint8Array<ArrayBuffer>
): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    const a2 = a[i];
    const b2 = b[i];
    if (
      (a2 instanceof Array || a2 instanceof Uint8Array) &&
      (b2 instanceof Array || b2 instanceof Uint8Array)
    ) {
      if (!arrayEqual(a2 as Array<unknown>, b2 as Array<unknown>)) {
        return false;
      }
    } else if (a2 !== b2) {
      return false;
    }
  }

  return true;
};

export const pixelsToLogString = (pixels: Uint8Array<ArrayBuffer>[]): string => {
  let result = "";

  pixels.forEach((pixelRow) => {
    for (let i = 0; i < pixelRow.length; i += 4) {
      if (arrayEqual(pixelRow.slice(i, i + 4), [255, 255, 255, 255])) {
        result += "O";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [0, 0, 255, 255])) {
        result += "#";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [255, 0, 0, 255])) {
        result += "@";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [0, 0, 0, 255])) {
        result += "S";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [49, 51, 49, 255])) {
        result += "B";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [109, 87, 6, 255])) {
        result += "T";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [109, 109, 109, 255])) {
        result += "V";
      } else if (arrayEqual(pixelRow.slice(i, i + 4), [26, 26, 26, 255])) {
        result += "C";
      } else if (
        arrayEqual(pixelRow.slice(i, i + 4), [0x2f, 0xa0, 0x02, 0xff])
      ) {
        result += "G";
      } else if (
        arrayEqual(pixelRow.slice(i, i + 4), [0x40, 0x40, 0x40, 0xff])
      ) {
        result += "R";
      } else if (
        arrayEqual(pixelRow.slice(i, i + 4), [0x81, 0x81, 0x81, 0xff])
      ) {
        result += "r";
      } else {
        result += "?";
      }
    }
    result += "\n";
  });

  return result;
};

export const pixelToHex = (pixel: Uint8Array<ArrayBuffer>): string => {
  let result = "";

  for (let i = 0; i < Math.min(pixel.length, 4); i++) {
    result += pixel[i].toString(16).padStart(2, "0");
  }

  return result;
};

export const pixelRowToHex = (pixelRow: Uint8Array<ArrayBuffer>): string => {
  let result = "";

  pixelRow.forEach((value) => {
    result += value.toString(16).padStart(2, "0");
  });

  return result;
};

export const pixelsToHex = (pixels: Uint8Array<ArrayBuffer>[]): string[][] => {
  const result: string[][] = [];

  pixels.forEach((pixelRow, i) => {
    result.push([]);

    for (let j = 0; j < pixelRow.length; j += 4) {
      result[i].push(pixelToHex(pixelRow.slice(j, j + 4)));
    }
  });

  return result;
};

export const pixelToInt = (pixel: Uint8Array<ArrayBuffer>): number => {
  if (pixel.length < 4) {
    throw new Error("invalid pixel, length < 4");
  }

  const buffer = new Uint32Array(1); // Needed to keep it unsigned
  buffer[0] = (pixel[0] << 24) | (pixel[1] << 16) | (pixel[2] << 8) | pixel[3];

  return buffer[0];
};

export const spriteToLogString = (sprite: Sprite): string => {
  return `rotation: ${Math.round(
    (sprite.rotation * 180) / Math.PI
  )}\nflipped: ${sprite.flippedY}\npixels:\n${pixelsToLogString(
    sprite.pixels
  )}edges:\n${sprite.edges[0]}\n${sprite.edges[1]}\n${sprite.edges[2]}\n${
    sprite.edges[3]
  }`;
};

export const extractPixelColumn = (
  spritePixels: Uint8Array<ArrayBuffer>[],
  column: number,
  reverse = false
): Uint8Array<ArrayBuffer> => {
  const columnPixels = new Uint8Array(spritePixels.length * pixelSize);
  spritePixels.forEach((row, i) => {
    [...Array(pixelSize)].forEach((_, j) => {
      const rowIndex = reverse ? spritePixels.length - i - 1 : i;
      columnPixels[rowIndex * pixelSize + j] = row[column * pixelSize + j];
    });
  });
  return columnPixels;
};

export const extractSpriteEdges = (
  mapSetting: MapSetting,
  spritePixels: Uint8Array<ArrayBuffer>[],
  spriteIndex: number,
  flipped: boolean
): string[] => {
  if (mapSetting.customEdges) {
    const edges = mapSetting.customEdges[spriteIndex].slice();

    if (flipped) {
      const tmp1 = edges[0];
      const tmp2 = edges[2];
      edges[0] = tmp2;
      edges[2] = tmp1;
      edges[1] = reverseEdge(edges[1]);
      edges[3] = reverseEdge(edges[3]);
    }

    return edges;
  }

  const edges: Uint8Array<ArrayBuffer>[] = [];
  edges.push(spritePixels[0]);
  edges.push(extractPixelColumn(spritePixels, spritePixels.length - 1));
  edges.push(spritePixels[spritePixels.length - 1]);
  edges.push(extractPixelColumn(spritePixels, 0));
  return edges.map((edge) => pixelRowToHex(edge));
};

export const rotateSpritePixels = (
  spritePixels: Uint8Array<ArrayBuffer>[]
): Uint8Array<ArrayBuffer>[] => {
  const rotated: Uint8Array<ArrayBuffer>[] = [];
  [...Array(spritePixels.length)].forEach((_, i) => {
    rotated.push(extractPixelColumn(spritePixels, i, true));
  });
  return rotated;
};

export const reverseEdge = (edge: string): string => {
  const pixelLength = pixelSize * 2;
  if (edge.length % pixelLength !== 0) {
    throw new Error("reverseEdge - Invalid edge");
  }

  let reversed = "";
  for (let i = edge.length - pixelLength; i >= 0; i -= pixelLength) {
    reversed += edge.slice(i, i + pixelLength);
  }

  return reversed;
};

export const rotateEdges = (edges: string[]): string[] => {
  if (edges.length !== 4) {
    throw new Error("rotateEdges - Invalid edges");
  }

  const rotated = [
    reverseEdge(edges[3]),
    edges[0],
    reverseEdge(edges[1]),
    edges[2],
  ];
  return rotated;
};

export const spriteAlreadyExists = (
  sprites: Sprite[],
  spritePixels: Uint8Array<ArrayBuffer>[]
): boolean => sprites.some((data) => arrayEqual(data.pixels, spritePixels));

export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const getEmptyEdgeMap = (): EdgeMap => ({
  [Edge.Top]: {},
  [Edge.Right]: {},
  [Edge.Bottom]: {},
  [Edge.Left]: {},
});

export const getSpriteRotationMap = (
  mapSetting: MapSetting,
  spriteIndex: number
): RotationMap => {
  const { rotation } = mapSetting;
  const map: RotationMap = {};

  switch (rotation.rotateMode) {
    case RotateMode.All:
      map[RotationDegrees.Zero] = true;
      map[RotationDegrees.Ninety] = true;
      map[RotationDegrees.OneEighty] = true;
      map[RotationDegrees.TwoForty] = true;
      break;
    case RotateMode.Select:
      if (rotation.spritesToRotate.includes(spriteIndex)) {
        map[RotationDegrees.Zero] = true;
        map[RotationDegrees.Ninety] = true;
        map[RotationDegrees.OneEighty] = true;
        map[RotationDegrees.TwoForty] = true;
      } else {
        map[RotationDegrees.Zero] = true;
      }
      break;
    case RotateMode.Individual:
      if (rotation.spritesToRotate[spriteIndex]) {
        rotation.spritesToRotate[spriteIndex].forEach((degrees) => {
          map[degrees] = true;
        });
      } else {
        map[RotationDegrees.Zero] = true;
      }
      break;

    default:
      break;
  }

  return map;
};

export const getSpriteFlipMap = (
  mapSetting: MapSetting,
  spriteIndex: number
): RotationMap => {
  const { flip } = mapSetting;
  const map: RotationMap = {};

  switch (flip.flipMode) {
    case FlipMode.All:
      map[RotationDegrees.Zero] = true;
      map[RotationDegrees.Ninety] = true;
      map[RotationDegrees.OneEighty] = true;
      map[RotationDegrees.TwoForty] = true;
      break;
    case FlipMode.Select:
      if (flip.spritesToFlip.includes(spriteIndex)) {
        map[RotationDegrees.Zero] = true;
        map[RotationDegrees.Ninety] = true;
        map[RotationDegrees.OneEighty] = true;
        map[RotationDegrees.TwoForty] = true;
      }
      break;
    case FlipMode.Individual:
      if (flip.spritesToFlip[spriteIndex]) {
        flip.spritesToFlip[spriteIndex].forEach((degrees) => {
          map[flipRotation[degrees]] = true;
        });
      }
      break;

    default:
      break;
  }

  return map;
};
