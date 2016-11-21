import {City, Militia, Granary, Unit} from "./units";
import {Board} from "./world";

// TODO move to shared lib
export const endTurns = (obj: Unit|Board, nrOfTurns: number, startYear: number = 2) => {
  // [...Array(nrOfTurns).keys()].forEach((y) => {city.onEndTurnNotification(y)});
  for (let i = startYear; i < (nrOfTurns + startYear); i++) {
    obj.onEndTurnNotification(i);
  }
}

export function main() {

  describe("City", () => {
    it("should construct with a default name and size", () => {
      const city: City = new City();
      expect(city.name).toContain("City");
      expect(city.size).toEqual(1);
    });
    it("should have more food and production after turn ends", () => {
      const city: City = new City();
      endTurns(city, 1);
      expect(city.food).toEqual(1);
      expect(city.production).toEqual(1);
    });
    it("should increase size after turn ends and enough extra food is available", () => {
      const city: City = new City();
      // enough turns to increase size
      endTurns(city, 10);
      expect(city.size).toEqual(2);
      expect(city.food).toEqual(0);
    });
    it("should increase size faster when a granary is present", () => {
      const city: City = new City();
      city.buildings.push(new Granary());
      endTurns(city, 5);
      expect(city.size).toEqual(2);
      expect(city.food).toEqual(0);
    });

    it("should decrease food supplies when a city has a unit settled", () => {
      const city: City = new City();
      const militia: Militia = new Militia();
      city.units.push(militia);
      endTurns(city, 1);
      expect(city.food).toEqual(0);
    });
    it("should decrease food supplies when a city has two unit settled", () => {
      const city: City = new City();
      const militia: Militia = new Militia();
      const militia2: Militia = new Militia();
      city.units.push(militia, militia2);
      endTurns(city, 1);
      expect(city.food).toEqual(-1);
    });
  });

}
