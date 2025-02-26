export const renderSize = 30; // The size to render a tile at, width in pixels
export const pixelSize = 4; // Bytes per pixel, RGBA one byte each

export const halfTile = renderSize / 2; // Half the width of a rendered tile in pixels

export let speed = 1; // The speed of rendering, how much to wait after choosing each sprite
export const setSpeed = (input: number): void => {
  speed = input;
};

export let cancel = false;
export const cancelWaveCollapse = (): void => {
  cancel = true;
};
export const startWaveCollapse = (): void => {
  cancel = false;
};
