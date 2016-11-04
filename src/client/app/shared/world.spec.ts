import {Board, Coord, Direction, Tile} from "./world";
import {Settler, Unit, SailBoat} from "./units";

export function main() {
  describe("Board.placeUnit", () => {
    it("should place a Unit on a Coord", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      board.placeUnit(coord, new Settler());
      const unit: Unit = board.findTile(coord).unit;
      expect(unit.name).toEqual("Settler");
    });
  });

  describe("Board.moveUnit", () => {
    it("should move a Unit from one Tile to another in a Direction", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      board.placeUnit(coord, new Settler());
      const newCoord: Coord = Coord.create(1, 3);
      const newTile: Tile = board.moveUnit(board.findTile(coord), Direction.Right);
      const oldTile: Tile = board.findTile(coord);
      expect(newTile.unit instanceof Settler).toBe(true);
      expect(oldTile.unit instanceof Settler).toBe(false);
      expect(newTile.coord).toEqual(newCoord);
    });

    it("should NOT move a Settler from one Land Tile to a Sea Tile", () => {
      const board: Board = new Board(5);
      console.log("ORIGINAL BOARD: " + JSON.stringify(board.tiles));
      const coord: Coord = Coord.create(0, 2); // Land
      board.placeUnit(coord, new Settler());
      const oldTile: Tile = board.findTile(coord);
      console.log("1: " + JSON.stringify(oldTile));
      expect(oldTile.unit instanceof Settler).toBe(true);
      expect(oldTile.coord.valueOf()).toEqual("0,2");
      console.log("1.5: " + JSON.stringify(oldTile));
      const newTile: Tile = board.moveUnit(oldTile, Direction.Up);
      console.log("2: " + JSON.stringify(oldTile));
      console.log("3: " + JSON.stringify(newTile));
      expect(newTile.unit instanceof Settler).toBe(true);
      expect(newTile.coord.valueOf()).toEqual("0,2");
      console.log(JSON.stringify(board.tiles));
    });

    it("should NOT move a SailBoat from one Sea Tile to a Land Tile", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(1, 1); // Sea
      board.placeUnit(coord, new SailBoat());
      const oldTile: Tile = board.findTile(coord);
      expect(oldTile.unit instanceof SailBoat).toBe(true);
      expect(oldTile.coord).toEqual(coord);
      const newTile: Tile = board.moveUnit(board.findTile(coord), Direction.Down);
      expect(newTile.unit instanceof SailBoat).toBe(true);
      expect(newTile.coord).toEqual(coord);
    });
  });

  /**
   * x = horizontal
   * y = vertical
   */
  describe("Coord.createInDirection", () => {
    it("should create a Coord in Direction.Up", () => {
      const newCoord: Coord = Coord.createInDirection(Coord.create(0, 0), Direction.Up);
      expect(newCoord.x).toEqual(0);
      expect(newCoord.y).toEqual(-1);
    });
    it("should create a Coord in Direction.Right", () => {
      const newCoord: Coord = Coord.createInDirection(Coord.create(0, 0), Direction.Right);
      expect(newCoord.x).toEqual(1);
      expect(newCoord.y).toEqual(0);
    });
    it("should create a Coord in Direction.Down", () => {
      const newCoord: Coord = Coord.createInDirection(Coord.create(0, 0), Direction.Down);
      expect(newCoord.x).toEqual(0);
      expect(newCoord.y).toEqual(1);
    });
    it("should create a Coord in Direction.Left", () => {
      const newCoord: Coord = Coord.createInDirection(Coord.create(0, 0), Direction.Left);
      expect(newCoord.x).toEqual(-1);
      expect(newCoord.y).toEqual(0);
    });
  });

  describe("Coord.createFromSpec", () => {
    it("should create a Coord from a csv separated string", () => {
      const newCoord: Coord = Coord.createFromString("4,3");
      expect(newCoord.x).toEqual(4);
      expect(newCoord.y).toEqual(3);
    });
  });
  describe("Coord.equals", () => {
    it("should say true when x and y are same for another object", () => {
      const newCoord: Coord = Coord.create(4, 3);
      const anotherCoord: Coord = Coord.create(4, 3);
      expect(newCoord).toEqual(anotherCoord);
      expect(newCoord.equals(anotherCoord)).toBe(true);
    });
    it("should say false when x and y are NOT the same for another object", () => {
      const newCoord: Coord = Coord.create(4, 3);
      const anotherCoord: Coord = Coord.create(3, 4);
      expect(newCoord).not.toEqual(anotherCoord);
      expect(newCoord.equals(anotherCoord)).toBe(false);
    });
  });

};
