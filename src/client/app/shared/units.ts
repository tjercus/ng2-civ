// units.ts

// export interface Moveable {
//   // TODO
// }
// export interface Aquatic {
// }

import {Tile} from "./world";
export class Unit {
  name: string = "Unit";
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
  constructor(name: string = `City${Math.floor(Math.random() * (9999))}`) {
    super();
    this.name = name;
    this.canMove = false;
    this.remainingMovePoints = 1;
  }
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

export enum SettlerWorkType {
  Nothing,
  Road,
  RailRoad,
  City,
  Irrigation,
  Fort,
  Mine,
}
