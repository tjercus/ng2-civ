import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Settler} from "../shared/units";
import {Coord, Tile, Board, Direction} from "../shared/world";
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

  public tiles: Array<Tile> = [];

  private selectedTile: Tile = null;
  private board: Board; // TODO use as a properly observed angular service

  constructor(private cdr:ChangeDetectorRef) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.board = new Board(5);
    this.tiles = this.board.tiles;

    this.board.placeUnit(Coord.create(2,0), new Settler());
  }

  onSelectTileClick(tile: Tile) {
    this.selectedTile = tile;
    console.log(`HomeComponent onSelectTileClick ${tile.toString()}`);
  }

  onUpClick() {
  }

  onRightClick() {
    if (this.selectedTile) {
      // TODO move exception/error handling into function
      this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Right);
    } else {
      console.log("no move without a selected tile");
    }
  }
  onDownClick() {}
  onLeftClick() {
    if (this.selectedTile) {
      this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Left);
    } else {
      console.log("no move without a selected tile");
    }
  }
}
