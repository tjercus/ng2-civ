import {Unit} from "./units";

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
  public placeUnit(coord: Coord, unit: Unit) {
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
    // TODO guard clause for 'no unit on tile'
    // TODO guard clause for bordercontrol
    let newX = tile.coord.x;
    let newY = tile.coord.y;
    if (direction === Direction.Right) {
      newX = tile.coord.x + 1;
      console.log(`new coords for move right [${newX}][${newY}]`);
    }
    if (direction === Direction.Left) {
      newX = tile.coord.x - 1;
      console.log(`new coords for move left [${newX}][${newY}]`);
    }
    const newCoord: Coord = Coord.create(newX, newY);

    console.log(`Board.moveUnit ${tile.coord} to ${newCoord}`);
    const toTile: Tile = this._tiles.get(newCoord.valueOf());
    toTile.unit = tile.unit;
    tile.unit = null;
    this._tiles.set(tile.coord.valueOf(), tile);
    this._tiles.set(newCoord.valueOf(), toTile);
    console.log(`Board.toTile is ${JSON.stringify(toTile)}`);
    console.log("Board.moveUnit, world after:");
    console.dir(this._tiles);
    return toTile;
  }

  public get tiles(): Array<Tile> {
    return Array.from(this._tiles.values());
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
 * Wraps a Unit and its Coordinates
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
  // public void setUnit(unit: Unit): void {
  //   this.unit = unit;
  // }
  // public void setCoord(coord: Coord): void {
  //   this.coord = coord;
  // }
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

// Or: implements Mappable extends Unit
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