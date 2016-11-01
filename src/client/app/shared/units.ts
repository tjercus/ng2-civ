// units.ts 

// export interface Moveable {
//   // TODO
// }
// export interface Aquatic {
// }

export class Unit {
  name: string;
  canMove: boolean = true;
  isAquatic: boolean = false;

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
    this.canMove = false;
  }
}

export class Settler extends Unit {
	constructor() {
    super();
    this.name = "Settler";
	}
}

export class SailBoat extends Unit {
  constructor() {
    super();
    this.name = "SailBoat";
    this.isAquatic = true;
  }
}

