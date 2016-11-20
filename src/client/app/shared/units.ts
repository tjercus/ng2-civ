// units.ts

// export interface Moveable {
//   // TODO
// }
// export interface Aquatic {
// }

import {Tile} from "./world";
export class Unit {
  name: string = "Unit";
  attack: number = 1;
  defence: number = 1;
  canMove: boolean = true;
  isAquatic: boolean = false;
  health: number = 100;
  remainingMovePoints: number = 1;

  constructor() {
    //console.log(`name is ${this.name}`);
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

  public onEndTurnNotification(newYear: number): void {
    // TODO fix
    console.log("Unit end turn resetting movepoints");
    this.remainingMovePoints = 1;
  }
}

export class City extends Unit {
  public size: number = 1;
  public buildings: Array<Building> = [];
  public units: Array<Unit> = [];
  public production: number = 0;
  public food: number = 0;

  constructor(name: string = `City${Math.floor(Math.random() * (9999))}`) {
    super();
    this.name = name;
    this.canMove = false;
  }
  public productionPerTurn(): number {
    return 1;
  }

  /**
   * Food added to storage or taken out for extra upkeep.
   * @returns {number} more or less can be negative or positive depending on balance
   */
  public foodPerTurn(): number {
    const f: number = 1 - this.calculateUnitsUpkeepCost();
    return f;
  }
  public hasActionLeft(): boolean {
    return false; // Cities never have actions left
  }
  public onEndTurnNotification(newYear: number): void {
    this.production = this.production + this.productionPerTurn();
    this.food = this.food + this.foodPerTurn();
    if (this.canGrow()) {
      this.size++;
      this.food = this.food - this.calculateGrowCost();
    }
    console.log(`City.onEndTurnNotification, size ${this.size} and food: ${this.food}`);
  }
  private canGrow = () => (this.food >= this.calculateGrowCost());
  private findGranary(building: Building): boolean { return building instanceof Granary };
  private hasGranary = () => {
    let has = this.units.find(this.findGranary);
    console.log(`hasGranary ${has}`);
    return has;
  }
  private calculateGrowCost = () => (this.hasGranary()) ? 5 : 10;
  private calculateUnitsUpkeepCost = () => this.units.length;
}

export class Settler extends Unit {
  // TODO perhaps encapsulate into a Work class so all work related properties will be updated atomically
  private workingOn: SettlerWorkType = SettlerWorkType.Nothing;
  private workFinishedInYear: number;
  private workDoneCb: Function = null;
  private workTile: Tile = null;

  constructor() {
    super();
    this.name = "Settler";
	}

	public hasActionLeft(): boolean {
    return this.remainingMovePoints > 0 && this.workingOn === SettlerWorkType.Nothing;
  }

  /**
   * Note that stopWork is not supported for now, workStatus will change in workFinishedYear
   * @param {SettlerWorkType} work to do
   * @param {number} currentYear as start year and finish year can be calculated based on duration of work
   * @param {Tile} tile where the work is on
   * @param {Function} workDoneCb callback to be called and executed on the using class (within it's bound context)
   * @return {void} none
   */
  public startWork(work: SettlerWorkType, currentYear: number, tile: Tile, workDoneCb: Function): void {
    console.log(`Settler.startWork ${work} currentYear ${currentYear}`);
    this.workingOn = work;
    this.workFinishedInYear = currentYear + ((work === SettlerWorkType.City) ? 1 : 3);
    this.workTile = tile;
    this.workDoneCb = workDoneCb;
  }

  public onEndTurnNotification(newYear: number): void {
    super.onEndTurnNotification(newYear);
    console.log(`Unit received onEndTurnNotification new year ${newYear}`);
    if (this.workFinishedInYear === newYear) {
      if (this.workingOn === SettlerWorkType.City) {
        this.workTile.city = new City();
      }
      if (this.workingOn === SettlerWorkType.Road) {
        this.workTile.surface.hasRoad = true;
      }
      // call callback sent earlier by user of this Unit
      //  and add details about work, for notification
      this.workDoneCb(this.workingOn, this.workTile);

      this.workDoneCb = null;
      this.workingOn = SettlerWorkType.Nothing;
      this.workFinishedInYear = null;
      this.workTile = null;
    }
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

class Building {}

export class Granary extends Building {
  // City uses only 50% of Food for growth.
}

export enum SettlerWorkType {
  Nothing,
  Road,
  RailRoad,
  City,
  Irrigation,
  Fort,
  Mine,
}
