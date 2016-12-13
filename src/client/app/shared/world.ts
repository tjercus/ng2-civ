import {Unit, City, Settler, SailBoat, SettlerWorkType} from "./units";
import {miniBoardBuilder} from "./boardbuilders";

export class Game {
  //public players: Array<Player> = [];
  public year: number = 1;
  public board: Board;

  constructor(board: Board) {
    this.board = board;
    const settler = new Settler();
    this.board.activeTile = this.board.placeUnit(Coord.create(2,3), settler);
    // TODO a player should start with only one Settler and no Boat, in tests add a Boat when needed
    this.board.placeUnit(Coord.create(2,0), new SailBoat());
  }

  /**
   * called by button (and later automatically when Game detects all units have no more actions)
   */
  endTurn() {
    this.year++;
    console.log("Game.endTurn, now in year %f", this.year);
    this.board.onEndTurnNotification(this.year);
  }
}

/**
 * Holds and exposes the game board, only this class can work on the Tiles
 *  x = horizontal
 *  y = vertical
 */
export class Board {
  public _tiles: Map<String, Tile> = new Map<String, Tile>();
  public activeTile: Tile;

  /**
   * Create a board that is boardSize wide
   * @param {Map<String, Tile>} tiles
   */
  constructor(tiles?: Map<String, Tile>) {
    this._tiles = tiles || miniBoardBuilder(5);
  }

  /**
   * Put a unit in a Tile on the board
   * @param {Coord} coord where x, y
   * @param {Unit} unit to set
   * @return {Tile} tile
   */
  public placeUnit(coord: Coord, unit: Unit): Tile {
    console.log(`Board.placeUnit ${unit} @ ${coord}`);
    const tile: Tile = this._tiles.get(coord.valueOf());
    tile.unit = unit;
    // TODO since pass by ref, the next line could probably be removed if there will be no cloning
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
    // TODO plug-able rules, some design pattern? Strategy/Visitor?
    if (_tile === undefined || _tile === null) {
      console.log("moveUnit says you need to select a unit");
      throw new Error("moveUnit says you need to select a unit");
    }
    const newCoord: Coord = Coord.createInDirection(_tile.coord, direction);
    const toTile: Tile = this.findTile(newCoord);
    if (toTile !== undefined && toTile.surface.isNavigateableWith(_tile.unit)
        && _tile.unit.hasActionLeft()) {
      toTile.unit = _tile.unit;
      toTile.unit.remainingMovePoints--;
      _tile.unit = null;
      this._tiles.set(_tile.coord.valueOf(), _tile);
      this._tiles.set(newCoord.valueOf(), toTile);
      return toTile;
    }
    console.log(`moveUnit cannot move to Tile @ ${newCoord} returning original ${tile}`);
    return tile;
  }

  /**
   * Note that since 'tile' is a reference, it will be updated, no this._tiles.set is needed
   * @param {Coord} coord
   * @param {number} year
   */
  public buildRoad(coord: Coord, year: number): void {
    const tile: Tile = this._tiles.get(coord.valueOf());
    console.log(`Board.buildRoad() tile found as ${tile}`);
    if (tile && tile.surface instanceof Land && tile.unit instanceof Settler) {
      const s = <Settler> tile.unit;
      s.startWork(SettlerWorkType.Road, year, tile, this.onWorkDoneCb.bind(this));
    } else {
      console.log(`Board.buildRoad() no tile or settler found at ${coord}`);
    }
  }

  public buildCity(coord: Coord, year: number): void {
    const tile: Tile = this._tiles.get(coord.valueOf());
    if (tile && tile.surface instanceof Land && tile.unit instanceof Settler) {
      const s = <Settler> tile.unit;
      s.startWork(SettlerWorkType.City, year, tile, this.onWorkDoneCb.bind(this));
    } else {
      console.log(`no tile found at ${coord}`);
    }
  }

  public get grid(): Array<Array<Tile>> {
    return this.partition(5, Array.from(this._tiles.values()));
  }

  public findTile(coord: Coord): Tile {
    return this._tiles.get(coord.valueOf());
  }

  public onEndTurnNotification(newYear: number) {
    this._tiles.forEach(_tile => {
      if (_tile.unit) _tile.unit.onEndTurnNotification(newYear);
      if (_tile.city) _tile.city.onEndTurnNotification(newYear);
    });
  }

  /**
   * Translate a Map of Tile to a 2d grid of Tile
   * @param {number} size of a row if tiles on grid
   * @param {Array<Tile>} coll
   * @returns {Array<Array<Tile>>} 2d grid
   */
  private partition(size: number, coll: Array<Tile>): Array<Array<Tile>> {
    const res: Array<Array<Tile>> = [[]];
    for (let i = 0, l = coll.length; i < l; i += size) {
      res.push(coll.slice(i, i + size));
    }
    return res;
  }

  public hasActiveTile(): boolean {
    console.log(`Board.hasActiveTile ${this.activeTile instanceof Tile}`);
    return this.activeTile instanceof Tile;
    //return this.activeTile !== undefined && this.activeTile !== null;
  }

  public settleUnitInCity(tile: Tile): Tile {
    console.log(`Board.settleUnitInCity ${tile}`);
    if (tile.hasCity()) {
      const unit = tile.unit;
      tile.city.units.push(unit);
      tile.unit = null;
    }
    return tile;
  }

  private onWorkDoneCb(workType: SettlerWorkType, tile: Tile): void {
    console.log(`World.onWorkDoneCb called saying ${workType} is done for ${tile}`);
    console.dir(this._tiles);
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

  constructor(coord: Coord, surface: Surface, unit?: Unit, city?: City) {
    this.coord = coord;
    this.surface = surface;
    this.unit = unit;
    this.city = city;
  }
  static create(coord: Coord, surface: Surface, unit?: Unit, city?: City): Tile {
    return new Tile(coord, surface, unit, city);
  }
  static clone(tile: Tile): Tile {
    return Tile.create(tile.coord, tile.surface, tile.unit, tile.city);
  }
  public equals(anotherTile: Tile): boolean {
    return this.coord.equals(anotherTile.coord);
  }
  public toString(): string {
    // TODO use StringBuilder
    return `[${this.coord}] U: ${this.unit || "f"}, R: ${this.surface.hasRoad}, C: ${this.city || "f"}`;
  }
  public hasUnit(): boolean {
    return this.unit !== undefined && this.unit != null && this.unit instanceof Unit;
  }
  public hasCity(): boolean {
    return this.city !== undefined && this.city != null && this.city instanceof City;
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
