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
  private board: Board; // TODO use as a properly observed angular service?

  constructor(private cdr:ChangeDetectorRef) {}

  /**
   * Get the board OnInit
   */
  ngOnInit() {
    this.board = new Board(5);
    this.tiles = this.board.tiles;

    this.board.placeUnit(Coord.create(2,0), new Settler());
  }

  isSelected(tile: Tile): boolean {
    return this.selectedTile !== null && this.selectedTile.equals(tile);
  }

  onSelectTileClick(tile: Tile) {
    this.selectedTile = tile;
    console.log(`HomeComponent onSelectTileClick ${tile.toString()}`);
  }

  onUpClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Up);
  }
  onRightClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Right);
  }
  onDownClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Down);
  }
  onLeftClick() {
    this.selectedTile = this.board.moveUnit(this.selectedTile, Direction.Left);
  }
}
