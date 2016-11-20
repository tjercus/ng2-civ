import {City, Militia, Granary} from "./units";

const endTurn = (city, x) => {
  for (let i = 0; i < x; i++) {
    city.onEndTurnNotification(i);
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
      city.onEndTurnNotification(2);
      expect(city.food).toEqual(1);
      expect(city.production).toEqual(1);
    });
    it("should increase size after turn ends and enough extra food is available", () => {
      const city: City = new City();
      // enough turns to increase size
      endTurn(city, 10);
      expect(city.size).toEqual(2);
      expect(city.food).toEqual(0);
    });
    it("should increase size faster when a granary is present", () => {
      const city: City = new City();
      city.buildings.push(new Granary());
      endTurn(city, 6);
      expect(city.size).toEqual(2);
      expect(city.food).toEqual(0);
    });

    it("should decrease food supplies when a city has a unit settled", () => {
      const city: City = new City();
      const militia: Militia = new Militia();
      city.units.push(militia);
      city.onEndTurnNotification(2);
      expect(city.food).toEqual(0);
    });

  });

}
