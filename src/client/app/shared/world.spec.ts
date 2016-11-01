import {Board, Coord, Direction, Tile} from "./world";
import {Settler, Unit, SailBoat} from "./units";

export function main() {
  describe("Board.placeUnit", () => {
    it("should place a Unit on a Coord", () => {
      const board: Board = new Board(10);
      const coord: Coord = Coord.create(1, 0);
      board.placeUnit(coord, new Settler());
      const unit: Unit = board.findTile(coord).unit;
      expect(unit.name).toEqual("Settler");
    });
  });

  describe("Board.moveUnit", () => {
    it("should move a Unit from one Tile to another in a Direction", () => {
      const board: Board = new Board(10);
      const coord: Coord = Coord.create(1, 0);
      board.placeUnit(coord, new Settler());
      const newCoord: Coord = Coord.create(2, 0);
      const newTile: Tile = board.moveUnit(board.findTile(coord), Direction.Right);
      expect(newTile.unit instanceof Settler).toBe(true);
      expect(newTile.coord).toEqual(newCoord);
    });

    it("should NOT move a Settler from one Land Tile to a Sea Tile", () => {
      const board: Board = new Board(5);
      console.log("ORIGINAL BOARD: " + JSON.stringify(board.tiles));
      const coord: Coord = Coord.create(4, 0); // Land
      board.placeUnit(coord, new Settler());
      const oldTile: Tile = board.findTile(coord);
      console.log("1: " + JSON.stringify(oldTile));
      expect(oldTile.unit instanceof Settler).toBe(true);
      expect(oldTile.coord.valueOf()).toEqual("4,0");
      console.log("1.5: " + JSON.stringify(oldTile));
      const newTile: Tile = board.moveUnit(oldTile, Direction.Right);
      console.log("2: " + JSON.stringify(oldTile));
      console.log("3: " + JSON.stringify(newTile));
      expect(newTile.unit instanceof Settler).toBe(true);
      expect(newTile.coord.valueOf()).toEqual("4,0");
      console.log(JSON.stringify(board.tiles));
    });

    it("should NOT move a SailBoat from one Sea Tile to a Land Tile", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(5, 0); // Seas
      board.placeUnit(coord, new SailBoat());
      const oldTile: Tile = board.findTile(coord);
      expect(oldTile.unit instanceof SailBoat).toBe(true);
      expect(oldTile.coord).toEqual(coord);
      const newTile: Tile = board.moveUnit(board.findTile(coord), Direction.Left);
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
};