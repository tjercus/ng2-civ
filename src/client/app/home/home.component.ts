import { Component, OnInit } from '@angular/core';
import {Unit, Land, Sea, Settler, Tile} from "./units";
import {Coord} from "./world";

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
  board: Map<Coord, Unit> = new Map<Coord, Unit>();
  selectedTile: Tile = null;

  // remember what is beneath the current coord of Settler
  //previousUnit: = null;
  private previousCoord: Coord = null;
  private previousUnit: Unit = null;

  /**
   *
   */
  constructor() {
    this.board.set(new Coord(0,0), new Land());
    this.board.set(new Coord(1,0), new Land());
    this.board.set(new Coord(2,0), new Land());
    this.board.set(new Coord(3,0), new Land());
    this.board.set(new Coord(4,0), new Land());

    // TODO set unit on the board, save original Unit somewhere
    this.placeUnit(new Coord(2, 0), new Settler());
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
    const startCoord: Coord = this.selectedTile.coord;
    const newCoord: Coord = new Coord(startCoord.x + 1, startCoord.y);
    this.moveUnit(startCoord, newCoord);
  }
  onDownClick() {}
  onLeftClick() {
    const startCoord: Coord = this.selectedTile.coord;
    const newCoord: Coord = new Coord(startCoord.x - 1, startCoord.y);
    this.moveUnit(startCoord, newCoord);
  }

  /**
   * switch units on the board with 'memory' in class scope
   * @param {Coord} fromCoord
   * @param {Coord} toCoord
   */
  private moveUnit(fromCoord: Coord, toCoord: Coord) {
    const aUnit: Unit = this.board.get(toCoord);
    const movableUnit: Unit = this.board.get(fromCoord);
    // set original surface (land/sea etc) unit back at previous coord
    this.board.set(fromCoord, this.previousUnit);
    this.previousUnit = aUnit; // action 1
    this.previousCoord = toCoord; // action 1
    this.board.set(toCoord, movableUnit); // action 2
  }

  private placeUnit(coord: Coord, unit: Unit) {
    // in case of first move on the board, including construction
    //if (this.previousCoord === null) {
    console.log(`previousCoord was null`);
    this.previousCoord = coord;
    this.previousUnit = this.board.get(coord);
    //} 
    this.board.set(coord, unit);
  }
}
