// units.ts 

import {Coord} from "./world";

export class Unit implements Mappable {
  name: string;
  constructor() {
    console.log(`name is ${this.name}`);
  }
  public toString() : string {
    return this.name;
  }
}
export interface Mappable {
  toString(): string;
}

// Or: implements Mappable extends Unit
export class Land extends Unit {
	public name: string = "Land";
}

export class Sea extends Unit {
	public name: string = "Sea"; 
}

export class Settler extends Unit {
	public name: string = "Settler";
}

/**
 * Wraps a Unit and its Coordinates
 */
export class Tile implements Mappable {
  public name: string;
  public coord: Coord;
  constructor(coord: Coord, unit: Unit) {
    this.name = unit.name;
    this.coord = coord;
  }
  public toString() : string {
    return `${this.name} [${this.coord}]`;
  }
}