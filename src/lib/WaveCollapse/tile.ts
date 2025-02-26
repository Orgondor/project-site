import { halfTile, renderSize } from "./defines";
import { Edge, opposingEdge, type Sprite, type Tile } from "./types";
import { getEmptyEdgeMap, randomEntry, weightedRandomEntry } from "./util";

export const drawSprite = (
  context: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number
): void => {
  context.translate(halfTile + renderSize * x, halfTile + renderSize * y);
  context.rotate(sprite.rotation);
  context.drawImage(sprite.image, -halfTile, -halfTile);
  context.rotate(-sprite.rotation);
  context.translate(-(halfTile + renderSize * x), -(halfTile + renderSize * y));
};

export const setTileEdgeMap = (tile: Tile): void => {
  tile.edgeMap = getEmptyEdgeMap();
  tile.options.forEach((sprite) => {
    sprite.edges.forEach((edge, i: Edge) => {
      tile.edgeMap[i][edge] = true;
    });
  });
};

export const initTiles = (
  sprites: Sprite[],
  canvasWidth: number,
  canvasHeight: number
): Tile[] =>
  [...Array(canvasWidth * canvasHeight)].map<Tile>((_, i) => {
    const tile: Tile = {
      options: sprites,
      edgeMap: getEmptyEdgeMap(),
      x: i % canvasWidth,
      y: Math.floor(i / canvasWidth),
    };
    setTileEdgeMap(tile);
    return tile;
  });

export const drawTile = (
  context: CanvasRenderingContext2D,
  tile: Tile
): void => {
  if (tile.chosenSprite) {
    drawSprite(context, tile.chosenSprite, tile.x, tile.y);
  }
};

const getNeighborTiles = (
  tiles: Tile[],
  tile: Tile
): Record<Edge | number, Tile> => {
  const neighbors: Record<Edge | number, Tile> = {};
  tiles.forEach((entry) => {
    if (entry.x === tile.x && entry.y === tile.y - 1) {
      neighbors[Edge.Top] = entry;
    }
    if (entry.x === tile.x + 1 && entry.y === tile.y) {
      neighbors[Edge.Right] = entry;
    }
    if (entry.x === tile.x && entry.y === tile.y + 1) {
      neighbors[Edge.Bottom] = entry;
    }
    if (entry.x === tile.x - 1 && entry.y === tile.y) {
      neighbors[Edge.Left] = entry;
    }
  });

  return neighbors;
};

const updateOptions = (tiles: Tile[], tile: Tile): void => {
  const neighbors = getNeighborTiles(tiles, tile);

  let options = tile.options;
  if (options.length > 1) {
    options = options.filter(
      (sprite) =>
        (!neighbors[Edge.Top] ||
          neighbors[Edge.Top].edgeMap[opposingEdge[Edge.Top]][
            sprite.edges[Edge.Top]
          ]) &&
        (!neighbors[Edge.Right] ||
          neighbors[Edge.Right].edgeMap[opposingEdge[Edge.Right]][
            sprite.edges[Edge.Right]
          ]) &&
        (!neighbors[Edge.Bottom] ||
          neighbors[Edge.Bottom].edgeMap[opposingEdge[Edge.Bottom]][
            sprite.edges[Edge.Bottom]
          ]) &&
        (!neighbors[Edge.Left] ||
          neighbors[Edge.Left].edgeMap[opposingEdge[Edge.Left]][
            sprite.edges[Edge.Left]
          ])
    );

    if (options.length !== tile.options.length) {
      tile.options = options;
      setTileEdgeMap(tile);
      Object.values(neighbors).forEach((neighbor) => {
        updateOptions(tiles, neighbor);
      });
    }
  }
};

export const chooseSprite = (tiles: Tile[]): Tile => {
  const leastOptions = Math.min(...tiles.map((tile) => tile.options.length));

  if (!leastOptions) {
    throw new Error("chooseSprite failed, no remaining options");
  }

  const tileOptions = tiles.filter(
    (tile) => tile.options.length === leastOptions
  );

  const tile = randomEntry(tileOptions);

  if (tile.chosenSprite) {
    throw new Error("chooseSprite failed, sprite already chosen");
  }

  tile.chosenSprite = weightedRandomEntry(tile.options);
  tile.options = [tile.chosenSprite];
  setTileEdgeMap(tile);

  const neighbors = getNeighborTiles(tiles, tile);
  Object.values(neighbors).forEach((neighbor) => {
    updateOptions(tiles, neighbor);
  });

  return tile;
};
