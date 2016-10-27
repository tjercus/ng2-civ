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
    this.switchUnit(new Coord(2, 0), new Settler());
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

  /**
  * 
  */
  onUpClick() {
  }
  onRightClick() {
    const startCoord: Coord = this.selectedTile.coord;
    const newCoord: Coord = new Coord(startCoord.x - 1, startCoord.y);
    this.switchUnit(startCoord, newCoord);
  }
  onDownClick() {}
  onLeftClick() {}

  /**
   * switch units on the board with 'memory' in class scope
   * @param {Coord} fromCoord
   * @param {Coord} toCoord
   */
  private switchUnit(fromCoord: Coord, toCoord: Coord) {
    // in case of first move on the board, including construction
    if (this.previousCoord === null) {
      this.previousCoord = toCoord;
      this.previousUnit = this.board.get(toCoord);
    }
    const toUnit: Unit = this.board.get(fromCoord);
    this.previousUnit = this.board.get(this.previousCoord);

    this.board.set(toCoord, toUnit);
    // set original surface (land/sea etc) unit back at previous coord
    this.board.set(this.previousCoord, this.previousUnit);

  }
}
