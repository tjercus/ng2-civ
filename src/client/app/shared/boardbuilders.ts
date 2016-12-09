
import {Tile, Coord, Land, Sea} from "./world";

export function miniBoardBuilder(boardSize: number = 5): Map<String, Tile> {
  let tiles = new Map<String, Tile>();
  for (let i = 0; i < boardSize; i++) {
    tiles = setSeaTileAt(i, 0, tiles);
  }
  for (let j = 0; j < boardSize; j++) {
    tiles = setSeaTileAt(j, 1, tiles);
  }
  for (let k = 0; k < boardSize; k++) {
    tiles = setLandTileAt(k, 2, tiles);
  }
  for (let l = 0; l < boardSize; l++) {
    tiles = setLandTileAt(l, 3, tiles);
  }
  console.log(`miniboardbuilder used to create a grid ${tiles.size}`);
  return tiles;
}

export function csvBoardBuilder(csv: string): Map<String, Tile> {
  let tiles = new Map<String, Tile>();
  return tiles;
}

export function randomIslandsBoardBuilder(boardSize: number = 50): Map<String, Tile> {
  let tiles = new Map<String, Tile>();
  return tiles;
}

function setSeaTileAt(x: number, y: number, tiles: Map<String, Tile>): Map<String, Tile> {
  return tiles.set(Coord.create(x, y).valueOf(), createSeaTile(x, y));
}
function setLandTileAt(x: number, y: number, tiles: Map<String, Tile>): Map<String, Tile> {
  return tiles.set(Coord.create(x, y).valueOf(), createLandTile(x, y));
}

function createLandTile(x: number, y: number): Tile {
  return Tile.create(Coord.create(x, y), new Land());
}
function createSeaTile(x: number, y: number): Tile {
  return Tile.create(Coord.create(x, y), new Sea());
}