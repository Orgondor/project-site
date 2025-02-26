import getPixels from "get-pixels";
import type { NdArray } from "ndarray";
import { cancel, renderSize, speed, startWaveCollapse } from "./defines";
import { loadSprites } from "./loadSprites";
import { chooseSprite, drawTile, initTiles } from "./tile";
import type { MapSetting } from "./types";
import { sleep, spriteToLogString } from "./util";

const getPixelsPromise = (path: string): Promise<NdArray<Uint8Array>> => {
  return new Promise((resolve, reject) => {
    getPixels(path, (error, pixels) => {
      if (error) {
        return reject(error);
      }
      resolve(pixels);
    });
  });
};

export const WaveCollapse = async (
  canvasId: string,
  imageSrc: string,
  mapSetting: MapSetting,
  setRunning: (running: boolean) => void,
  setCancel: (running: boolean) => void
): Promise<void> => {
  setRunning(true);
  setCancel(false);
  startWaveCollapse();

  const canvas: HTMLCanvasElement = document.getElementById(
    canvasId
  ) as HTMLCanvasElement;
  const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

  if (!context) {
    alert('Failed to get context "2d"');
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const canvasWidth = canvas.width / renderSize;
  const canvasHeight = canvas.height / renderSize;

  context.imageSmoothingEnabled = false;

  const pixels = await getPixelsPromise(imageSrc);
  const sprites = await loadSprites(pixels, mapSetting);

  // sprites.forEach((sprite, i) => {
  //   console.log(`sprite: ${i + 1}\n${spriteToLogString(sprite)}`);
  // });

  const tiles = initTiles(sprites, canvasWidth, canvasHeight);

  let remainingTiles = tiles;

  await sleep(100);

  while (remainingTiles.length) {
    try {
      if (cancel) {
        setRunning(false);
        setCancel(false);
        return;
      }
      const tile = chooseSprite(remainingTiles);
      drawTile(context, tile);
      remainingTiles = remainingTiles.filter((tile) => !tile.chosenSprite);
      await sleep(Math.pow(10, 3 - speed));
    } catch (error) {
      console.log("Wave collapse failed", error);
      break;
    }
  }

  setRunning(false);
};
