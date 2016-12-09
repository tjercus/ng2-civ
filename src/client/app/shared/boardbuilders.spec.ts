
import {boardbuilders} from "./units";
import {Tile, Land} from "./world";
import {csvBoardBuilder} from "./boardbuilders";
export function main() {

  describe("CSV boardbuilder", () => {
    it("should build a tilemap from a csv string", () => {
      const csv =`
      l|s|l,
      s|c|s,
      s|s|s`;
      const tiles: Map<String, Tile> = csvBoardBuilder(csv);
      expect(tiles.get("0,0").surface instanceof Land).toBeTruthy();
      //expect(tiles.get("0,").surface instanceof Land).toBeTruthy();
    });
  });

}