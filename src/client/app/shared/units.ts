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
  health: number = 100;
  remainingMovePoints: number = 1;

  constructor() {
    console.log(`name is ${this.name}`);
  }
  public toString(): string {
    return this.name;
  }

  /**
   * Note that different types of Units need to implement it differently
   * @returns {boolean} has some action left in current turn?
   */
  public hasActionLeft(): boolean {
    return (this.remainingMovePoints > 0);
  }
}

export class City extends Unit {
  public size: number = 1;
  constructor(name: string = `City${Math.floor(Math.random() * (9999))}`) {
    super();
    this.name = name;
    this.canMove = false;
    this.remainingMovePoints = 1;
  }
}

export class Settler extends Unit {
  public workingOn: SettlerWork;
  public workFinishedInYear: number;

  constructor() {
    super();
    this.name = "Settler";
    this.workingOn = SettlerWork.Nothing;
    this.workFinishedInYear = null;
	}

	public hasActionLeft(): boolean {
    return this.remainingMovePoints > 0 || this.workingOn === SettlerWork.Nothing;
  }

  /**
   * Note that stopWork is not supported for now, workStatus will change in workFinishedYear
   * @param {SettlerWork} work to do
   * @param {number} currentYear as start year and finish year can be calculated based on duration of work
   */
  startWork(work: SettlerWork, currentYear: number) {
    this.workingOn = work;
    this.workFinishedInYear = currentYear + 3;
  }
}

export class SailBoat extends Unit {
  constructor() {
    super();
    this.name = "SailBoat";
    this.isAquatic = true;
  }
}

export class Militia extends Unit {
  constructor() {
    super();
    this.name = "Militia";
  }
}

export enum SettlerWork {
  Nothing,
  Road,
  RailRoad,
  City,
  Irrigation,
  Fort,
  Mine,
}
