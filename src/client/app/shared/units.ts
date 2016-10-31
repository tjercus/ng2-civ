// units.ts 

//import {Coord} from "./world";

export interface Movable {
  // TODO
}

export class Unit {
  name: string;

  constructor() {
    console.log(`name is ${this.name}`);
  }
  public toString(): string {
    return this.name;
  }
}

export class City extends Unit {
  constructor() {
    super();
    this.name = "City";
  }
}

export class Settler extends Unit  implements Movable {
	constructor() {
    super();
    this.name = "Settler";
	}
}

