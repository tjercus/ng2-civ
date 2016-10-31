import {Unit} from "./units";
import {Direct} from "protractor/built/driverProviders";

// function clone(obj:any) {
//   return JSON.parse(JSON.stringify(obj));
// }

/**
 * Holds and exposes the game board, only this class can work on the Tiles
 *  x = horizontal
 *  y = vertical
 */
export class Board {
  private _tiles: Map<String, Tile> = new Map<String, Tile>();

  /**
   * Create a board that is boardSize wide, for now only 1 row is supported
   * @param {number} boardSize
   */
  constructor(boardSize: number) {
    for (let i = 0; i < boardSize; i++) {
      this._tiles.set(Coord.create(i, 0).valueOf(), this.createLandTile(i, 0));
    }
  }

  /**
   * Put a unit in a Tile on the board
   * @param coord
   * @param unit
   */
  public placeUnit(coord: Coord, unit: Unit): void {
    console.log(`Board.placeUnit ${unit} @ ${coord}`);
    const tile: Tile = this._tiles.get(coord.valueOf());
    tile.unit = unit;
    this._tiles.set(coord.valueOf(), tile);
  }

  /**
   * Assuming a Tile has one Unit, move it in the Direction asked
   * @param {Tile} tile
   * @param {Direction} direction
   * @returns {Tile} tile to move to
   * @throws {MoveException} ex
   */
  public moveUnit(tile: Tile, direction: Direction): Tile {
    // guard clause for 'no unit on tile'
    if (tile === undefined || tile === null) {
      console.log("moveUnit says you need to select a unit");
      return;
    }
    // TODO guard clause for bordercontrol
    const newCoord: Coord = Coord.createInDirection(tile.coord, direction);
    const toTile: Tile = this._tiles.get(newCoord.valueOf());
    toTile.unit = tile.unit;
    tile.unit = null;
    this._tiles.set(tile.coord.valueOf(), tile);
    this._tiles.set(newCoord.valueOf(), toTile);
    //console.dir(this._tiles);
    return toTile;
  }

  public get tiles(): Array<Tile> {
    return Array.from(this._tiles.values());
  }

  public findTile(coord: Coord): Tile {
    return this._tiles.get(coord.valueOf());
  }

  private createLandTile(x: number, y: number): Tile {
    return Tile.create(Coord.create(x, y), new Land());
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

  public static createFromString(csv: string) {
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
        newY = coord.x - 1;
      break;
      case Direction.Right:
        newX = coord.x + 1;
      break;
      case Direction.Down:
        newY = coord.x + 1;
      break;
      case Direction.Left:
        newX = coord.x - 1;
      break;
    }
    console.log(`new coords for move ${direction} are [${newX}][${newY}]`);
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

  constructor(coord: Coord, surface: Surface, unit?: Unit) {
    this.coord = coord;
    this.surface = surface;
    this.unit = unit;
  }
  static create(coord: Coord, surface: Surface, unit?: Unit): Tile {
    return new Tile(coord, surface, unit);
  }
  public equals(anotherTile: Tile): boolean {
    return this.coord.equals(anotherTile.coord);
  }
  public toString() : string {
    return `[${this.coord}] has ${this.unit || "no unit"}`;
  }
}

/**
 * Type of material as lowest level of a Tile
 */
export interface Surface {
  name: string;
}

export class Land implements Surface {
  public name: string;
  constructor() {
    this.name = "Land";
  };
}

export class Sea implements Surface {
  public name: string;
  constructor() {
    this.name = "Sea";
  };
}

export enum Direction {
  Up,
  Down,
  Left,
  Right
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