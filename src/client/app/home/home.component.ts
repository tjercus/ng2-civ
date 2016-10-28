import { Component, OnInit } from '@angular/core';
import {Unit, Land, Sea, Settler, Tile} from "./units";
import {Coord} from "./world";
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
  board: Map<String, Unit> = new Map<String, Unit>();
  selectedTile: Tile = null;

  // remember what is beneath the current coord of Settler
  //previousUnit: = null;
  private previousCoord: Coord = null;
  private previousUnit: Unit = null;

  /**
   *
   */
  constructor() {
    this.board.set(Coord.create(0,0).valueOf(), new Land());
    this.board.set(Coord.create(1,0).valueOf(), new Land());
    this.board.set(Coord.create(2,0).valueOf(), new Land());
    this.board.set(Coord.create(3,0).valueOf(), new Land());
    this.board.set(Coord.create(4,0).valueOf(), new Land());

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
    if (this.selectedTile) {
      const startCoord: Coord = this.selectedTile.coord;
      const newCoord: Coord = Coord.create(startCoord.x - 1, startCoord.y);
      this.moveUnit(startCoord, newCoord);
    } else {
      console.log("no move without a selected tile");
    }
  }

  /**
   * switch units on the board with 'memory' in class scope
   * @param {Coord} fromCoord
   * @param {Coord} toCoord
   */
  private moveUnit(fromCoord: Coord, toCoord: Coord) {
    console.log(`moveUnit ${fromCoord} to ${toCoord}`);
    const aUnit: Unit = this.board.get(toCoord.valueOf());
    const movableUnit: Unit = this.board.get(fromCoord.valueOf());
    // set original surface (land/sea etc) unit back at previous coord
    this.board.set(fromCoord.valueOf(), this.previousUnit);
    this.previousUnit = aUnit; // action 1
    this.previousCoord = toCoord; // action 1
    this.board.set(toCoord.valueOf(), movableUnit); // action 2
  }

  private placeUnit(coord: Coord, unit: Unit) {
    console.log(`placeUnit ${unit} @ ${coord}`);
    this.previousCoord = coord;
    this.previousUnit = this.board.get(coord.valueOf());
    this.board.set(coord.valueOf(), unit);
    console.dir(this.board);
  }
}
