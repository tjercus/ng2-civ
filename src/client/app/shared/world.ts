import {Unit, City, Settler, SailBoat} from "./units";

export class Game {
  //public players: Array<Player> = [];
  public year: number = 1;
  public board: Board;

  constructor(board: Board) {
    this.board = board;
    const settler = new Settler();
    this.board.activeTile = this.board.placeUnit(Coord.create(2,3), settler);
    // TODO a player should start with only one Settler and no boat
    this.board.placeUnit(Coord.create(2,0), new SailBoat());
  }
}

/**
 * Holds and exposes the game board, only this class can work on the Tiles
 *  x = horizontal
 *  y = vertical
 */
export class Board {
  private _tiles: Map<String, Tile> = new Map<String, Tile>();
  private boardSize: number;
  public activeTile: Tile;

  /**
   * Create a board that is boardSize wide, for now only 1 row is supported
   * @param {number} boardSize
   */
  constructor(boardSize: number = 5) {
    this.boardSize = boardSize;
    // init with Default board
    for (let i = 0; i < boardSize; i++) {
      this.setSeaTileAt(i, 0);
    }
    for (let j = 0; j < boardSize; j++) {
      this.setSeaTileAt(j, 1);
    }
    for (let k = 0; k < boardSize; k++) {
      this.setLandTileAt(k, 2);
    }
    for (let l = 0; l < boardSize; l++) {
      this.setLandTileAt(l, 3);
    }
  }

  setSeaTileAt(x: number, y: number): void {
    this._tiles.set(Coord.create(x, y).valueOf(), Board.createSeaTile(x, y));
  }
  setLandTileAt(x: number, y: number): void {
    this._tiles.set(Coord.create(x, y).valueOf(), Board.createLandTile(x, y));
  }

  static createLandTile(x: number, y: number): Tile {
    return Tile.create(Coord.create(x, y), new Land());
  }
  static createSeaTile(x: number, y: number): Tile {
    return Tile.create(Coord.create(x, y), new Sea());
  }

  /**
   * Put a unit in a Tile on the board
   * @param coord
   * @param unit
   * @return {Tile} tile
   */
  public placeUnit(coord: Coord, unit: Unit): Tile {
    console.log(`Board.placeUnit ${unit} @ ${coord}`);
    const tile: Tile = this._tiles.get(coord.valueOf());
    tile.unit = unit;
    this._tiles.set(coord.valueOf(), tile);
    return tile;
  }

  /**
   * Assuming a Tile has one Unit, move it in the Direction asked
   * @param {Tile} tile
   * @param {Direction} direction
   * @returns {Tile} tile to move to or original tile if toTile does not exist
   * @throws {Error} error when no tile
   */
  public moveUnit(tile: Tile, direction: Direction): Tile {
    const _tile: Tile = Tile.clone(tile);
    console.log(`moveUnit cloned a tile as: ${_tile}`);
    // TODO plugable rules, some design pattern? Strategy/Visitor?
    // guard clause for 'no unit on tile'
    if (_tile === undefined || _tile === null) {
      console.log("moveUnit says you need to select a unit");
      throw new Error("moveUnit says you need to select a unit");
    }
    const newCoord: Coord = Coord.createInDirection(_tile.coord, direction);
    const toTile: Tile = this.findTile(newCoord);
    console.log(`moveUnit trying to move a unit to Tile: [${JSON.stringify(toTile)}]`);
    if (toTile !== undefined && toTile.surface.isNavigateableWith(_tile.unit)) {
      toTile.unit = _tile.unit;
      _tile.unit = null;
      this._tiles.set(_tile.coord.valueOf(), _tile);
      this._tiles.set(newCoord.valueOf(), toTile);
      //console.dir(this._tiles);
      console.log(`moveUnit moved a unit to Tile: [${JSON.stringify(toTile)}]`);
      console.log(`moveUnit left the old tile as: [${JSON.stringify(_tile)}]`);
      //console.log(`the board: ${JSON.stringify(this._tiles)}`);
      return toTile;
    }
    console.log(`moveUnit cannot move to Tile @ ${newCoord} returning original ${tile}`);
    return tile;
  }

  public placeRoad(coord: Coord): void {
    // TODO check if there is a settler on the Tile
    const tile: Tile = this._tiles.get(coord.valueOf());
    if (tile && tile.surface instanceof Land && tile.unit instanceof Settler) {
      tile.surface.hasRoad = true;
      this._tiles.set(coord.valueOf(), tile);
    } else {
      console.log(`no tile found at ${coord}`);
    }
  }

  public placeCity(coord: Coord, city: City): void {
    // TODO check if there is a settler on the Tile
    const tile: Tile = this._tiles.get(coord.valueOf());
    if (tile && tile.surface instanceof Land) {
      tile.city = city;
      this._tiles.set(coord.valueOf(), tile);
    } else {
      console.log(`no tile found at ${coord}`);
    }
  }

  public get grid(): Array<Array<Tile>> {
    const out: Array<Array<Tile>> = this.partition(5, Array.from(this._tiles.values()));
    //console.log(`getGrid was called for ${JSON.stringify(out)}`);
    return out;
  }

  public findTile(coord: Coord): Tile {
    return this._tiles.get(coord.valueOf());
  }

  /**
   * Translate a Map of Tile to a 2d grid of Tile
   * @param {number} size of a row if tiles on grid
   * @param {Array<Tile>} coll
   * @returns {Array<Array<Tile>>}
   */
  private partition(size: number, coll: Array<Tile>): Array<Array<Tile>> {
    var res: Array<Array<Tile>> = [[]];
    for (var i = 0, l = coll.length; i < l; i += size) {
      res.push(coll.slice(i, i + size));
    }
    return res;
  }
}

/**
 * x = horizontal
 * y = vertical
 */
export class Coord {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Factory method
   * @param {number} x
   * @param {number} y
   * @returns {Coord} created obj
   */
  public static create(x: number, y: number): Coord {
    return new Coord(x, y);
  }

  /**
   * Create a Coord from a csv string desc.
   * @param {string} csv
   * @returns {Coord} created obj
   */
  public static createFromString(csv: string): Coord {
    const arr: Array<string> = csv.split(",");
    return Coord.create(parseInt(arr[0]), parseInt(arr[1]));
  }

  /**
   * Create a Coord based on another Coord and a Direction
   * @param {Coord} coord
   * @param {Direction} direction
   * @returns {Coord} calculated Coord
   */
  static createInDirection(coord: Coord, direction: Direction): Coord {
    let newX = coord.x;
    let newY = coord.y;
    switch (direction) {
      case Direction.Up:
        newY = coord.y - 1;
      break;
      case Direction.Right:
        newX = coord.x + 1;
      break;
      case Direction.Down:
        newY = coord.y + 1;
      break;
      case Direction.Left:
        newX = coord.x - 1;
      break;
    }
    console.log(`old [${coord.x}][${coord.y}] and new coords for move ${direction} are [${newX}][${newY}]`);
    return Coord.create(newX, newY);
  }

  public equals(otherCoord: Coord): boolean {
    return (this.x === otherCoord.x && this.y === otherCoord.y);
  }

  public toString(): string {
    return `${this.x},${this.y}`;
  }

  /**
   * returns the primitive value of this Object
   */
  public valueOf(): string {
    return this.toString();
  }
}

/**
 * Wraps a Unit and its Coordinates, has a Surface
 */
export class Tile {
  public coord: Coord;
  public surface: Surface;
  public unit: Unit;
  public city: City;

  constructor(coord: Coord, surface: Surface, unit?: Unit) {
    this.coord = coord;
    this.surface = surface;
    this.unit = unit;
  }
  static create(coord: Coord, surface: Surface, unit?: Unit): Tile {
    return new Tile(coord, surface, unit);
  }
  static clone(tile: Tile): Tile {
    return Tile.create(tile.coord, tile.surface, tile.unit);
  }
  public equals(anotherTile: Tile): boolean {
    return this.coord.equals(anotherTile.coord);
  }
  public toString(): string {
    // TODO use StringBuilder
    return `[${this.coord}] U: ${this.unit || "f"}, R: ${this.surface.hasRoad}, C: ${this.city || "f"}`;
  }
}

/**
 * Type of material as lowest level on a Tile
 */
export interface Surface {
  name: string;
  hasRoad: boolean;
  isNavigateableWith(unit: Unit): Boolean;
}

export class Land implements Surface {
  public name: string;
  public hasRoad: boolean = false;

  constructor() {
    this.name = "Land";
  };
  // public get hasRoad(): boolean {
  //   return this.hasRoad;
  // }
  // public set hasRoad(has: boolean) {
  //   this.hasRoad = has;
  // }
  isNavigateableWith(unit: Unit): Boolean {
    return (unit && unit.canMove && !unit.isAquatic);
  }
}

export class Sea implements Surface {
  public name: string;
  public hasRoad: boolean = false;

  constructor() {
    this.name = "Sea";
  };
  isNavigateableWith(unit: Unit): Boolean {
    return (unit && unit.canMove && unit.isAquatic);
  }
}

export enum Direction {
  Up,
  Right,
  Down,
  Left
}

// getKeyByValue(map: Map<String, Object>, value: string) {
//   return map.keys.find(key => map[key] === value);
// }

/*
 this.board.getByObjectKey = function(key: Object): Object {
 this.board.forEach((_value, _key) => {
 if (key.equals(_key)) {
 return _value;
 }
 });
 };
 */