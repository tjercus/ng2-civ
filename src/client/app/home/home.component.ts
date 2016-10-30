import { Component, OnInit } from '@angular/core';
import {Unit, Settler, City} from "./units";
import {Coord, Land, Sea, Tile, Surface} from "./world";
//import {Map} from "immutable";
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {

  // errorMessage: string;
  // x = horizontal
  // y = vertical
  board: Map<String, Tile> = new Map<String, Tile>();
  selectedTile: Tile = null;

  /**
   *
   */
  constructor() {
    this.board.set(Coord.create(0,0).valueOf(), Tile.create(Coord.create(0,0), new Land()));
    this.board.set(Coord.create(1,0).valueOf(), Tile.create(Coord.create(1,0), new Land()));
    this.board.set(Coord.create(2,0).valueOf(), Tile.create(Coord.create(2,0), new Land()));
    this.board.set(Coord.create(3,0).valueOf(), Tile.create(Coord.create(3,0), new Land()));
    this.board.set(Coord.create(4,0).valueOf(), Tile.create(Coord.create(4,0), new Land()));

    // TODO set unit on the board, save original Unit somewhere
    this.placeUnit(Coord.create(2,0), new Settler());

    //const key1: Coord = new Coord(2,0);
    //const key2: Coord = new Coord(2,0);
    //console.log(`===? ${key1 === key2} or equals? ${key1.equals(key2)}`);

    /*
    TODO move to an object Board extends Map
    this.board.getByObjectKey = function(key: Object): Object {
      this.board.forEach((_value, _key) => {
        if (key.equals(_key)) {
          return _value;
        }
      });
    };
    */
  }

  // getKeyByValue(map: Map<String, Object>, value: string) {
  //   return map.keys.find(key => map[key] === value);
  // }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
  }

  onSelectTileClick(tile: Tile) {
    this.selectedTile = tile;
    console.log(`HomeComponent onSelectTileClick ${tile.toString()}`);
  }

  onUpClick() {
  }
  onRightClick() {
    if (this.selectedTile) {
      // TODO fix
      const startCoord: Coord = this.selectedTile.coord;
      console.log(`onRightClick ${startCoord}`);
      const newX = startCoord.x + 1;
      const newY = startCoord.y;
      console.log(`new coords for move right [${newX}][${newY}]`);
      const newCoord: Coord = Coord.create(newX, newY);
      this.moveUnit(startCoord, newCoord);
    } else {
      console.log("no move without a selected tile");
    }
  }
  onDownClick() {}
  onLeftClick() {
    // if (this.selectedTile) {
    //   const startCoord: Coord = this.selectedTile.coord;
    //   const newCoord: Coord = Coord.create(startCoord.x - 1, startCoord.y);
    //   this.moveUnit(startCoord, newCoord);
    // } else {
    //   console.log("no move without a selected tile");
    // }
  }

  /**
   * move a unit from one tile to another on the board
   * @param {Coord} fromCoord
   * @param {Coord} toCoord
   */
  private moveUnit(fromCoord: Coord, toCoord: Coord) {
    // TODO guard clause for bordercontrol
    console.log(`moveUnit ${fromCoord} to ${toCoord}`);
    const fromTile: Tile = this.board.get(fromCoord.valueOf());
    const toTile: Tile = this.board.get(toCoord.valueOf());
    const unit: Unit = fromTile.unit;
    fromTile.unit = null;
    toTile.unit = unit;
    this.board.set(fromCoord.valueOf(), fromTile);
    this.board.set(toCoord.valueOf(), toTile);
  }

  private placeUnit(coord: Coord, unit: Unit) {
    console.log(`placeUnit ${unit} @ ${coord}`);
    const tile: Tile = this.board.get(coord.valueOf());
    tile.unit = unit;
    this.board.set(coord.valueOf(), tile);
    console.dir(this.board);
    //this.board.set(Coord.create(5,0).valueOf(), Tile.create(Coord.create(5,0), new Sea()));
  }
}
