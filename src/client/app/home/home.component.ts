import { Component, OnInit, DoCheck } from '@angular/core';
import {Settler, City} from "../shared/units";
import {Game, Tile, Board, Direction, Land, Sea} from "../shared/world";

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
  public grid: Array<Array<Tile>> = [[]];

  private board: Board = new Board(5); // TODO use as a properly observed angular service?
  public game: Game = new Game(this.board);

  constructor() {}

  /**
   * Get the board OnInit
   */
  ngOnInit() {
    this.grid = this.board.grid;
  }

  /**
   * Angular2 does not completely understand when the grid needs reloading,
   *  so this method forces a reload of the grid
   */
  ngDoCheck() {
    this.grid = this.board.grid;
  }

  setCssClasses(tile: Tile) {
    return {
      "tile-selected": this.isSelected(tile),
      "surface-sea": tile.surface instanceof Sea,
      "surface-land": tile.surface instanceof Land,
    }
  }

  isSelected(tile: Tile): boolean {
    return this.board.activeTile !== null && this.board.activeTile.equals(tile);
  }

  onSelectTileClick(tile: Tile) {
    this.board.activeTile = tile;
    console.log(`HomeComponent onSelectTileClick ${tile.toString()}`);
  }

  toggleContextMenu() {
    return this.board.activeTile &&
      this.board.activeTile.unit &&
      this.board.activeTile.unit instanceof Settler;
  }

  onUpClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Up);
  }
  onRightClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Right);
  }
  onDownClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Down);
  }
  onLeftClick() {
    this.board.activeTile = this.board.moveUnit(this.board.activeTile, Direction.Left);
  }

  onBuildRoadClick() {
    this.board.placeRoad(this.board.activeTile.coord);
  }
  onBuildCityClick() {
    this.board.placeCity(this.board.activeTile.coord, new City(), this.game.year);
  }

  onEndTurnClick() {
    this.game.endTurn();
  }
}
