import {Unit} from "./units";
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
    return Coord.create(parseInt(arr[0]), parseInt(arr[1])); // TODO parseInt
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

export interface Surface {
  name: string;
}

// Or: implements Mappable extends Unit
export class Land implements Surface {
  public name: string;
  constructor() { this.name = "Land"; };
}

export class Sea implements Surface {
  public name: string;
 constructor() { this.name = "Sea"; }; 
}