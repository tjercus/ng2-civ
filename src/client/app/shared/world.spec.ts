import {Board, Coord, Direction, Tile, Game, Land} from "./world";
import {Settler, Unit, SailBoat, Militia} from "./units";

export function main() {

  describe("Game.constructor", () => {
    it("should construct with year 1", () => {
      const game: Game = new Game(new Board());
      expect(game.year).toEqual(1);
    });
  });

  describe("Board.placeUnit", () => {
    it("should place a Unit on a Coord", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      board.placeUnit(coord, new Settler());
      const unit: Unit = board.findTile(coord).unit;
      expect(unit.name).toEqual("Settler");
    });
  });

  describe("Board.buildRoad", () => {
    it("should place a road on a Land Surface if there is a Settler on it", () => {
      let currentYear: number = 1;
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      const tile = board.placeUnit(coord, new Settler());
      board.buildRoad(coord, currentYear);
      [2,3,4].forEach((y) => {board.notifyEndTurn(y)});
      expect(tile.surface.hasRoad).toEqual(true);
    });
    it("should NOT place a road on a Land Surface if there is no Settler on it", () => {
      const currentYear: number = 1;
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      board.placeUnit(coord, new Militia());
      board.buildRoad(coord, currentYear);
      const tile: Tile = board.findTile(coord);
      expect(tile.surface.hasRoad).toEqual(false);
    });
    it("should NOT place a road on a Surface if it has a City", () => {
      // TODO implement test when turns with movepoints are in place
    });
    it("should NOT place a road on a Surface in the same turn", () => {
      // TODO implement test when turns with movepoints are in place
    });
    it("should NOT place a road on a Land Surface if it has a Road", () => {
      // TODO implement test when turns with movepoints are in place
    });
    it("should NOT place a road on a Sea Surface", () => {
      const currentYear: number = 1;
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 0); // Sea
      board.placeUnit(coord, new Settler());
      board.buildRoad(coord, currentYear);
      const tile: Tile = board.findTile(coord);
      expect(tile.surface.hasRoad).toEqual(false);
    });
  });

  describe("Board.buildCity", () => {
    it("should place a City on a Land Surface if there is a Settler on it", () => {
    });
  });

  describe("Board.hasActionLeft", () => {
    it("should return false when it is working on something", () => {
      const currentYear: number = 1;
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      const settler = new Settler();
      const tile = board.placeUnit(coord, settler);
      board.buildRoad(coord, currentYear);
      expect(tile.unit.hasActionLeft()).toEqual(false);
      //expect(settler.hasActionLeft()).toEqual(false);
    });
    it("should return true when it is not working on something", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      const settler = new Settler();
      board.placeUnit(coord, settler);
      expect(settler.hasActionLeft()).toEqual(true);
    });
    it("should return false when it has moved in this turn", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      const settler = new Settler();
      board.placeUnit(coord, settler);
      board.moveUnit(board.findTile(coord), Direction.Right);
      expect(settler.hasActionLeft()).toEqual(false);
    });
    it("should return true when it has not moved in this turn", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      const settler = new Settler();
      board.placeUnit(coord, settler);
      expect(settler.hasActionLeft()).toEqual(true);
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

    it("should not move a Unit if it has no actions left", () => {
      const currentYear: number = 1;
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      const settler = new Settler();
      board.placeUnit(coord, settler);
      board.buildRoad(coord, currentYear);
      expect(settler.hasActionLeft()).toEqual(false);
      const newTile: Tile = board.moveUnit(board.findTile(coord), Direction.Right);
      const oldTile: Tile = board.findTile(coord);
      expect(oldTile).toEqual(newTile);
      expect(oldTile.unit instanceof Settler).toBe(true);
    });

    it("should keep the road after a move", () => {
      const currentYear: number = 1;
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 3);
      board.placeUnit(coord, new Settler());
      board.buildRoad(coord, currentYear);
      [2,3,4].forEach((y) => {board.notifyEndTurn(y)});
      const newTile: Tile = board.moveUnit(board.findTile(coord), Direction.Right);
      const oldTile: Tile = board.findTile(coord);
      expect(oldTile.surface.hasRoad).toBe(true);
      expect(newTile.surface.hasRoad).toBe(false);
    });

    it("should NOT move a Settler from one Land Tile to a Sea Tile", () => {
      const board: Board = new Board(5);
      const coord: Coord = Coord.create(0, 2); // Land
      board.placeUnit(coord, new Settler());
      const oldTile: Tile = board.findTile(coord);
      expect(oldTile.unit instanceof Settler).toBe(true);
      expect(oldTile.coord.valueOf()).toEqual("0,2");
      const newTile: Tile = board.moveUnit(oldTile, Direction.Up);
      expect(newTile.unit instanceof Settler).toBe(true);
      expect(newTile.coord.valueOf()).toEqual("0,2");
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

  describe("Tile.equals", () => {
    it("should say true when x and y are same for another object", () => {
      const newCoord: Coord = Coord.create(4, 3);
      const tileOne: Tile = Tile.create(newCoord, new Land());
      const tileTwo: Tile = Tile.create(newCoord, new Land());
      expect(tileOne.equals(tileTwo)).toBe(true);
    });
    it("should say false when x and y are NOT the same for another object", () => {
      const newCoord: Coord = Coord.create(4, 3);
      const anotherCoord: Coord = Coord.create(3, 4);
      const tileOne: Tile = Tile.create(newCoord, new Land());
      const tileTwo: Tile = Tile.create(anotherCoord, new Land());
      expect(tileOne.equals(tileTwo)).toBe(false);
    });
  });

};
