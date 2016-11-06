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
  lastActionYear: number = 1;

  constructor() {
    console.log(`name is ${this.name}`);
  }
  public toString(): string {
    return this.name;
  }
  public hasActionLeftInTurn(currentYear: number): boolean {

  }
}

export class City extends Unit {
  public size: number = 1;
  constructor(name: string = `City${Math.floor(Math.random() * (9999 - 0)) + 0}`) {
    super();
    this.name = name;
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

