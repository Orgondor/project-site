import type { NdArray } from "ndarray";
import { pixelSize, renderSize } from "./defines";
import { type MapSetting, RotationDegrees, type Sprite } from "./types";
import {
  extractSpriteEdges,
  getSpriteFlipMap,
  getSpriteRotationMap,
  rotateEdges,
  rotateSpritePixels,
  spriteAlreadyExists,
} from "./util";

export const loadSprites = async (
  pixels: NdArray<Uint8Array>,
  mapSetting: MapSetting
): Promise<Sprite[]> => {
  const { spriteSize, numberOfSprites, weights } = mapSetting;
  const sprites: Sprite[] = [];
  const mapWidth = pixels.shape[0];
  const mapHeight = pixels.shape[1];
  const pixelSpriteSize = pixelSize * spriteSize;
  const pixelRowSize = pixelSize * mapWidth;
  const spriteRowSize = Math.floor(mapWidth / spriteSize);

  const imageData = new ImageData(
    Uint8ClampedArray.from(pixels.data),
    mapWidth,
    mapHeight
  );

  const images = await Promise.all(
    [...Array(numberOfSprites * 2)].map((_, i) => {
      const spriteIndex = i % numberOfSprites;
      const flipped = i >= numberOfSprites;

      return createImageBitmap(
        imageData,
        (spriteIndex * spriteSize) % mapWidth,
        Math.floor((spriteIndex * spriteSize) / mapWidth) * spriteSize,
        spriteSize,
        spriteSize,
        {
          resizeWidth: renderSize,
          resizeHeight: renderSize,
          resizeQuality: "pixelated",
          imageOrientation: flipped ? "flipY" : "none",
        }
      );
    })
  );

  [...Array(numberOfSprites * 2)].forEach((_, i) => {
    const spriteIndex = i % numberOfSprites;
    const flipped = i >= numberOfSprites;

    const rotationMap = flipped
      ? getSpriteFlipMap(mapSetting, spriteIndex)
      : getSpriteRotationMap(mapSetting, spriteIndex);

    let spritePixels = [...Array(spriteSize)].map((_, j) => {
      const row =
        Math.floor(spriteIndex / spriteRowSize) * pixelRowSize * spriteSize;
      const col = (spriteIndex % spriteRowSize) * pixelSpriteSize;

      const pixelsStart = row + col + pixelRowSize * j;
      return pixels.data.slice(pixelsStart, pixelsStart + pixelSpriteSize);
    });

    if (flipped) {
      spritePixels.reverse();
    }

    let edges = extractSpriteEdges(
      mapSetting,
      spritePixels,
      spriteIndex,
      flipped
    );

    if (
      rotationMap[RotationDegrees.Zero] &&
      !spriteAlreadyExists(sprites, spritePixels)
    ) {
      sprites.push({
        pixels: spritePixels,
        edges,
        rotation: 0,
        flippedY: flipped,
        image: images[i],
        weight: weights ? weights[spriteIndex] ?? 1 : 1,
      });
    }

    const rotationDegrees = [
      RotationDegrees.Ninety,
      RotationDegrees.OneEighty,
      RotationDegrees.TwoForty,
    ];
    for (let r = 0; r < 3; r++) {
      spritePixels = rotateSpritePixels(spritePixels);
      edges = rotateEdges(edges);

      if (
        rotationMap[rotationDegrees[r]] &&
        !spriteAlreadyExists(sprites, spritePixels)
      ) {
        sprites.push({
          pixels: spritePixels,
          edges,
          rotation: (Math.PI * (r + 1)) / 2,
          flippedY: flipped,
          image: images[i],
          weight: weights ? weights[spriteIndex] ?? 1 : 1,
        });
      }
    }
  });

  return sprites;
};
